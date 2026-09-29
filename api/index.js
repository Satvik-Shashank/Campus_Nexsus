// Vercel serverless entrypoint: routes /api/* to Express app.
// Static pages in public/ are served by Vercel's CDN.
import { getDb } from '../server/db.js';
import { seed } from '../server/seed.js';
import { createApp } from '../server/app.js';

let app;
let initialized = false;

function ensureInitialized() {
  if (!initialized) {
    try {
      const db = getDb();
      seed(db);
    } catch (err) {
      console.error('[Vercel Serverless Init Warning]:', err);
    }
    initialized = true;
  }
}

export default function handler(req, res) {
  if (!app) {
    app = createApp();
  }
  ensureInitialized();
  return app(req, res);
}
