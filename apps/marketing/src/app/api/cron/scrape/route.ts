// Nightly scraper cron endpoint.
// Triggered by Vercel cron at 02:00 (see vercel.json).
// Manual trigger: curl -H "Authorization: Bearer $CRON_SECRET" https://.../api/cron/scrape

import { NextRequest, NextResponse } from 'next/server';
import { runScraper } from '@/lib/scraping/runner';
import { isAuthorizedCron } from '@/lib/cron-auth';

export const runtime = 'nodejs';
export const maxDuration = 60; // Vercel Pro caps at 300; Hobby at 10. Set to 60 for forward-compat.

export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}

async function handle(req: NextRequest) {
  if (!isAuthorizedCron(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const summary = await runScraper();
    return NextResponse.json({ status: 'ok', summary }, { status: 200 });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('[cron/scrape] fatal:', e);
    return NextResponse.json({ status: 'error', error: message }, { status: 500 });
  }
}
