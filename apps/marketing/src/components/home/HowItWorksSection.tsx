'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { num: "01", title: "SCRAPE", desc: "Wir scannen jede Nacht automatisch das Mannheimer Amtsblatt.", img: "/images/construction_night_shot.png" },
  { num: "02", title: "PARSE", desc: "Die KI extrahiert relevante Sperrungen, Baugesuche und Verordnungen.", img: "/images/architect_portrait.png" },
  { num: "03", title: "CROSS-REF", desc: "Wir prüfen, ob Ihr Bestandsschutz greift oder durchbrochen wird.", img: "/images/bautraeger_executive.png" },
  { num: "04", title: "DRAFT", desc: "Vor dem Frühstück erhalten Sie eine fertige E-Mail für Ihren Architekten.", img: "/images/bauleiter_portrait.png" }
];

export default function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the left column while the right column scrolls
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: leftColRef.current,
      });

      // Animate images in right column
      const items = gsap.utils.toArray('.step-item') as HTMLElement[];
      items.forEach((item, i) => {
        gsap.fromTo(item, 
          { opacity: 0, y: 50 },
          { 
            opacity: 1, 
            y: 0,
            scrollTrigger: {
              trigger: item,
              start: "top center+=100",
              end: "center center",
              scrub: true
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" className="bg-black text-white py-24 relative" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 relative items-start">
        
        {/* Left Column - Pinned */}
        <div className="md:h-screen flex flex-col justify-center" ref={leftColRef}>
          <h2 className="text-5xl md:text-6xl font-sans tracking-widest text-blue mb-8">
            SO FUNKTIONIERT ES.
          </h2>
          <div className="space-y-8">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-6 items-start">
                <span className="font-sans text-2xl text-blue-dark">{step.num}</span>
                <div>
                  <h3 className="font-sans text-2xl tracking-widest mb-2">{step.title}</h3>
                  <p className="font-body text-zinc-400 max-w-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Scrolling */}
        <div className="flex flex-col gap-[30vh] pt-[20vh] pb-[20vh]" ref={rightColRef}>
          {steps.map((step, i) => (
            <div key={i} className="step-item relative aspect-[4/5] w-full rounded-lg overflow-hidden border border-zinc-900 shadow-2xl">
              <Image 
                src={step.img} 
                alt={step.title} 
                fill 
                className="object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-8 left-8">
                <h4 className="font-sans text-4xl text-blue tracking-widest">{step.num}</h4>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
