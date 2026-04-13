const gemini = require('./gemini');
const wiki = require('./wiki');

/**
 * Rate-limiting: track last message time per sender to avoid abuse.
 * Map<sender, timestamp>
 */
const lastRequestTime = new Map();
const MIN_REQUEST_INTERVAL_MS = 2000; // 2 seconds between requests per sender

/**
 * Main LLM pipeline:
 * 1. Check rate limit
 * 2. Classify intent
 * 3. Load relevant wiki context
 * 4. Generate response via Gemini
 * 5. Log interaction
 *
 * @param {string} senderNumber - WhatsApp number (for rate limiting)
 * @param {string} messageText  - User's message
 * @returns {string|null}       - AI response string, or null to trigger fallback
 */
async function processMessage(senderNumber, messageText) {
  // Rate limiting check
  const now = Date.now();
  const lastTime = lastRequestTime.get(senderNumber) || 0;
  if (now - lastTime < MIN_REQUEST_INTERVAL_MS) {
    console.log(`[IntentRouter] Rate limited: ${senderNumber}`);
    return null; // will use fallback
  }
  lastRequestTime.set(senderNumber, now);

  try {
    // Step 1: Classify intent
    console.log(`[IntentRouter] Classifying message: "${messageText.substring(0, 50)}..."`);
    const intent = await gemini.classifyIntent(messageText);
    console.log(`[IntentRouter] Intent classified: ${intent}`);

    // Step 2: Load wiki context for this intent
    const wikiContext = wiki.getContextForIntent(intent);
    const schema = wiki.loadSchema();

    if (!wikiContext) {
      console.warn('[IntentRouter] No wiki context loaded, falling back');
      return null;
    }

    // Step 3: Generate response
    const response = await gemini.generateResponse(messageText, wikiContext, schema);

    if (!response) {
      return null; // triggers fallback
    }

    // Step 4: Log the interaction
    const questionSummary = messageText.substring(0, 80).replace(/\n/g, ' ');
    const responseSummary = `Intent: ${intent} — replied with wiki context from ${(wiki.INTENT_PAGES[intent] || []).join(', ')}`;
    wiki.appendToLog(intent, questionSummary, responseSummary);

    return response;

  } catch (err) {
    console.error('[IntentRouter] Pipeline error:', err.message);
    return null; // always gracefully fall back
  }
}

module.exports = { processMessage };
