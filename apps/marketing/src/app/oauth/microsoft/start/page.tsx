import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import crypto from 'crypto';

export default function StartOAuthPage() {
  async function connectOutlook() {
    'use server';
    const state = crypto.randomBytes(16).toString('hex');
    const cookieStore = await cookies();
    cookieStore.set('oauth_state', state, { httpOnly: true, path: '/' });

    const clientId = process.env.MICROSOFT_CLIENT_ID!;
    const redirectUri = process.env.NODE_ENV === 'production' 
      ? process.env.MICROSOFT_REDIRECT_URI_PROD!
      : process.env.MICROSOFT_REDIRECT_URI!;
    const scopes = process.env.MICROSOFT_SCOPES!;

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: redirectUri,
      response_mode: 'query',
      scope: scopes,
      state: state
    });

    const url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`;
    redirect(url);
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-white mb-4">Connect Outlook</h1>
        <p className="text-zinc-400 mb-8">
          Authorize PermitWatchDog to create email drafts in your Outlook account using the Microsoft Graph API.
        </p>
        
        <div className="bg-zinc-800 rounded p-4 mb-8">
          <p className="text-xs text-zinc-500 font-mono break-all">
            URL Pattern: https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=...&response_type=code&...
          </p>
        </div>

        <form action={connectOutlook}>
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Connect Outlook
          </button>
        </form>
      </div>
    </div>
  );
}
