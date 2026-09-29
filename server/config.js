import path from 'node:path';
import { fileURLToPath } from 'node:url';

// On Vercel, the function bundle may run from a different directory than
// where import.meta.url resolves to. process.cwd() reliably points to the
// project root in both local and Vercel serverless environments.
export const ROOT = process.env.VERCEL
  ? process.cwd()
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Load .env if present. Use process.loadEnvFile when available (Node >= 21.7),
// otherwise fall back gracefully (e.g. older runtimes).
// On Vercel, env vars are set via the dashboard — never read from .env.
if (!process.env.VERCEL) {
  try {
    if (typeof process.loadEnvFile === 'function') {
      process.loadEnvFile(path.join(ROOT, '.env'));
    }
  } catch { /* no .env file — use environment variables / defaults */ }
}

const bool = (v, d) => (v === undefined || v === '' ? d : /^(1|true|yes|on)$/i.test(v));

const DEV_SECRET = 'dev-only-insecure-secret-change-me';

export const config = {
  port: Number(process.env.PORT) || 3000,
  // On Vercel only /tmp is writable (and ephemeral), so the demo DB lives there.
  databasePath: process.env.DATABASE_PATH
    ? path.resolve(ROOT, process.env.DATABASE_PATH)
    : process.env.VERCEL
      ? '/tmp/nexus.db'
      : path.join(ROOT, 'data', 'nexus.db'),
  sessionSecret: process.env.SESSION_SECRET || DEV_SECRET,
  sessionTtlHours: Number(process.env.SESSION_TTL_HOURS) || 72,
  cookieSecure: bool(process.env.COOKIE_SECURE, !!process.env.VERCEL),
  demoMode: bool(process.env.DEMO_MODE, true),
  seedPassword: process.env.SEED_DEMO_PASSWORD || 'Demo@1234',
  allowedEmailDomain: (process.env.ALLOWED_EMAIL_DOMAIN || '').trim().toLowerCase(),
};

// Warn in production if SESSION_SECRET is not set — but do NOT throw, because
// Vercel cold-starts happen before env vars can be validated interactively.
// The app will work but sessions won't be secure across restarts.
if (config.sessionSecret === DEV_SECRET && process.env.NODE_ENV === 'production') {
  console.warn(
    '[WARN] SESSION_SECRET is not set. ' +
    'Set it in Vercel project settings → Environment Variables to secure user sessions.',
  );
}
