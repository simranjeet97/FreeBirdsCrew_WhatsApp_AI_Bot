const fs = require('fs');
const path = require('path');

const WIKI_DIR = path.join(__dirname, '../wiki');

/**
 * Intent → wiki page file names mapping.
 * Based on the index.md routing table.
 */
const INTENT_PAGES = {
  about:            ['about_simranjeet.md'],
  github_projects:  ['github_projects.md', 'about_simranjeet.md'],
  youtube_content:  ['youtube_content.md', 'github_projects.md'],
  medium_blogs:     ['medium_blogs.md', 'about_simranjeet.md'],
  topmate_booking:  ['topmate_booking.md'],
  concepts:         ['concepts_knowledge.md', 'github_projects.md', 'youtube_content.md'],
  mentorship:       ['topmate_booking.md', 'about_simranjeet.md'],
  general:          ['about_simranjeet.md', 'github_projects.md'],
};

/**
 * Read a single wiki page by filename.
 * Returns file content as a string, or null if not found.
 */
function loadPage(filename) {
  const filePath = path.join(WIKI_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`[Wiki] Page not found: ${filename}`);
    return null;
  }
  return fs.readFileSync(filePath, 'utf-8');
}

/**
 * Load the wiki index file.
 */
function loadIndex() {
  return loadPage('index.md');
}

/**
 * Load the bot schema file.
 */
function loadSchema() {
  return loadPage('SCHEMA.md');
}

/**
 * Get the combined wiki context for a given intent.
 * Concatenates all relevant pages with headers.
 */
function getContextForIntent(intent) {
  const pages = INTENT_PAGES[intent] || INTENT_PAGES['general'];
  const dedupedPages = [...new Set(pages)]; // avoid duplicates
  
  const parts = dedupedPages
    .map(filename => {
      const content = loadPage(filename);
      if (!content) return null;
      const title = filename.replace('.md', '').replace(/_/g, ' ').toUpperCase();
      return `=== ${title} ===\n${content}`;
    })
    .filter(Boolean);
  
  return parts.join('\n\n---\n\n');
}

/**
 * Read a specific wiki page by name (without .md extension).
 * Used by API endpoints for the admin dashboard.
 */
function readWikiPage(pageName) {
  const filename = pageName.endsWith('.md') ? pageName : `${pageName}.md`;
  return loadPage(filename);
}

/**
 * Write/update a wiki page by name.
 * Used by API endpoints for admin wiki editing.
 */
function writeWikiPage(pageName, content) {
  const filename = pageName.endsWith('.md') ? pageName : `${pageName}.md`;
  const filePath = path.join(WIKI_DIR, filename);
  fs.writeFileSync(filePath, content, 'utf-8');
}

/**
 * List all wiki pages (excluding SCHEMA and log).
 */
function listWikiPages() {
  if (!fs.existsSync(WIKI_DIR)) return [];
  return fs.readdirSync(WIKI_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => ({
      name: f.replace('.md', ''),
      filename: f,
      size: fs.statSync(path.join(WIKI_DIR, f)).size,
      lastModified: fs.statSync(path.join(WIKI_DIR, f)).mtime
    }));
}

/**
 * Append an entry to the interaction log.
 */
function appendToLog(intent, questionSummary, responseSummary) {
  const logPath = path.join(WIKI_DIR, 'log.md');
  const now = new Date();
  const timestamp = now.toISOString().replace('T', ' ').substring(0, 16);
  
  const entry = `\n## [${timestamp}] query | ${questionSummary}\n- Intent: ${intent}\n- Response: ${responseSummary}\n`;
  
  try {
    fs.appendFileSync(logPath, entry, 'utf-8');
  } catch (err) {
    console.error('[Wiki] Failed to append to log:', err.message);
  }
}

module.exports = {
  loadIndex,
  loadSchema,
  loadPage,
  getContextForIntent,
  readWikiPage,
  writeWikiPage,
  listWikiPages,
  appendToLog,
  INTENT_PAGES,
};
