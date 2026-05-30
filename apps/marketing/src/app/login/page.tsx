'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { useLang } from '@/lib/i18n/LangContext';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';

function LoginInner() {
  const { lang } = useLang();
  const sp = useSearchParams();
  const next = sp.get('next') ?? '/dashboard';
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const sendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase().trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) throw error;
      setStatus('sent');
    } catch (e) {
      setStatus('error');
      setErrorMsg(e instanceof Error ? e.message : String(e));
    }
  };

  const tCopy = lang === 'en'
    ? {
        eyebrow: 'Sign in',
        title: 'One link. No password.',
        body: 'Enter your email. We send you a one-time login link. Same email you used for your permits.',
        button: 'Send magic link',
        sending: 'Sending…',
        sent: 'Check your inbox',
        sentBody: 'We sent a one-time login link to {email}. Click it to enter your dashboard.',
        retry: 'Different email',
      }
    : {
        eyebrow: 'Login',
        title: 'Ein Link. Kein Passwort.',
        body: 'E-Mail eintragen, wir schicken einen einmaligen Login-Link. Gleiche E-Mail wie beim Bescheid-Upload.',
        button: 'Magic-Link senden',
        sending: 'Sende…',
        sent: 'Postfach prüfen',
        sentBody: 'Wir haben einen einmaligen Login-Link an {email} geschickt. Klick auf den Link um zum Dashboard zu kommen.',
        retry: 'Andere E-Mail',
      };

  return (
    <main className="flex min-h-screen flex-col bg-black overflow-x-hidden pt-20">
      <Nav />
      <section className="flex-1 max-w-md mx-auto px-6 py-24 w-full">
        {status !== 'sent' && (
          <>
            <p className="text-xs tracking-[0.25em] uppercase text-blue mb-4">{tCopy.eyebrow}</p>
            <h1 className="font-serif text-4xl text-white leading-tight mb-4">
              {tCopy.title}
            </h1>
            <p className="text-zinc-400 text-sm mb-8 leading-relaxed">{tCopy.body}</p>
            <form onSubmit={sendMagicLink} className="space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="bauleiter@firma.de"
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue text-sm"
                disabled={status === 'sending'}
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full bg-blue hover:bg-blue-light text-white text-xs tracking-widest uppercase font-bold py-3 rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {status === 'sending' ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> {tCopy.sending}</>
                ) : (
                  <><Mail className="w-4 h-4" /> {tCopy.button}</>
                )}
              </button>
              {status === 'error' && (
                <p className="text-red-400 text-xs mt-2">{errorMsg}</p>
              )}
            </form>
          </>
        )}

        {status === 'sent' && (
          <div className="text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h1 className="font-serif text-3xl text-white mb-3">{tCopy.sent}</h1>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              {tCopy.sentBody.replace('{email}', email)}
            </p>
            <button
              onClick={() => { setStatus('idle'); setEmail(''); }}
              className="text-sm text-blue hover:text-blue-light"
            >
              {tCopy.retry}
            </button>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white" />}>
      <LoginInner />
    </Suspense>
  );
}
