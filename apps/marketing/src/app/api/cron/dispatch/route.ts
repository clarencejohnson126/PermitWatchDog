// Sends emails for all alerts where notified_at IS NULL.
// Triggered by Vercel cron at 06:00 UTC daily.

import { NextRequest, NextResponse } from 'next/server';
import { dispatchAlerts } from '@/lib/notifier/dispatch';
import { sendDailyStatus } from '@/lib/notifier/daily-status';
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
    // 1. Dispatch any unnotified alerts → Outlook drafts.
    const alerts = await dispatchAlerts();
    // 2. Always send a daily status mail per project (proof-of-life,
    //    even on 0 alerts). Without this the user has no signal that
    //    the system ran.
    const status = await sendDailyStatus();
    return NextResponse.json({ status: 'ok', alerts, daily_status: status });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('[cron/dispatch] fatal:', e);
    return NextResponse.json({ status: 'error', error: message }, { status: 500 });
  }
}
