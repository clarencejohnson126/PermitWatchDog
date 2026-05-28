// Combined nightly endpoint — Vercel Hobby allows only 2 cron jobs, so we
// fuse scrape + orchestrate into a single 02:00 run. dispatch stays a
// separate 06:00 cron (so users wake up to a finished email, not an
// in-flight pipeline).

import { NextRequest, NextResponse } from 'next/server';
import { runScraper } from '@/lib/scraping/runner';
import { runOrchestrator } from '@/lib/orchestrator/run';
import { isAuthorizedCron } from '@/lib/cron-auth';

export const runtime = 'nodejs';
export const maxDuration = 60;

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
  const started_at = new Date();
  try {
    const scrape = await runScraper();
    const orchestrate = await runOrchestrator();
    return NextResponse.json({
      status: 'ok',
      started_at: started_at.toISOString(),
      scrape,
      orchestrate,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('[cron/nightly] fatal:', e);
    return NextResponse.json({ status: 'error', error: message }, { status: 500 });
  }
}
