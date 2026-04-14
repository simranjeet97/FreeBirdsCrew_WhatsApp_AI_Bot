const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'bot_data.db'));

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trigger TEXT NOT NULL,
    response TEXT NOT NULL,
    enabled BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    sender TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK(type IN ('inbound', 'outbound')) NOT NULL,
    status TEXT CHECK(status IN ('automated', 'manual')) DEFAULT 'manual'
  );

  CREATE TABLE IF NOT EXISTS ai_responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    sender TEXT NOT NULL,
    question TEXT NOT NULL,
    response TEXT NOT NULL,
    model TEXT DEFAULT 'gemini-3-flash-preview'
  );
`);

// Seed initial rules if empty
const ruleCount = db.prepare('SELECT COUNT(*) as count FROM rules').get().count;
if (ruleCount === 0) {
  const insertRule = db.prepare('INSERT INTO rules (trigger, response) VALUES (?, ?)');
  insertRule.run('hello', 'Hey! 👋 I\'m Simranjeet\'s AI assistant. Ask me about his GenAI projects, YouTube tutorials, Medium blogs, or book a session at topmate.io/simranjeet97');
  insertRule.run('hi', 'Hi there! 🤖 I\'m Simranjeet\'s bot. I can help with his GitHub projects, YouTube content, or schedule a 1:1 session. What are you looking for?');
  insertRule.run('help', 'I can help you with:\n• 📁 GitHub projects & code\n• 📺 YouTube tutorials\n• 📝 Medium blogs\n• 📅 Book a 1:1 session\n\nJust ask your question!');
  insertRule.run('github', '🚀 Check out Simranjeet\'s GitHub: https://github.com/simranjeet97\n\nTop repos:\n• Awsome_AI_Agents (155⭐)\n• Learn_RAG_from_Scratch_LLM\n• AgenticAI_AIAgents_Course');
  insertRule.run('youtube', '📺 YouTube Channel: https://www.youtube.com/@freebirdscrew2023\n\nTop playlists:\n• Agentic AI 14 Projects\n• Learn RAG from Scratch\n• LLM Fine Tuning');
  insertRule.run('book', '📅 Book a session with Simranjeet:\n\n🚀 Quick Connect:\nhttps://topmate.io/simranjeet97/743066\n\n🎯 1:1 GenAI & ML Guidance:\nhttps://topmate.io/simranjeet97/145435');
  insertRule.run('rag', '📚 Learn RAG from Scratch:\n• GitHub: https://github.com/simranjeet97/Learn_RAG_from_Scratch_LLM\n• YouTube: https://www.youtube.com/playlist?list=PLYIE4hvbWhsAKSZVAn5oX1k0oGQ6Mnf1d');
  insertRule.run('agent', '🤖 Agentic AI Resources:\n• GitHub (155⭐): https://github.com/simranjeet97/Awsome_AI_Agents\n• YouTube: https://www.youtube.com/playlist?list=PLYIE4hvbWhsAkn8VzMWbMOxetpaGp-p4k');
}

module.exports = {
  getRules: () => db.prepare('SELECT * FROM rules WHERE enabled = 1').all(),
  getAllRules: () => db.prepare('SELECT * FROM rules ORDER BY created_at DESC').all(),
  addRule: (trigger, response) => db.prepare('INSERT INTO rules (trigger, response) VALUES (?, ?)').run(trigger, response),
  deleteRule: (id) => db.prepare('DELETE FROM rules WHERE id = ?').run(id),
  toggleRule: (id, enabled) => db.prepare('UPDATE rules SET enabled = ? WHERE id = ?').run(enabled ? 1 : 0, id),
  
  addLog: (sender, message, type, status) => 
    db.prepare('INSERT INTO logs (sender, message, type, status) VALUES (?, ?, ?, ?)').run(sender, message, type, status),
  
  getLogs: (limit = 50) => 
    db.prepare('SELECT * FROM logs ORDER BY timestamp DESC LIMIT ?').all(limit),

  clearLogs: () => {
    db.prepare('DELETE FROM logs').run();
  },

  clearAIResponses: () => {
    db.prepare('DELETE FROM ai_responses').run();
  },

  addAIResponse: (sender, question, response) =>
    db.prepare('INSERT INTO ai_responses (sender, question, response) VALUES (?, ?, ?)').run(sender, question, response),

  getAIResponses: (limit = 20) =>
    db.prepare('SELECT * FROM ai_responses ORDER BY timestamp DESC LIMIT ?').all(limit),

  getStats: () => {
    const totalMessages = db.prepare('SELECT COUNT(*) as count FROM logs').get().count;
    const automatedReplies = db.prepare("SELECT COUNT(*) as count FROM logs WHERE status = 'automated'").get().count;
    const activeRules = db.prepare('SELECT COUNT(*) as count FROM rules WHERE enabled = 1').get().count;
    const aiReplies = db.prepare('SELECT COUNT(*) as count FROM ai_responses').get().count;
    return { totalMessages, automatedReplies, activeRules, aiReplies };
  }
};
