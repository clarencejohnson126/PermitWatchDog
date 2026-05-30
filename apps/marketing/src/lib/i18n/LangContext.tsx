'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Lang, StringKey } from './strings';
import { t as translate } from './strings';

interface LangContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: StringKey, vars?: Record<string, string | number>) => string;
}

const LangContext = createContext<LangContextValue>({
  lang: 'de',
  setLang: () => {},
  t: (k) => translate(k, 'de'),
});

const COOKIE_KEY = 'pwd_lang';

function readInitialLang(): Lang {
  if (typeof document === 'undefined') return 'de';
  const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_KEY}=(de|en)`));
  return (m?.[1] as Lang) ?? 'de';
}

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('de');

  useEffect(() => {
    setLangState(readInitialLang());
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    // 1-year cookie, root path, sameSite=Lax.
    document.cookie = `${COOKIE_KEY}=${l}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    document.documentElement.lang = l;
  }, []);

  const t = useCallback(
    (key: StringKey, vars?: Record<string, string | number>) => translate(key, lang, vars),
    [lang],
  );

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
