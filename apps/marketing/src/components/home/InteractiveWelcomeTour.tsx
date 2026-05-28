'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, ArrowRight } from 'lucide-react';

type Chapter = {
  id: string;
  eyebrow: string;
  heading: React.ReactNode;
  body: React.ReactNode;
  Visual: React.ComponentType<{ active: boolean }>;
};

// ───────────────────────────────────────────────────────────────────
// VISUALS — one per chapter, pure code, no shared images with the rest of the site
// ───────────────────────────────────────────────────────────────────

function PermitCardVisual({ active }: { active: boolean }) {
  const auflagen = [
    { code: 'Auflage 01', text: 'DIN 4109 — Schallschutz' },
    { code: 'Auflage 02', text: 'Solarpflicht BW § 8a EWärmeG' },
    { code: 'Auflage 03', text: 'Brandschutz GK 4 nach MBO' },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      <motion.div
        initial={{ rotateY: -8, rotateX: 4 }}
        animate={active ? { rotateY: 0, rotateX: 0 } : { rotateY: -8, rotateX: 4 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        style={{ transformStyle: 'preserve-3d', perspective: 1200 }}
        className="w-full max-w-md bg-gradient-to-br from-zinc-900 to-black border border-blue/40 rounded-xl p-7 shadow-[0_30px_80px_-20px_rgba(22,84,255,0.45)]"
      >
        <div className="flex items-center justify-between mb-5">
          <span className="text-[10px] tracking-[0.3em] uppercase text-blue-light">Baugenehmigung</span>
          <span className="text-[10px] tracking-widest text-emerald-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Aktiv
          </span>
        </div>
        <p className="font-serif text-2xl text-white mb-1">Mehrfamilienhaus · 10 WE</p>
        <p className="text-sm text-zinc-400 mb-6">Q5, 18 — Mannheim</p>

        <p className="text-[10px] tracking-[0.25em] uppercase text-zinc-500 mb-3">Auflagen im Bescheid</p>
        <div className="space-y-2.5">
          {auflagen.map((a, i) => (
            <motion.div
              key={a.code}
              initial={{ opacity: 0, x: -10 }}
              animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ delay: 0.3 + i * 0.18, duration: 0.5 }}
              className="flex items-center gap-3 text-sm bg-white/[0.03] border border-white/5 rounded-md px-3 py-2.5"
            >
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/60 flex items-center justify-center text-emerald-400 text-[10px]">✓</span>
              <span className="text-zinc-300 font-mono text-xs">{a.code}</span>
              <span className="text-zinc-400 text-xs flex-1">{a.text}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 pt-5 border-t border-white/5">
          <div className="flex items-center justify-between text-[10px] tracking-widest uppercase text-zinc-500 mb-2">
            <span>Rohbau</span>
            <span>62%</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={active ? { width: '62%' } : { width: 0 }}
              transition={{ delay: 1.1, duration: 1.2, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-blue to-blue-light"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DoctrineShieldsVisual({ active }: { active: boolean }) {
  const layers = [
    { name: 'Bestandsschutz', ref: 'Art. 14 GG' },
    { name: 'Vertrauensschutz', ref: '§§ 48–49 VwVfG' },
    { name: 'Verhältnismäßigkeit', ref: 'Art. 20 III GG' },
    { name: 'Übergangsregelungen', ref: 'BauGB / LBO' },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8 overflow-hidden">
      <div className="relative w-full max-w-md space-y-3">
        {layers.map((layer, i) => (
          <motion.div
            key={layer.name}
            initial={{ opacity: 0, x: 30 }}
            animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.55, ease: 'easeOut' }}
            className="relative flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue/15 via-blue/[0.06] to-transparent border border-blue/30 rounded-lg backdrop-blur-sm"
          >
            <div>
              <p className="font-serif text-lg text-white">{layer.name}</p>
              <p className="text-[10px] tracking-widest uppercase text-blue-light/80 mt-0.5">{layer.ref}</p>
            </div>
            <span className="text-[10px] tracking-[0.2em] uppercase text-emerald-400/90 font-mono">Schützt</span>
          </motion.div>
        ))}

        {/* Incoming regulatory pulses — bouncing off */}
        {active &&
          [0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={`pulse-${i}`}
              initial={{ opacity: 0, x: 240, y: -40 + i * 30 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: [240, 30, 30, 280],
                y: [-40 + i * 30, -40 + i * 30, -40 + i * 30, -100 + i * 30],
              }}
              transition={{
                duration: 2.4,
                delay: 1.2 + i * 0.6,
                repeat: Infinity,
                repeatDelay: 1.5,
                ease: 'easeInOut',
              }}
              className="absolute top-1/2 right-0 w-2.5 h-2.5 rounded-full bg-zinc-400 shadow-[0_0_10px_rgba(255,255,255,0.4)]"
            />
          ))}
      </div>
    </div>
  );
}

function PiercingVisual({ active }: { active: boolean }) {
  const layers = ['Bestandsschutz', 'Vertrauensschutz', 'Verhältnismäßigkeit', 'Übergangsregelungen'];

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8 overflow-hidden">
      <div className="relative w-full max-w-md space-y-3">
        {layers.map((name, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0.4 }}
            animate={active ? { opacity: [0.4, 1, 0.5] } : { opacity: 0.4 }}
            transition={{ delay: 0.4 + i * 0.18, duration: 0.6 }}
            className="relative flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-blue/[0.08] to-transparent border border-blue/20 rounded-lg"
          >
            <p className="font-serif text-base text-white/70">{name}</p>

            {/* Piercing hole on each layer */}
            {active && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.18, duration: 0.25 }}
                className="absolute right-12 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-red-500 shadow-[0_0_18px_rgba(239,68,68,0.85)]"
              />
            )}
          </motion.div>
        ))}

        {/* The pierced Auflage at the bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="relative mt-6 px-5 py-4 bg-red-500/10 border border-red-500/60 rounded-lg"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] tracking-widest uppercase text-red-400 font-mono">Treffer · Auflage 01</span>
            <span className="text-[10px] tracking-widest uppercase text-red-400 font-mono animate-pulse">High</span>
          </div>
          <p className="font-serif text-lg text-white">DIN 4109 — Novelle 2026-Q3</p>
          <p className="text-xs text-zinc-400 mt-1">Schallschutz-Mindestwert von 47 dB → 50 dB</p>
        </motion.div>

        {/* Vertical piercing trail */}
        {active && (
          <motion.div
            initial={{ scaleY: 0, originY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.45, duration: 1.0, ease: 'easeIn' }}
            className="absolute left-[calc(100%-3rem)] top-0 w-px h-full bg-gradient-to-b from-red-500/0 via-red-500/80 to-red-500/0"
            style={{ transformOrigin: 'top' }}
          />
        )}
      </div>
    </div>
  );
}

