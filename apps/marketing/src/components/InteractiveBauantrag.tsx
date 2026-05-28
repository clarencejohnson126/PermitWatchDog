'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, FileText, Shield } from 'lucide-react';

type Hotspot = {
  id: string;
  label: string;
  top: string;
  left: string;
  width: string;
  height: string;
  explainerTitle: string;
  explainerBody: string;
  doctrineLayer: string;
  citation: string;
};

const hotspots: Hotspot[] = [
  {
    id: 'header',
    label: 'A',
    top: '4.5%',
    left: '24%',
    width: '52%',
    height: '22%',
    explainerTitle: 'Amtlicher Behörden-Header',
    explainerBody: 'Ausstellende Behörde ist die Stadt Mannheim, Fachbereich Baurecht und Denkmalschutz. Dies begründet die sachliche Zuständigkeit. Als staatliche Hoheitsverwaltung unterliegt ihr Handeln streng dem Gesetzmäßigkeitsprinzip der Verwaltung.',
    doctrineLayer: 'Bestandsschutz',
    citation: 'ART. 20 ABS. 3 GG'
  },
  {
    id: 'title',
    label: 'B',
    top: '28%',
    left: '30%',
    width: '40%',
    height: '5%',
    explainerTitle: 'Bescheids-Typ: Baugenehmigung',
    explainerBody: 'Ein begünstigender Verwaltungsakt, der dem Bauherrn die Errichtung des Vorhabens gestattet. Mit der Erteilung wird die präventive Verbotsschranke des Baurechts aufgehoben, was eine fundamentale verfassungsrechtliche Eigentumsgarantie realisiert.',
    doctrineLayer: 'Eigentumsschutz',
    citation: 'ART. 14 ABS. 1 GG'
  },
  {
    id: 'bauherr',
    label: 'C',
    top: '36.5%',
    left: '18%',
    width: '45%',
    height: '3.5%',
    explainerTitle: 'Begünstigter Bauherr',
    explainerBody: 'RebelzBau Mannheim GmbH als Bescheidsadressat und primär Begünstigter. Für den Inhaber der Genehmigung erwächst hieraus ein weitreichender, subjektiv-öffentlicher Vertrauensschutz gegen nachträgliche behördliche Änderungen.',
    doctrineLayer: 'Vertrauensschutz',
    citation: '§ 48 VWVFG'
  },
  {
    id: 'baugrundstueck',
    label: 'D',
    top: '40.5%',
    left: '18%',
    width: '55%',
    height: '3.5%',
    explainerTitle: 'Grundstücksbezug',
    explainerBody: 'Gemarkung Mannheim, Flurstück 4823/2. Der baurechtliche Bestandsschutz ist streng dinglich (grundstücksbezogen) und nicht personengebunden. Er geht bei einem Verkauf des Grundstücks automatisch auf den Rechtsnachfolger über.',
    doctrineLayer: 'Bestandsschutz',
    citation: '§ 58 LBO BW'
  },
  {
    id: 'vorhaben',
    label: 'E',
    top: '44.5%',
    left: '18%',
    width: '65%',
    height: '8%',
    explainerTitle: 'Projektdefinition & Aktenzeichen',
    explainerBody: 'Neubau eines Mehrfamilienhauses mit 10 Wohneinheiten, registriert unter BG-2026-MA-00234. Definiert den sachlichen Regelungsumfang der Baugenehmigung. Abweichungen vom freigegebenen Plan gefährden den Schutzbereich des Bestandsschutzes.',
    doctrineLayer: 'Bestandsschutz',
    citation: '§ 31 BAUGB'
  },
  {
    id: 'auflagen',
    label: 'F',
    top: '54%',
    left: '18%',
    width: '65%',
    height: '24%',
    explainerTitle: 'Auflagen & Bedingungen',
    explainerBody: 'Rechtsgrundlage ist § 58 Landesbauordnung Baden-Württemberg (LBO). Die Genehmigung ergeht unter gesetzlichen Nebenbestimmungen wie Lärmschutz und Arbeitszeiten. Konflikte durch städtische Planungen (z. B. Straßensperren) können zu Baustopps führen.',
    doctrineLayer: 'Auflage-Piercing',
    citation: '§ 36 VWVFG'
  },
  {
    id: 'siegel',
    label: 'G',
    top: '80%',
    left: '44%',
    width: '38%',
    height: '15%',
    explainerTitle: 'Dienstsiegel & Rechtskraft',
    explainerBody: 'Das amtliche Dienstsiegel und die Unterschrift von Dipl.-Ing. M. Schneider vollenden den Erlass des Verwaltungsaktes. Ab Zustellung beginnt der Lauf von Fristen für Rechtsbehelfe Dritter (z. B. Nachbarwidersprüche).',
    doctrineLayer: 'Vertrauensschutz',
    citation: '§ 43 VWVFG'
  }
];

