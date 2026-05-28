// Microsoft OAuth code exchange.
// Reads ?code + state from the callback, validates the CSRF state cookie
// and the user_email cookie set in /oauth/microsoft/start, exchanges
// code → tokens with Microsoft, and PERSISTS the refresh_token into
// permit_watchdog.oauth_tokens (upsert by [user_email, provider]).
//
// Returns only a `connected` flag + the user_email — the refresh_token
// is never exposed to the client.

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db/prisma';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { code, state } = (await req.json()) as { code?: string; state?: string };

    if (!code || !state) {
      return NextResponse.json({ error: 'missing code or state' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const storedState = cookieStore.get('oauth_state')?.value;
    const storedEmail = cookieStore.get('oauth_email')?.value;
    if (!storedState || storedState !== state) {
      return NextResponse.json({ error: 'CSRF state mismatch' }, { status: 400 });
    }
    if (!storedEmail) {
      return NextResponse.json({ error: 'missing user email in session' }, { status: 400 });
    }

    const clientId = process.env.MICROSOFT_CLIENT_ID;
    const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
    const redirectUri = process.env.NODE_ENV === 'production'
      ? process.env.MICROSOFT_REDIRECT_URI_PROD
      : process.env.MICROSOFT_REDIRECT_URI;
    const scopes = process.env.MICROSOFT_SCOPES;

    if (!clientId || !clientSecret || !redirectUri || !scopes) {
      return NextResponse.json({ error: 'Microsoft OAuth env vars missing' }, { status: 500 });
    }

    const tokenRes = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        scope: scopes,
      }).toString(),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error('[oauth/microsoft/exchange] Microsoft token endpoint failed:', errText);
      return NextResponse.json(
        { error: 'token exchange failed', details: errText.slice(0, 500) },
        { status: tokenRes.status },
      );
    }

    const data = (await tokenRes.json()) as {
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
      scope?: string;
    };

    if (!data.refresh_token) {
      return NextResponse.json(
        { error: 'no refresh_token returned — ensure offline_access scope is requested' },
        { status: 500 },
      );
    }

    const expiresAt = data.expires_in
      ? new Date(Date.now() + (data.expires_in - 60) * 1000)
      : null;

    await prisma.oAuthToken.upsert({
      where: {
        user_email_provider: { user_email: storedEmail, provider: 'microsoft' },
      },
      create: {
        user_email: storedEmail,
        provider: 'microsoft',
        refresh_token: data.refresh_token,
        access_token: data.access_token ?? null,
        expires_at: expiresAt,
        scope: data.scope ?? scopes,
      },
      update: {
        refresh_token: data.refresh_token,
        access_token: data.access_token ?? null,
        expires_at: expiresAt,
        scope: data.scope ?? scopes,
      },
    });

    cookieStore.delete('oauth_state');
    cookieStore.delete('oauth_email');

    return NextResponse.json({ connected: true, user_email: storedEmail });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('[oauth/microsoft/exchange] fail:', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
