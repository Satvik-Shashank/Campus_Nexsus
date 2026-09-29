// Vercel serverless entry: the Express app handles every /api/* request.
// Static pages in public/ are served by Vercel's CDN.
// The SQLite database lives in /tmp (ephemeral) and is seeded with demo data on cold start.
import { getDb } from '../server/db.js';
import { seed } from '../server/seed.js';
import { createApp } from '../server/app.js';

// Initialise + seed on cold start (no-op when the database already has data).
// Errors here are intentionally surfaced so deployment problems are visible.
const db = getDb();
seed(db);

export default createApp();
