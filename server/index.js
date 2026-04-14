require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const WhatsAppBot = require('./whatsapp');
const db = require('./database/db');
const wiki = require('./ai/wiki');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// ─── Existing API Endpoints ──────────────────────────────────────────────────

app.get('/api/stats', (req, res) => {
  res.json(db.getStats());
});

app.get('/api/rules', (req, res) => {
  res.json(db.getAllRules());
});

app.post('/api/rules', (req, res) => {
  const { trigger, response } = req.body;
  if (!trigger || !response) return res.status(400).json({ error: 'Missing trigger or response' });
  db.addRule(trigger, response);
  res.json({ success: true });
  io.emit('rules_updated', db.getAllRules());
  io.emit('stats', db.getStats());
});

app.delete('/api/rules/:id', (req, res) => {
  db.deleteRule(req.params.id);
  res.json({ success: true });
  io.emit('rules_updated', db.getAllRules());
  io.emit('stats', db.getStats());
});

app.patch('/api/rules/:id/toggle', (req, res) => {
  const { enabled } = req.body;
  db.toggleRule(req.params.id, enabled);
  res.json({ success: true });
  io.emit('rules_updated', db.getAllRules());
  io.emit('stats', db.getStats());
});

app.get('/api/logs', (req, res) => {
  res.json(db.getLogs());
});

app.post('/api/reset-session', async (req, res) => {
  if (bot) {
    try {
      // Clear logs from DB FIRST to prevent nodemon restart race conditions
      db.clearLogs();
      if (db.clearAIResponses) db.clearAIResponses();
      
      // Emit cleared logs and reset stats to frontend immediately
      io.emit('logs', []);
      io.emit('stats', db.getStats());

      // Then reset session (which deletes .wwebjs_auth and triggers nodemon restart natively)
      await bot.resetSession();
      
      res.json({ success: true, message: 'Session reset triggered and logs cleared' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(500).json({ error: 'Bot not initialized' });
  }
});

// ─── New: AI / Wiki API Endpoints ────────────────────────────────────────────

/** List all wiki pages */
app.get('/api/wiki', (req, res) => {
  const pages = wiki.listWikiPages();
  res.json(pages);
});

/** Read a specific wiki page */
app.get('/api/wiki/:page', (req, res) => {
  const content = wiki.readWikiPage(req.params.page);
  if (!content) return res.status(404).json({ error: 'Wiki page not found' });
  res.json({ name: req.params.page, content });
});

/** Update a wiki page (admin use) */
app.post('/api/wiki/:page', (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Missing content' });
  try {
    wiki.writeWikiPage(req.params.page, content);
    res.json({ success: true, message: `Wiki page '${req.params.page}' updated.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/** Get AI response history */
app.get('/api/ai-responses', (req, res) => {
  res.json(db.getAIResponses());
});

/** Health check with LLM status */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    llmEnabled: !!process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || 'gemini-3-flash-preview',
    wikiPages: wiki.listWikiPages().length,
    timestamp: new Date().toISOString()
  });
});

// ─── Initialize WhatsApp Bot ─────────────────────────────────────────────────

const bot = new WhatsAppBot(io);

io.on('connection', (socket) => {
  console.log('Client connected');
  
  // Send initial state
  socket.emit('status', bot.getStatus());
  socket.emit('stats', db.getStats());
  socket.emit('rules', db.getAllRules());
  socket.emit('logs', db.getLogs());

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Wiki pages loaded: ${wiki.listWikiPages().length}`);
  console.log(`🤖 LLM enabled: ${!!process.env.GEMINI_API_KEY}`);
});
