'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function CallbackContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const errorParam = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  useEffect(() => {
    if (errorParam) {
      setStatus('error');
      setErrorMessage(`${errorParam}: ${errorDescription}`);
      return;
    }

    if (!code || !state) {
      setStatus('error');
      setErrorMessage('Missing code or state in URL parameters.');
      return;
    }

    fetch('/api/oauth/microsoft/exchange', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, state })
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }
        return res.json();
      })
      .then((data) => {
        setRefreshToken(data.refresh_token);
        setStatus('success');
      })
      .catch((err) => {
        setStatus('error');
        setErrorMessage(err.message);
      });
  }, [code, state, errorParam, errorDescription]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-2xl w-full">
        {status === 'loading' && (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Exchanging Token...</h1>
            <p className="text-zinc-400">Please wait while we secure your connection.</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Connection Failed</h1>
            <p className="text-zinc-400 mb-4">{errorMessage}</p>
            <p className="text-zinc-500 text-sm">Please try connecting again from the start page.</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <h1 className="text-2xl font-bold text-green-500 mb-4">Successfully Connected!</h1>
            <p className="text-white mb-4">
              Your Outlook connection is authorized. Please perform the following one-time manual setup step:
            </p>
            <div className="bg-zinc-950 border border-zinc-800 rounded p-4 mb-6">
              <p className="text-sm text-zinc-400 mb-2">
                Paste this into <code className="bg-zinc-800 px-1 py-0.5 rounded text-white">services/notifier/.env.local</code> as <code className="bg-zinc-800 px-1 py-0.5 rounded text-white">OUTLOOK_REFRESH_TOKEN</code>, then close this tab — this is the only time you'll see it:
              </p>
              <textarea 
                readOnly 
                className="w-full bg-black border border-zinc-800 text-zinc-300 p-3 rounded font-mono text-sm h-32 outline-none"
                value={refreshToken}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>}>
      <CallbackContent />
    </Suspense>
  );
}
