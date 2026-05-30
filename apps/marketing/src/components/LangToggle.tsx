'use client';

import { useLang } from '@/lib/i18n/LangContext';

/**
 * Two-letter language toggle pill. Pinned in the Nav so it's always visible.
 * Cookie persists across page loads; SSR pages default to German until the
 * client hydrates and re-reads the cookie.
 */
export default function LangToggle() {
  const { lang, setLang } = useLang();
  const next: 'en' | 'de' = lang === 'de' ? 'en' : 'de';
  return (
    <button
      onClick={() => setLang(next)}
      aria-label={`Switch to ${next === 'en' ? 'English' : 'Deutsch'}`}
      className="text-xs font-mono tracking-widest uppercase border border-zinc-700 hover:border-blue text-zinc-400 hover:text-white px-2.5 py-1 rounded transition-colors"
    >
      {lang.toUpperCase()} / <span className="text-zinc-600 group-hover:text-blue">{next.toUpperCase()}</span>
    </button>
  );
}
