import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { code, state } = await req.json();
    const cookieStore = await cookies();
    const storedState = cookieStore.get('oauth_state')?.value;

    if (!state || !storedState || state !== storedState) {
      return NextResponse.json({ error: 'CSRF validation failed' }, { status: 400 });
    }

    const clientId = process.env.MICROSOFT_CLIENT_ID!;
    const clientSecret = process.env.MICROSOFT_CLIENT_SECRET!;
    const redirectUri = process.env.NODE_ENV === 'production' 
      ? process.env.MICROSOFT_REDIRECT_URI_PROD!
      : process.env.MICROSOFT_REDIRECT_URI!;
    const scopes = process.env.MICROSOFT_SCOPES!;

    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
      scope: scopes
    });

    const res = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Token exchange failed:', errText);
      return NextResponse.json({ error: 'Token exchange failed', details: errText }, { status: res.status });
    }

    const data = await res.json();
    
    // Clear the state cookie
    cookieStore.delete('oauth_state');

    return NextResponse.json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in
    });
  } catch (error: any) {
    console.error('Exchange error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