function EmailDraftVisual({ active }: { active: boolean }) {
  const lines = [
    { text: 'An: architekt@buero-mueller.de', delay: 0.3 },
    { text: 'Betreff: DIN-4109-Novelle · Auflage 01 unseres Bescheids', delay: 0.6 },
    { text: '', delay: 0.9 },
    { text: 'Sehr geehrter Herr Müller,', delay: 1.0 },
    { text: '', delay: 1.2 },
    { text: 'die heute im Bundesanzeiger veröffentlichte DIN-4109-Novelle', delay: 1.3 },
    { text: 'erhöht den Mindest-Schallschutz von 47 dB auf 50 dB.', delay: 1.55 },
    { text: 'Da unsere Auflage 01 explizit auf "DIN 4109 in der jeweils', delay: 1.8 },
    { text: 'gültigen Fassung" verweist, durchbricht diese Änderung den', delay: 2.05 },
    { text: 'Bestandsschutz unseres Bescheids (Auflage-Piercing).', delay: 2.3 },
    { text: '', delay: 2.55 },
    { text: 'Vorschlag: Nachreichung der akustischen Berechnung bis', delay: 2.65 },
    { text: '2026-08-15 — VOB/B § 6 Abs. 2 anbei.', delay: 2.9 },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={active ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-xl overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
      >
        {/* Mac-style window chrome */}
        <div className="flex items-center gap-1.5 px-4 py-3 bg-zinc-800/80 border-b border-zinc-700">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          <span className="ml-3 text-[10px] tracking-widest uppercase text-zinc-500">Outlook · Entwurf · 06:00</span>
        </div>
        <div className="p-5 font-mono text-[11px] leading-relaxed text-zinc-300 min-h-[280px]">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={active ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: line.delay, duration: 0.05 }}
              className={
                i === 1
                  ? 'text-white font-semibold'
                  : line.text.startsWith('An:')
                    ? 'text-blue-light'
                    : ''
              }
            >
              {line.text || ' '}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function CtaVisual({ active }: { active: boolean }) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-[10px] tracking-[0.4em] uppercase text-blue-light mb-6"
      >
        Permit · Watch · Dog
      </motion.p>
      <motion.p
        initial={{ opacity: 0, scale: 0.96 }}
        animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
        transition={{ delay: 0.4, duration: 0.7, ease: 'easeOut' }}
        className="font-serif text-5xl md:text-6xl text-white leading-none mb-4"
      >
        Auflagen geändert?
      </motion.p>
      <motion.p
        initial={{ opacity: 0, scale: 0.96 }}
        animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
        transition={{ delay: 0.65, duration: 0.7, ease: 'easeOut' }}
        className="font-serif text-5xl md:text-6xl text-blue italic leading-none mb-8"
      >
        Wir sagen Bescheid.
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.95, duration: 0.6 }}
        className="text-sm text-zinc-400 max-w-xs mb-8"
      >
        Bescheid hochladen, jede Auflage wird erkannt — wir machen den Rest.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="flex flex-wrap gap-3 justify-center"
      >
        <a
          href="/preise"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-blue text-white text-xs tracking-[0.2em] uppercase font-sans hover:bg-blue-light shadow-[0_0_25px_rgba(22,84,255,0.5)] transition-all"
        >
          Bescheid hochladen <ArrowRight className="w-3.5 h-3.5" />
        </a>
        <a
          href="/doktrin"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-zinc-700 text-zinc-300 text-xs tracking-[0.2em] uppercase font-sans hover:border-blue hover:text-white transition-all"
        >
          Doktrin verstehen
        </a>
      </motion.div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────
