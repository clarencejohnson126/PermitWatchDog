// Sends emails for all alerts where notified_at IS NULL.
// Triggered by Vercel cron at 06:00 UTC daily.

import { NextRequest, NextResponse } from 'next/server';
import { dispatchAlerts } from '@/lib/notifier/dispatch';
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
    const summary = await dispatchAlerts();
    return NextResponse.json({ status: 'ok', summary });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('[cron/dispatch] fatal:', e);
    return NextResponse.json({ status: 'error', error: message }, { status: 500 });
  }
}
