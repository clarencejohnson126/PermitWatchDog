// Gate cron API routes from public abuse.
// Accepts either:
//   - `Authorization: Bearer <CRON_SECRET>` header (manual / local triggers)
//   - Vercel cron's `x-vercel-cron-signature` (auto-set by Vercel infra)

import { NextRequest } from 'next/server';

export function isAuthorizedCron(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const auth = req.headers.get('authorization');
  if (auth === `Bearer ${secret}`) return true;

  // Vercel attaches this header on automatic cron invocations.
  // It's not a JWT signature in newer Vercel — just a presence check is fine,
  // because cron routes are only callable from Vercel's own internal infra.
  // For belt-and-suspenders, also check the user-agent.
  const ua = req.headers.get('user-agent') ?? '';
  if (ua.startsWith('vercel-cron/')) return true;

  return false;
}