// Chapter definitions — practical, real-value-driven script
// ───────────────────────────────────────────────────────────────────

const chapters: Chapter[] = [
  {
    id: 'baseline',
    eyebrow: 'Kapitel 01 · Die Realität',
    heading: (
      <>
        Ihr Bauvorhaben <span className="text-blue">läuft.</span>
      </>
    ),
    body: (
      <>
        Bauantrag genehmigt. Rohbau begonnen. Drei explizite Auflagen im Bescheid — DIN 4109,
        Solarpflicht BW, Brandschutz GK 4. So sieht es auf <strong className="text-white">tausenden</strong>{' '}
        Baustellen im Rhein-Neckar-Raum aus. Sie lesen kein Amtsblatt. Sie bauen.
      </>
    ),
    Visual: PermitCardVisual,
  },
  {
    id: 'noise',
    eyebrow: 'Kapitel 02 · Was Sie nicht stört',
    heading: (
      <>
        99% aller Regeländerungen <span className="text-blue">betreffen Sie nicht.</span>
      </>
    ),
    body: (
      <>
        Bestandsschutz, Vertrauensschutz, Verhältnismäßigkeit, Übergangsregelungen — vier Schichten
        deutscher Verwaltungsdoktrin schützen Ihren genehmigten Bauantrag. Neue Bebauungspläne,
        novellierte Landesbauordnungen, Bundesanzeiger-Veröffentlichungen: für Sie meist irrelevant.
      </>
    ),
    Visual: DoctrineShieldsVisual,
  },
  {
    id: 'exception',
    eyebrow: 'Kapitel 03 · Wo es wehtut',
    heading: (
      <>
        Aber das eine Prozent <span className="text-blue">kostet Sie Wochen.</span>
      </>
    ),
    body: (
      <>
        Wird eine DIN novelliert oder ein technisches Regelwerk geändert, auf das Ihr Bescheid
        explizit verweist, durchbricht die neue Vorgabe alle vier Schichten. Auflage-Piercing.
        Wer das zu spät merkt, baut weiter — und reißt den Schallschutz später nochmal auf.
      </>
    ),
    Visual: PiercingVisual,
  },
  {
    id: 'value',
    eyebrow: 'Kapitel 04 · Was wir tun',
    heading: (
      <>
        Bis ein echter <span className="text-blue">Treffer kommt — kein Mucks.</span>
      </>
    ),
    body: (
      <>
        PermitWatchDog überwacht nächtlich Bundesanzeiger, DIN-Updates, Mannheimer Amtsblatt
        und Bebauungsplan-Änderungen. Abgleich gegen die Auflagen Ihres Bescheids. Bei einem
        echten Piercing-Treffer liegt um 06:00 eine fertige E-Mail in Ihrem Outlook — mit
        Paragrafen, Frist und VOB/B-§-6-Anhang.
      </>
    ),
    Visual: EmailDraftVisual,
  },
  {
    id: 'cta',
    eyebrow: 'Kapitel 05 · Loslegen',
    heading: (
      <>
        Drei Auflagen. <span className="text-blue">Drei Minuten.</span>
      </>
    ),
    body: (
      <>
        Sie laden Ihren Genehmigungs-Bescheid hoch. Wir extrahieren die Auflagen und ihre
        Rechtsverweise automatisch. Ab Morgen 06:00 sind Sie geschützt — ohne ein einziges
        Amtsblatt zu öffnen.
      </>
    ),
    Visual: CtaVisual,
  },
];