export default function InteractiveBauantrag() {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  const handlePrev = () => {
    if (!activeHotspot) return;
    const currentIndex = hotspots.findIndex((h) => h.id === activeHotspot.id);
    const prevIndex = (currentIndex - 1 + hotspots.length) % hotspots.length;
    setActiveHotspot(hotspots[prevIndex]);
  };

  const handleNext = () => {
    if (!activeHotspot) return;
    const currentIndex = hotspots.findIndex((h) => h.id === activeHotspot.id);
    const nextIndex = (currentIndex + 1) % hotspots.length;
    setActiveHotspot(hotspots[nextIndex]);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-950/80 backdrop-blur-md flex flex-col lg:flex-row min-h-[650px] lg:h-[750px]">
      
      {/* Image & Interactive Canvas Container */}
      <div className="relative w-full lg:w-2/3 aspect-[1/1] lg:h-full flex-shrink-0 bg-zinc-900/50 flex items-center justify-center p-4 select-none overflow-hidden border-b lg:border-b-0 lg:border-r border-zinc-800">
        <div className="relative w-full h-full max-w-[620px] max-h-[620px] aspect-[1/1]">
          <Image 
            src="/images/bauantrag.png" 
            alt="Stadt Mannheim Baugenehmigung" 
            fill 
            className="object-contain rounded-lg drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            priority
          />
          
          {/* Subtle blueprint grid overlay for premium look */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(22,84,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(22,84,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none rounded-lg" />

          {/* Interactive Clickable Hotspots with subtle discoverability indicators */}
          {hotspots.map((hs) => (
            <button
              key={hs.id}
              onClick={() => setActiveHotspot(hs)}
              className={`absolute border border-dashed rounded transition-all duration-300 flex items-start justify-start p-1.5 cursor-pointer group ${
                activeHotspot?.id === hs.id 
                  ? 'border-transparent bg-transparent z-20' 
                  : 'border-blue/20 bg-blue/[0.01] hover:border-blue/60 hover:bg-blue/[0.08] hover:shadow-[0_0_15px_rgba(22,84,255,0.2)] z-10'
              }`}
              style={{
                top: hs.top,
                left: hs.left,
                width: hs.width,
                height: hs.height,
              }}
              aria-label={`Inspect ${hs.explainerTitle}`}
            >
              {/* Subtle Glowing Letter Badge */}
              <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold font-sans transition-all duration-300 ${
                activeHotspot?.id === hs.id
                  ? 'bg-blue text-white shadow-[0_0_8px_rgba(22,84,255,0.8)] scale-110'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-white group-hover:border-blue group-hover:bg-blue/20 group-hover:shadow-[0_0_8px_rgba(22,84,255,0.4)]'
              }`}>
                {hs.label}
              </span>
            </button>
          ))}

          {/* Gliding Bounding Box Focus Overlay */}
          {activeHotspot && (
            <motion.div
              layoutId="activeHighlight"
              className="absolute border-2 border-blue bg-blue/[0.08] shadow-[0_0_25px_rgba(22,84,255,0.4)] pointer-events-none rounded z-20"
              initial={false}
              animate={{
                top: activeHotspot.top,
                left: activeHotspot.left,
                width: activeHotspot.width,
                height: activeHotspot.height,
              }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            />
          )}

          {/* Pulse discoverability overlay */}
          {!activeHotspot && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="bg-black/80 text-blue-light text-xs font-sans tracking-[0.2em] px-6 py-3.5 rounded-full border border-blue/30 backdrop-blur-md animate-pulse shadow-[0_0_20px_rgba(22,84,255,0.2)]">
                DOKUMENT ANTIPPEN ZUM ANALYSIEREN
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Side Panel Explorer & Analysis List */}
      <div className="relative w-full lg:w-1/3 min-h-[350px] lg:h-full bg-zinc-950 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {activeHotspot ? (
            <motion.div
              key={activeHotspot.id}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="absolute inset-0 w-full h-full flex flex-col justify-between p-6 md:p-8 z-30 bg-zinc-950"
            >
              {/* Header Info */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue/15 border border-blue/30 text-blue text-sm font-bold font-sans shadow-[0_0_10px_rgba(22,84,255,0.1)]">
                      {activeHotspot.label}
                    </span>
                    <span className="text-[10px] md:text-xs font-sans tracking-[0.2em] text-blue uppercase bg-blue/5 border border-blue/10 px-2.5 py-1 rounded-full">
                      {activeHotspot.doctrineLayer}
                    </span>
                  </div>
                  <button 
                    onClick={() => setActiveHotspot(null)}
                    className="text-zinc-500 hover:text-white transition-colors p-1.5 hover:bg-zinc-900 rounded-full"
                    aria-label="Schließen"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto pr-1 py-2 max-h-[380px] lg:max-h-[480px] scrollbar-thin">
                  <h3 className="font-serif text-2xl font-bold text-white leading-tight mb-4">
                    {activeHotspot.explainerTitle}
                  </h3>
                  
                  <p className="font-serif text-zinc-300 text-base leading-relaxed">
                    {activeHotspot.explainerBody}
                  </p>
                  
                  <div className="mt-8 pt-6 border-t border-zinc-800/80 flex items-center gap-2.5 text-zinc-500">
                    <Shield className="w-4 h-4 text-blue/70" />
                    <span className="font-sans text-[10px] tracking-[0.2em] uppercase">
                      Rechtsgrundlage: <strong className="text-zinc-300">{activeHotspot.citation}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Quick-Pagination Grid */}
              <div className="border-t border-zinc-800 pt-4 mt-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={handlePrev}
                    className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Zurück
                  </button>
                  
                  {/* Grid pagination */}
                  <div className="flex gap-1">
                    {hotspots.map((hs) => (
                      <button
                        key={hs.id}
                        onClick={() => setActiveHotspot(hs)}
                        className={`w-6 h-6 rounded-full text-[9px] font-bold flex items-center justify-center transition-all ${
                          activeHotspot.id === hs.id
                            ? 'bg-blue text-white shadow-[0_0_8px_rgba(22,84,255,0.6)]'
                            : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                        }`}
                      >
                        {hs.label}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={handleNext}
                    className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    Weiter <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  onClick={() => setActiveHotspot(null)}
                  className="w-full text-center text-xs font-sans tracking-widest text-zinc-500 hover:text-blue-light transition-colors uppercase pt-1 border-t border-zinc-900"
                >
                  Übersicht aller Zonen anzeigen
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 bg-zinc-950 overflow-hidden"
            >
              {/* Header Overview */}
              <div className="flex flex-col gap-2 border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2 text-blue-light">
                  <FileText className="w-5 h-5" />
                  <span className="font-sans text-[10px] tracking-[0.25em] uppercase font-bold">Dokumenten-Analyse</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-white">Baugenehmigung Mannheim</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Interaktive Gliederung des Bescheids. Wählen Sie eine Zone aus, um die bauordnungsrechtlichen Doktrinen einzusehen.
                </p>
              </div>

              {/* Scrollable List of Hotspots */}
              <div className="flex-1 overflow-y-auto my-4 space-y-2 pr-1 scrollbar-thin max-h-[380px] lg:max-h-[460px]">
                {hotspots.map((hs) => (
                  <button
                    key={hs.id}
                    onClick={() => setActiveHotspot(hs)}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl border border-zinc-900 bg-zinc-950 hover:border-zinc-800 hover:bg-zinc-900/60 transition-all group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-bold font-sans group-hover:border-blue group-hover:text-blue group-hover:bg-blue/5 transition-all">
                        {hs.label}
                      </span>
                      <div>
                        <p className="font-serif text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">
                          {hs.explainerTitle.split(':')[0]}
                        </p>
                        <p className="text-[10px] font-sans text-zinc-500 uppercase tracking-widest mt-0.5">
                          {hs.doctrineLayer}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-blue group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>

              {/* Action Callout */}
              <div className="border-t border-zinc-800 pt-4 text-center">
                <p className="text-[10px] font-sans text-zinc-500 uppercase tracking-widest">
                  Analysiert durch PermitWatchDog Engine v1.0
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
