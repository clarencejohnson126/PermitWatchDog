'use client';

import { useState } from 'react';

const faqs = [
  { q: "Wo funktioniert PermitWatchDog aktuell?", a: "Derzeit werten wir ausschließlich das Amtsblatt und städtische Bekanntmachungen der Stadt Mannheim aus. Eine Ausweitung auf den gesamten Rhein-Neckar-Kreis ist für Q4 geplant." },
  { q: "Ersetzt das System einen Baurechtler?", a: "Nein. PermitWatchDog ist ein Frühwarnsystem, kein Anwaltsersatz. Wir liefern Ihnen und Ihrem Architekten den VOB/B-konformen Erstentwurf, um Fristen zu wahren und Verzögerungen formal anzumelden." },
  { q: "Wie schnell ist PermitWatchDog?", a: "Die Behördendokumente werden nachts gescannt. Findet die KI eine Relevanz für Ihr Projekt, haben Sie den Alert samt Handlungsentwurf um 06:00 Uhr morgens in der Inbox." },
  { q: "Wie sieht es mit Datenschutz aus (DSGVO)?", a: "Wir verarbeiten nur die nötigsten Projektdaten (Adresse, Eck-Auflagen). Es findet kein Training der KI-Modelle mit Ihren sensiblen Projektdaten statt." },
  { q: "Wie lange dauert das Setup?", a: "Weniger als 5 Minuten. Sie registrieren sich, geben die Adresse Ihres Bauvorhabens sowie 1-2 Kern-Auflagen der Baugenehmigung an, und die Überwachung startet." },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-black py-32 border-t border-zinc-900">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-sans tracking-widest text-white mb-16 text-center uppercase">
          FAQ
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/50">
              <button 
                className="w-full text-left px-6 py-4 font-serif text-xl text-white flex justify-between items-center hover:bg-zinc-800 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                {faq.q}
                <span className="font-sans text-blue text-2xl">{open === i ? '-' : '+'}</span>
              </button>
              {open === i && (
                <div className="px-6 pb-6 pt-2 font-body text-zinc-400 leading-relaxed border-t border-zinc-800 mt-2">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