// ───────────────────────────────────────────────────────────────────
// Main component
// ───────────────────────────────────────────────────────────────────

export default function InteractiveWelcomeTour() {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const next = useCallback(() => setActive((p) => (p + 1) % chapters.length), []);
  const prev = useCallback(() => setActive((p) => (p - 1 + chapters.length) % chapters.length), []);

  useEffect(() => {
    if (!autoplay) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }
    timerRef.current = setTimeout(() => {
      setActive((p) => (p + 1) % chapters.length);
    }, 7500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [autoplay, active]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const current = chapters[active];
  const Visual = current.Visual;

  return (
    <section className="bg-black py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section heading */}
        <div className="max-w-3xl mb-12">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-blue mb-4">
            Interaktive Tour · 90 Sekunden
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-white leading-tight">
            Wir filtern für Sie. <span className="text-blue">In Ihrem Tempo.</span>
          </h2>
          <p className="font-body text-lg text-zinc-400 mt-6 leading-relaxed">
            Fünf Kapitel. Klicken, springen, weiter, zurück. Keine Tonspur, keine Werbung — nur
            der ehrliche Mehrwert, in dem Tempo, das Ihnen passt.
          </p>
        </div>

        {/* Stage */}
        <div
          className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950 shadow-[0_0_80px_rgba(22,84,255,0.12)]"
          role="region"
          aria-label="Interaktive Produkt-Tour"
        >
          {/* Background atmosphere */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue/10 rounded-full blur-[120px]" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue/5 rounded-full blur-[140px]" />
          </div>

          {/* Two-column chapter content */}
          <div className="relative grid md:grid-cols-2 h-full">
            {/* Left: text */}
            <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16 z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                  <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-blue-light mb-5">
                    {current.eyebrow}
                  </p>
                  <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl text-white leading-[1.1] mb-6">
                    {current.heading}
                  </h3>
                  <p className="font-body text-sm md:text-base text-zinc-400 leading-relaxed max-w-md">
                    {current.body}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: visual */}
            <div className="relative min-h-[300px] md:min-h-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id + '-vis'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0"
                >
                  <Visual active={true} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom control bar */}
          <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/5 bg-black/50 backdrop-blur-md px-4 md:px-6 py-3 flex items-center gap-3">
            <button
              onClick={prev}
              aria-label="Vorheriges Kapitel"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 text-zinc-400 hover:text-white hover:border-white/40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setAutoplay((p) => !p)}
              aria-label={autoplay ? 'Auto-Wiedergabe pausieren' : 'Auto-Wiedergabe starten'}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-blue text-white hover:bg-blue-light shadow-[0_0_18px_rgba(22,84,255,0.5)] transition-colors"
            >
              {autoplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" fill="currentColor" strokeWidth={0} />}
            </button>
            <button
              onClick={next}
              aria-label="Nächstes Kapitel"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 text-zinc-400 hover:text-white hover:border-white/40 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Chapter dots — clickable */}
            <div className="flex items-center gap-2 ml-3 flex-1">
              {chapters.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setActive(i)}
                  aria-label={`Springe zu ${c.eyebrow}`}
                  className="group flex-1 max-w-[80px] h-1 bg-white/10 rounded-full overflow-hidden relative"
                >
                  <motion.div
                    initial={false}
                    animate={{
                      width: i < active ? '100%' : i === active ? (autoplay ? '100%' : '100%') : '0%',
                      opacity: i === active ? 1 : i < active ? 0.6 : 0.15,
                    }}
                    transition={
                      i === active && autoplay
                        ? { duration: 7.5, ease: 'linear' }
                        : { duration: 0.25 }
                    }
                    className="absolute inset-y-0 left-0 bg-blue rounded-full"
                  />
                </button>
              ))}
            </div>

            <span className="text-[10px] tracking-widest uppercase text-zinc-500 hidden md:inline">
              {String(active + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Hint strip */}
        <div className="mt-5 flex items-center justify-between text-[10px] md:text-xs tracking-widest uppercase text-zinc-500">
          <span>← → mit Pfeiltasten · Klick auf Punkte zum Springen</span>
          <span>Kein Ton · Kein Auto-Play (außer Sie wollen)</span>
        </div>
      </div>
    </section>
  );
}
