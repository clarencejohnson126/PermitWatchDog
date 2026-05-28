'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X } from 'lucide-react';

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
    label: 'a',
    top: '6%',
    left: '25%',
    width: '50%',
    height: '6%',
    explainerTitle: 'Dokumenten-Typ: Bauantrag',
    explainerBody: 'Der offizielle Antrag zur Genehmigung eines Bauvorhabens. Sobald dieser genehmigt ist, entfaltet er weitreichenden Bestandsschutz. PermitWatchDog analysiert exakt die hier referenzierten Pläne.',
    doctrineLayer: 'Bestandsschutz',
    citation: 'ART. 14 GG'
  },
  {
    id: 'bauherr',
    label: 'b',
    top: '16%',
    left: '10%',
    width: '40%',
    height: '4%',
    explainerTitle: 'Antragsteller',
    explainerBody: 'Die juristische oder natürliche Person, die das Vorhaben durchführt. An den Bauherrn richten sich alle Auflagen und Genehmigungen. Für ihn gilt der gesetzliche Vertrauensschutz.',
    doctrineLayer: 'Vertrauensschutz',
    citation: '§ 48 VwVfG'
  },
  {
    id: 'bauvorhaben',
    label: 'c',
    top: '23%',
    left: '10%',
    width: '80%',
    height: '6%',
    explainerTitle: 'Projektumfang',
    explainerBody: 'Definiert präzise den Umfang der erteilten Genehmigung. Bauplanerische Abweichungen im Nachhinein können zum Verlust des Bestandsschutzes führen.',
    doctrineLayer: 'Bestandsschutz',
    citation: 'LBO BW'
  },
  {
    id: 'auflage',
    label: 'd',
    top: '45%',
    left: '10%',
    width: '80%',
    height: '15%',
    explainerTitle: 'Auflagen & Bedingungen',
    explainerBody: 'Spezifische Einschränkungen (z.B. Lärmschutz, Logistikzeiten, Straßensperrungen). Wenn städtische Maßnahmen (wie ein Stadtfest) in diese Auflagen eingreifen, entsteht ein Konflikt, der den Bauablauf behindert.',
    doctrineLayer: 'Auflage-Piercing',
    citation: 'VOB/B § 6 ABS. 2'
  },
  {
    id: 'stamp',
    label: 'e',
    top: '78%',
    left: '60%',
    width: '30%',
    height: '15%',
    explainerTitle: 'Rechtskräftige Genehmigung',
    explainerBody: 'Der behördliche Stempel der Stadt Mannheim besiegelt die Baugenehmigung. Ab diesem Moment gilt voller Vertrauens- und Bestandsschutz für die genehmigten Pläne.',
    doctrineLayer: 'Vertrauensschutz',
    citation: '§ 35 VwVfG'
  }
];

export default function InteractiveBauantrag() {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-zinc-800 bg-black flex flex-col md:flex-row min-h-[600px]">
      {/* Image Container */}
      <div className="relative w-full md:w-2/3 aspect-[928/1152] flex-shrink-0 bg-zinc-900">
        <Image 
          src="/images/bauantrag.png" 
          alt="Bauantrag Document" 
          fill 
          className="object-contain"
        />
        
        {/* Hotspots */}
        {hotspots.map((hs) => (
          <button
            key={hs.id}
            onClick={() => setActiveHotspot(hs)}
            className={`absolute border-2 transition-all duration-300 rounded cursor-pointer ${
              activeHotspot?.id === hs.id 
                ? 'border-blue bg-blue/20 shadow-[0_0_20px_rgba(22,84,255,0.5)] z-20' 
                : 'border-blue/0 hover:border-blue/50 hover:bg-blue/10 hover:shadow-[0_0_15px_rgba(22,84,255,0.3)] z-10'
            }`}
            style={{
              top: hs.top,
              left: hs.left,
              width: hs.width,
              height: hs.height,
            }}
            aria-label={`Inspect ${hs.explainerTitle}`}
          />
        ))}

        {/* Pulse indicator for initial discovery */}
        {!activeHotspot && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="bg-black/60 text-white font-sans tracking-widest px-6 py-3 rounded-full backdrop-blur-md border border-zinc-700 animate-pulse">
              KLICKEN UM DOKUMENT ZU ANALYSIEREN
            </div>
          </div>
        )}
      </div>

      {/* Side Panel */}
      <div className="relative w-full md:w-1/3 min-h-[300px] bg-black border-t md:border-t-0 md:border-l border-zinc-800 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          {activeHotspot ? (
            <motion.div
              key={activeHotspot.id}
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-0 w-full h-full bg-black flex flex-col z-30"
            >
              <div className="p-6 flex justify-end">
                <button 
                  onClick={() => setActiveHotspot(null)}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 px-8 pb-8 flex flex-col">
                <div className="inline-flex px-3 py-1 bg-blue/10 border border-blue/20 text-blue text-xs font-sans tracking-widest rounded-full self-start mb-6 uppercase">
                  {activeHotspot.doctrineLayer}
                </div>
                
                <h3 className="font-serif text-3xl text-white mb-6">
                  {activeHotspot.explainerTitle}
                </h3>
                
                <p className="font-serif text-zinc-400 text-lg leading-relaxed flex-1">
                  {activeHotspot.explainerBody}
                </p>
                
                <div className="border-t border-zinc-800 pt-6 mt-8">
                  <p className="font-sans text-xs tracking-widest text-zinc-500 uppercase">
                    CITATION: <span className="text-zinc-300">{activeHotspot.citation}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="w-16 h-16 border border-zinc-800 rounded-full flex items-center justify-center mb-6">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <p className="font-serif text-xl text-zinc-500">
                Wählen Sie einen markierten Bereich aus, um die juristische Bedeutung zu verstehen.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
