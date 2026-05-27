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
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-2xl z-50">
      <h3 className="text-white font-semibold mb-2">Cookie-Einstellungen</h3>
      <p className="text-zinc-400 text-sm mb-4">
        Wir nutzen funktionale Cookies, um die Seite bereitzustellen. Sie können Ihre Einstellungen jederzeit anpassen.
      </p>
      <div className="flex gap-3">
        <button 
          onClick={accept}
          className="flex-1 bg-white text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-zinc-200 transition-colors"
        >
          Alle Akzeptieren
        </button>
        <button 
          onClick={accept}
          className="flex-1 bg-zinc-800 text-white border border-zinc-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-zinc-700 transition-colors"
        >
          Nur Notwendige
        </button>
      </div>
    </div>
  );
}
