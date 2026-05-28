'use client';

import { useState, useRef, useCallback } from 'react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ExtractedBescheid = {
  project_name: string;
  address: string;
  gemarkung: string;
  flur: string;
  flurstueck: string;
  bauantrag_nr: string;
  aktenzeichen: string;
  lifecycle_stage: string;
  bescheid_auflagen: string[];
  abstandsflaeche_nachbarn: string[];
  parse_confidence: 'high' | 'medium' | 'low';
  parse_notes?: string;
};

type Status =
  | { stage: 'idle' }
  | { stage: 'reading'; filename: string }
  | { stage: 'extracting'; filename: string }
  | { stage: 'done'; project_id: string; extracted: ExtractedBescheid }
  | { stage: 'error'; message: string };

export default function UploadPage() {
  const [status, setStatus] = useState<Status>({ stage: 'idle' });
  const [email, setEmail] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (file: File) => {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setStatus({ stage: 'error', message: 'Bitte zuerst eine gültige E-Mail-Adresse eintragen.' });
        return;
      }
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setStatus({ stage: 'error', message: 'Nur PDF-Bescheide werden akzeptiert.' });
        return;
      }

      setStatus({ stage: 'reading', filename: file.name });

      const fd = new FormData();
      fd.append('pdf', file);
      fd.append('email', email);

      setStatus({ stage: 'extracting', filename: file.name });

      try {
        const res = await fetch('/api/bescheid/upload', { method: 'POST', body: fd });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
        setStatus({ stage: 'done', project_id: json.project_id, extracted: json.extracted });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        setStatus({ stage: 'error', message: msg });
      }
    },
    [email],
  );

  const onFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;
      void upload(file);
    },
    [upload],
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      onFiles(e.dataTransfer.files);
    },
    [onFiles],
  );

  return (
    <main className="flex min-h-screen flex-col bg-black overflow-x-hidden pt-20">
      <Nav />

      <section className="flex-1 max-w-3xl mx-auto px-6 py-16 md:py-24 w-full">
        <p className="font-body text-xs tracking-[0.25em] uppercase text-blue mb-4">
          Bescheid hochladen
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-white leading-tight mb-6">
          Drei Minuten Setup. <span className="text-blue">Wir lesen den Rest.</span>
        </h1>
        <p className="font-body text-lg text-zinc-400 leading-relaxed mb-10">
          Lade Deinen Genehmigungs-Bescheid als PDF hoch. Wir extrahieren jede Auflage automatisch
          und vergleichen sie ab morgen jede Nacht gegen Bauamt-Änderungen.
        </p>

        {/* Email field */}
        <div className="mb-8">
          <label htmlFor="email" className="block text-xs tracking-[0.25em] uppercase text-zinc-500 mb-3">
            E-Mail · für Alerts
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="bauleiter@firma.de"
            className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue transition-colors"
            disabled={status.stage !== 'idle' && status.stage !== 'error'}
          />
        </div>

        {/* Drop zone */}
        <AnimatePresence mode="wait">
          {(status.stage === 'idle' || status.stage === 'error') && (
            <motion.div
              key="dropzone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
                className={`relative cursor-pointer rounded-xl border-2 border-dashed p-12 md:p-16 text-center transition-colors ${
                  dragOver
                    ? 'border-blue bg-blue/5'
                    : 'border-zinc-700 hover:border-zinc-500 bg-zinc-900/20'
                }`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  className="hidden"
                  onChange={(e) => onFiles(e.target.files)}
                />
                <Upload className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                <p className="font-serif text-xl md:text-2xl text-white mb-2">
                  Bescheid hier ablegen
                </p>
                <p className="font-body text-sm text-zinc-500">
                  PDF · max 12 MB · ein einzelner Bescheid pro Upload
                </p>
              </div>
              {status.stage === 'error' && (
                <div className="mt-4 p-4 rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 text-sm font-body flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{status.message}</span>
                </div>
              )}
            </motion.div>
          )}

          {(status.stage === 'reading' || status.stage === 'extracting') && (
            <motion.div
              key="working"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-10 text-center"
            >
              <Loader2 className="w-10 h-10 text-blue mx-auto mb-4 animate-spin" />
              <p className="font-serif text-xl text-white mb-2">
                {status.stage === 'reading' ? 'Lese PDF…' : 'Extrahiere Auflagen via Gemini…'}
              </p>
              <p className="font-body text-sm text-zinc-500">{status.filename}</p>
              <p className="font-body text-xs text-zinc-600 mt-4">
                Das dauert 10–30 Sekunden. Nicht schließen.
              </p>
            </motion.div>
          )}

          {status.stage === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-6 flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-serif text-xl text-white mb-1">Bescheid eingelesen.</p>
                  <p className="font-body text-sm text-zinc-400">
                    Projekt-ID <code className="text-emerald-300">{status.project_id.slice(0, 8)}</code> aktiv.
                    Ab Morgen 06:00 wachen wir über jede Auflage.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
                <p className="text-[10px] tracking-[0.3em] uppercase text-zinc-500 mb-3">Projekt</p>
                <p className="font-serif text-2xl text-white mb-1">{status.extracted.project_name || 'Unbenannt'}</p>
                <p className="font-body text-sm text-zinc-400 mb-6">
                  {status.extracted.address || '—'}
                  {status.extracted.bauantrag_nr && (
                    <>
                      {' · '}
                      <span className="font-mono text-xs text-zinc-500">{status.extracted.bauantrag_nr}</span>
                    </>
                  )}
                </p>

                <p className="text-[10px] tracking-[0.3em] uppercase text-blue mb-3">
                  {status.extracted.bescheid_auflagen.length} Auflagen erkannt
                </p>
                <ul className="space-y-2.5">
                  {status.extracted.bescheid_auflagen.map((a, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm bg-white/[0.03] border border-white/5 rounded-md px-3 py-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/60 flex items-center justify-center text-emerald-400 text-[10px] flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-zinc-300 flex-1">{a}</span>
                    </li>
                  ))}
                  {status.extracted.bescheid_auflagen.length === 0 && (
                    <li className="text-sm text-zinc-500 italic">
                      Keine expliziten Auflagen extrahiert — du wirst nur über generelle
                      Änderungen der Landesbauordnung benachrichtigt.
                    </li>
                  )}
                </ul>

                <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
                  <span>Confidence · {status.extracted.parse_confidence.toUpperCase()}</span>
                  <span>Gemeinde · {status.extracted.gemarkung || 'unbekannt'}</span>
                </div>
              </div>

              <button
                onClick={() => setStatus({ stage: 'idle' })}
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Weiteren Bescheid hochladen <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle footer note */}
        <p className="text-xs font-body text-zinc-600 mt-12 leading-relaxed">
          <FileText className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
          Das PDF wird nur einmalig durch Gemini gelesen und nicht gespeichert. Nur die
          extrahierten Auflagen + Projekt-Metadaten landen in unserer Datenbank.
        </p>
      </section>

      <Footer />
    </main>
  );
}
