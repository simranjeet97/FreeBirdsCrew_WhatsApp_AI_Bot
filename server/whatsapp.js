const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const db = require('./database/db');
const { processMessage } = require('./ai/intentRouter');
const { isAvailable } = require('./ai/gemini');

class WhatsAppBot {
  constructor(io) {
    this.io = io;
    this.status = 'DISCONNECTED';
    this.qr = null;
    this.llmEnabled = isAvailable();
    this.allowedGroups = (process.env.ALLOWED_GROUPS || '').split(',').map(id => id.trim()).filter(id => id.length > 0);

    if (this.llmEnabled) {
      console.log('✅ [Bot] LLM (Gemini) is ENABLED — AI-powered responses active');
    } else {
      console.log('⚠️  [Bot] LLM (Gemini) is DISABLED — no GEMINI_API_KEY found. Using keyword rules only.');
    }

    this._createClient();
  }

  _createClient() {
    this.client = new Client({
      authStrategy: new LocalAuth({
        dataPath: './.wwebjs_auth'
      }),
      webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
      },
      puppeteer: {
        args: [
          '--no-sandbox', 
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ],
        headless: true
      }
    });

    this.init();
  }

  init() {
    this.client.on('qr', async (qr) => {
      console.log('QR Received', qr);
      this.qr = await qrcode.toDataURL(qr);
      this.status = 'WAITING_FOR_SCAN';
      
      // If we are getting a QR code, it means we are not logged in.
      // Automatically wipe old session traces so they don't appear to new users.
      try {
        db.clearLogs();
        if (db.clearAIResponses) db.clearAIResponses();
        this.io.emit('logs', []);
        this.io.emit('stats', db.getStats());
      } catch (err) {
        console.error('Error clearing old logs on new QR:', err);
      }

      this.io.emit('status', { status: this.status, qr: this.qr });
    });

    this.client.on('ready', async () => {
      console.log('Client is ready!');
      this.status = 'READY';
      this.qr = null;
      this.io.emit('status', { status: this.status, llmEnabled: this.llmEnabled });
      this.io.emit('stats', db.getStats());

      // Fetch and print all group IDs to help user configure ALLOWED_GROUPS
      try {
        const chats = await this.client.getChats();
        const groups = chats.filter(chat => chat.isGroup);
        console.log('\n=== YOUR WHATSAPP GROUPS (USE THESE IDs IN .env) ===');
        groups.forEach(group => {
          console.log(`- Name: "${group.name}"  ->  ID: ${group.id._serialized}`);
        });
        console.log('====================================================\n');
      } catch (err) {
        console.error('Failed to fetch groups:', err);
      }
    });

    this.client.on('authenticated', () => {
      console.log('Authenticated');
      this.status = 'AUTHENTICATED';
      this.io.emit('status', { status: this.status });
    });

    this.client.on('auth_failure', (msg) => {
      console.error('Auth failure', msg);
      this.status = 'AUTH_FAILURE';
      this.io.emit('status', { status: this.status, error: msg });
    });

    this.client.on('disconnected', (reason) => {
      console.log('Client was logged out or disconnected', reason);
      try {
        db.clearLogs();
        if (db.clearAIResponses) db.clearAIResponses();
        this.io.emit('logs', []);
        this.io.emit('stats', db.getStats());
      } catch (err) {}
      this.status = 'DISCONNECTED';
      this.qr = null;
      this.io.emit('status', { status: this.status });
      // Clean auth session and restart
      const fs = require('fs');
      if (fs.existsSync('./.wwebjs_auth')) {
        fs.rmSync('./.wwebjs_auth', { recursive: true, force: true });
      }
      this._createClient();
    });

    this.client.on('message', async (msg) => {
      // Ignore WhatsApp Status/Stories
      if (msg.from === 'status@broadcast' || msg.isStatus) {
        return; // silently ignore
      }

      console.log(`📩 Message from ${msg.from}: "${msg.body}"`);
      
      // Whitelist check
      if (this.allowedGroups.length > 0 && !this.allowedGroups.includes(msg.from)) {
        console.log(`⏭️  Skipping message from ${msg.from} (not in ALLOWED_GROUPS)`);
        return;
      }
      
      // Log inbound message
      db.addLog(msg.from, msg.body, 'inbound', 'manual');
      this.io.emit('message', { 
        id: Date.now(), 
        sender: msg.from, 
        message: msg.body, 
        type: 'inbound', 
        timestamp: new Date() 
      });
      this.io.emit('stats', db.getStats());

      let replied = false;

      // ─── Step 1: Try LLM pipeline ───────────────────────────────────────────
      if (this.llmEnabled && msg.body && msg.body.trim().length > 0) {
        try {
          const aiResponse = await processMessage(msg.from, msg.body);
          
          if (aiResponse) {
            await msg.reply(aiResponse);
            replied = true;

            // Log AI-generated outbound message
            db.addLog(msg.to || 'bot', aiResponse, 'outbound', 'automated');
            db.addAIResponse(msg.from, msg.body, aiResponse);

            this.io.emit('message', { 
              id: Date.now() + 1, 
              sender: 'BOT (AI)', 
              message: aiResponse, 
              type: 'outbound', 
              timestamp: new Date(),
              status: 'automated',
              source: 'llm'
            });
            this.io.emit('stats', db.getStats());
          }
        } catch (err) {
          console.error('[Bot] LLM pipeline failed, falling back to rules:', err.message);
        }
      }

      // ─── Step 2: Fallback to keyword-rule engine ─────────────────────────────
      if (!replied) {
        const rules = db.getRules();
        const lowerMsg = msg.body.toLowerCase();
        
        for (const rule of rules) {
          if (lowerMsg.includes(rule.trigger.toLowerCase())) {
            await msg.reply(rule.response);
            
            // Log rule-based outbound
            db.addLog(msg.to || 'bot', rule.response, 'outbound', 'automated');
            this.io.emit('message', { 
              id: Date.now() + 1, 
              sender: 'BOT (Rule)', 
              message: rule.response, 
              type: 'outbound', 
              timestamp: new Date(),
              status: 'automated',
              source: 'rule'
            });
            this.io.emit('stats', db.getStats());
            break;
          }
        }
      }
    });

    this.client.initialize().catch(err => {
      console.error('Initialization error:', err);
      this.status = 'ERROR';
      this.io.emit('status', { status: 'ERROR', error: err.message });
    });
  }

  getStatus() {
    return { status: this.status, qr: this.qr, llmEnabled: this.llmEnabled };
  }

  async resetSession() {
    console.log('[Bot] Resetting session...');
    this.status = 'DISCONNECTING';
    this.io.emit('status', { status: this.status });
    
    try {
      if (this.client) {
        await this.client.logout().catch(err => console.error('Logout error:', err.message));
        await this.client.destroy().catch(err => console.error('Destroy error:', err.message));
      }
    } catch(err) {
      console.error('Error during client cleanup:', err);
    }

    const fs = require('fs');
    if (fs.existsSync('./.wwebjs_auth')) {
      fs.rmSync('./.wwebjs_auth', { recursive: true, force: true });
    }
    
    this.status = 'DISCONNECTED';
    this.qr = null;
    this.io.emit('status', { status: this.status });
    
    console.log('[Bot] Re-initializing client...');
    this._createClient();
  }
}

module.exports = WhatsAppBot;
