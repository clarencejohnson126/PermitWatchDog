// Magic-link callback — Supabase redirects here after the user clicks
// the login link in their inbox. Exchange the URL `code` for a session,
// then bounce to `/dashboard` (or wherever `next` says).

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/dashboard';

  if (!code) {
    const fail = new URL('/login', url.origin);
    fail.searchParams.set('error', 'missing_code');
    return NextResponse.redirect(fail);
  }

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    const fail = new URL('/login', url.origin);
    fail.searchParams.set('error', 'exchange_failed');
    return NextResponse.redirect(fail);
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
