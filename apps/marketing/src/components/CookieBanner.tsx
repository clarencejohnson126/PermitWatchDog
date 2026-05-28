"use client";

import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem("cookie_consent");
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[400px] bg-black border border-blue p-6 rounded-lg shadow-[0_0_30px_rgba(22,84,255,0.15)] z-50">
      <h3 className="text-white font-sans tracking-widest text-xl mb-2">COOKIE-EINSTELLUNGEN</h3>
      <p className="text-zinc-400 font-body text-sm leading-relaxed mb-6">
        Wir nutzen funktionale Cookies, um die Seite bereitzustellen. Sie können Ihre Einstellungen jederzeit anpassen.
      </p>
      <div className="flex gap-3">
        <button 
          onClick={accept}
          className="flex-1 bg-blue hover:bg-blue-light text-white px-4 py-3 rounded font-sans tracking-widest transition-colors shadow-[0_0_15px_rgba(22,84,255,0.3)]"
        >
          ALLE AKZEPTIEREN
        </button>
        <button 
          onClick={accept}
          className="flex-1 bg-transparent text-white border border-zinc-700 px-4 py-3 rounded font-sans tracking-widest hover:border-blue hover:text-blue-light transition-colors"
        >
          NUR NOTWENDIGE
        </button>
      </div>
    </div>
  );
}
