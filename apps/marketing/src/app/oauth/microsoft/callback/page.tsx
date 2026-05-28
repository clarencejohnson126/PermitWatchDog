'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

function CallbackContent() {
  const sp = useSearchParams();
  const code = sp.get('code');
  const state = sp.get('state');
  const errorParam = sp.get('error');
  const errorDescription = sp.get('error_description');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (errorParam) {
      setStatus('error');
      setErrorMsg(`${errorParam}: ${errorDescription ?? ''}`);
      return;
    }
    if (!code || !state) {
      setStatus('error');
      setErrorMsg('Microsoft hat keine Authorisierung mitgeschickt.');
      return;
    }
    fetch('/api/oauth/microsoft/exchange', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, state }),
    })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
        return json;
      })
      .then((data: { user_email: string }) => {
        setUserEmail(data.user_email);
        setStatus('success');
      })
      .catch((err: unknown) => {
        setStatus('error');
        setErrorMsg(err instanceof Error ? err.message : String(err));
      });
  }, [code, state, errorParam, errorDescription]);

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 max-w-md w-full">
        {status === 'loading' && (
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-blue mx-auto mb-4 animate-spin" />
            <h1 className="font-serif text-2xl text-white mb-2">Verbindung wird hergestellt…</h1>
            <p className="text-zinc-500 text-sm">Token wird mit Microsoft ausgetauscht.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h1 className="font-serif text-2xl text-white mb-3">Outlook verbunden.</h1>
            <p className="text-zinc-400 text-sm mb-2">
              Konto: <strong className="text-white font-mono">{userEmail}</strong>
            </p>
            <p className="text-zinc-500 text-sm leading-relaxed mb-8">
              Ab dem nächsten Treffer landen die Alerts als <strong className="text-zinc-300">Entwurf</strong>
              {' '}in deinem Outlook-Postfach — fertig formuliert, du musst nur noch „Senden“ drücken.
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center px-6 py-3 bg-blue hover:bg-blue-light text-white text-sm tracking-widest uppercase rounded transition-colors"
            >
              Bescheid hochladen
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h1 className="font-serif text-2xl text-white mb-3">Verbindung fehlgeschlagen</h1>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">{errorMsg}</p>
            <Link
              href="/oauth/microsoft/start"
              className="text-sm text-blue hover:text-blue-light"
            >
              Erneut versuchen →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
