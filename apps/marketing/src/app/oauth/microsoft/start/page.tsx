import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import crypto from 'crypto';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ email?: string }>;
}

export default async function StartOAuthPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const email = (params.email ?? '').toLowerCase().trim();

  async function connectOutlook(formData: FormData) {
    'use server';
    const userEmail = ((formData.get('email') as string | null) ?? '').toLowerCase().trim();
    if (!userEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      redirect('/oauth/microsoft/start?error=invalid_email');
    }

    const state = crypto.randomBytes(16).toString('hex');
    const cookieStore = await cookies();
    const cookieOpts = {
      httpOnly: true,
      path: '/',
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 600, // 10 minutes
    };
    cookieStore.set('oauth_state', state, cookieOpts);
    cookieStore.set('oauth_email', userEmail, cookieOpts);

    const clientId = process.env.MICROSOFT_CLIENT_ID!;
    const redirectUri =
      process.env.NODE_ENV === 'production'
        ? process.env.MICROSOFT_REDIRECT_URI_PROD!
        : process.env.MICROSOFT_REDIRECT_URI!;
    const scopes = process.env.MICROSOFT_SCOPES!;

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      response_mode: 'query',
      scope: scopes,
      state,
      prompt: 'consent', // force consent so refresh_token is always returned
    });
    redirect(`https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`);
  }

  return (
    <Suspense>
      <main className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 max-w-md w-full">
          <p className="text-xs tracking-[0.25em] uppercase text-blue-light mb-3">Outlook verbinden</p>
          <h1 className="font-serif text-3xl text-white mb-4 leading-tight">
            Alerts direkt in dein <span className="text-blue">Outlook-Postfach.</span>
          </h1>
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
            Wir bekommen <strong className="text-white">nur</strong> die Erlaubnis, Mail-Entwürfe
            in deinem Postfach zu erstellen. Kein Lesen, kein Senden ohne Bestätigung. Du
            kannst die Verbindung jederzeit in deinem Microsoft-Konto trennen.
          </p>

          <form action={connectOutlook}>
            <label htmlFor="email" className="block text-xs tracking-[0.25em] uppercase text-zinc-500 mb-3">
              E-Mail · zugeordnet zu deinem Bescheid
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={email}
              placeholder="bauleiter@firma.de"
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue transition-colors mb-6"
            />
            <button
              type="submit"
              className="w-full bg-blue hover:bg-blue-light text-white font-bold tracking-widest text-sm uppercase py-3 px-4 rounded transition-colors shadow-[0_0_25px_rgba(22,84,255,0.4)]"
            >
              Outlook verbinden
            </button>
          </form>

          <p className="text-xs text-zinc-600 mt-6 leading-relaxed">
            Erfordert ein Microsoft-365- oder Outlook.com-Konto. Wir speichern nur einen
            Refresh-Token — kein Passwort.
          </p>
        </div>
      </main>
    </Suspense>
  );
}
