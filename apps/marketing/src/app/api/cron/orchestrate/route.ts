// Nightly orchestrator — runs after /api/cron/scrape.
// Picks up freshly-scraped filings and matches them against active projects.

import { NextRequest, NextResponse } from 'next/server';
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
  try {
    const summary = await runOrchestrator();
    return NextResponse.json({ status: 'ok', summary });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('[cron/orchestrate] fatal:', e);
    return NextResponse.json({ status: 'error', error: message }, { status: 500 });
  }
}
