const { GoogleGenerativeAI } = require('@google/generative-ai');

const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

let genAI = null;
let model = null;

function getModel() {
  if (!model) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: MODEL_NAME });
  }
  return model;
}

/**
 * Classify the user's intent from their WhatsApp message.
 * Returns one of: about | github_projects | youtube_content | medium_blogs |
 *                 topmate_booking | concepts | mentorship | general
 */
async function classifyIntent(message) {
  const m = getModel();

  const prompt = `You are an intent classifier for a WhatsApp bot representing Simranjeet Singh, an AI/ML Engineer at Google who creates GenAI/LLM/RAG/Agentic AI educational content.

Classify the following WhatsApp message into exactly ONE of these intents:
- about           → asking who Simranjeet is, his background, what he does
- github_projects → asking about GitHub repos, source code, projects, code
- youtube_content → asking about YouTube videos, tutorials, playlists, watching
- medium_blogs    → asking about Medium blogs, articles, writing
- topmate_booking → wanting to connect, talk, book a call, schedule, hire
- concepts        → asking about GenAI/LLM/RAG/Agentic AI concepts, how things work
- mentorship      → asking for career guidance, mentorship, job advice, learning roadmap
- general         → greetings, help requests, anything else

Message: "${message}"

Respond with ONLY the intent label, nothing else. Example: github_projects`;

  try {
    const result = await m.generateContent(prompt);
    const text = result.response.text().trim().toLowerCase();
    
    const validIntents = ['about', 'github_projects', 'youtube_content', 'medium_blogs', 
                          'topmate_booking', 'concepts', 'mentorship', 'general'];
    
    // Find the matching intent (handle if model returned extra text)
    const matched = validIntents.find(intent => text.includes(intent));
    return matched || 'general';
  } catch (err) {
    console.error('[Gemini] classifyIntent error:', err.message);
    return 'general';
  }
}

/**
 * Generate a WhatsApp-friendly response using the wiki context and user message.
 */
async function generateResponse(userMessage, wikiContext, schema) {
  const m = getModel();

  const systemPrompt = `You are Simranjeet Singh's personal AI assistant on WhatsApp.
${schema}

KNOWLEDGE BASE (use only this to answer — do not make up links or projects):
${wikiContext}

WHATSAPP FORMATTING RULES:
- Use emojis naturally (🚀 📚 🤖 🎯 💡 ✅ 📺 👨‍💻 🔥)
- Keep responses concise and scannable — WhatsApp is not a web page
- Use line breaks generously
- Use bullets with • or - for lists
- Never use markdown headers (# ## ###) — they don't render in WhatsApp
- Always include direct clickable links when recommending a resource
- End with a helpful next step or call-to-action
- Maximum 500 words. Prefer shorter, punchy responses.
- Be warm, knowledgeable, and helpful — like a smart friend answering on behalf of Simranjeet`;

  const fullPrompt = `${systemPrompt}

User's WhatsApp message: "${userMessage}"

Write a helpful, natural WhatsApp reply:`;

  try {
    const result = await m.generateContent(fullPrompt);
    return result.response.text().trim();
  } catch (err) {
    console.error('[Gemini] generateResponse error:', err.message);
    return null; // will trigger fallback
  }
}

/**
 * Check if the Gemini API is configured and reachable.
 */
function isAvailable() {
  return !!process.env.GEMINI_API_KEY;
}

module.exports = { classifyIntent, generateResponse, isAvailable };
