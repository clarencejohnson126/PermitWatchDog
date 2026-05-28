// Local backfill script — no Vercel timeout, can run for as long as needed.
// Usage:
//   npm run backfill                       # incremental (uses last run as since)
//   npm run backfill -- --since 2026-01-01 # explicit since
//   npm run backfill -- --full             # ignore since, scrape everything
//   npm run backfill -- --dry-run          # no DB writes
//
// Reads DATABASE_URL from apps/marketing/.env.local.

import { config } from 'dotenv';
import { resolve } from 'path';
// Load .env.local first (Next.js convention), then .env as fallback.
config({ path: resolve(__dirname, '../.env.local') });
config({ path: resolve(__dirname, '../.env') });

import { runScraper } from '../src/lib/scraping/runner';

function parseArgs(): { since?: Date; full?: boolean; dryRun?: boolean } {
  const args = process.argv.slice(2);
  const out: ReturnType<typeof parseArgs> = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--since' && args[i + 1]) {
      out.since = new Date(args[++i]);
    } else if (args[i] === '--full') {
      out.full = true;
    } else if (args[i] === '--dry-run') {
      out.dryRun = true;
    }
  }
  return out;
}

async function main() {
  const args = parseArgs();
  const opts = {
    since: args.full ? new Date(0) : args.since,
    dryRun: args.dryRun,
  };
  console.log(`[backfill] starting`, opts);
  const summary = await runScraper(opts);
  console.log('[backfill] done:', JSON.stringify(summary, null, 2));
}

main().catch((e) => {
  console.error('[backfill] failed:', e);
  process.exit(1);
});
