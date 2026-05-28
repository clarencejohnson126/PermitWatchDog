'use client';

import { motion } from 'framer-motion';
import CTAButton from '../CTAButton';

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen min-h-[800px] flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 z-0 bg-black">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          preload="metadata"
          poster="/images/hero_doc_explosion.png"
          className="object-cover w-full h-full opacity-40 mix-blend-screen"
        >
          <source src="/videos/hero-loop.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex flex-col items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-tight mb-2 tracking-tight">
            DIE ERSTE KI-GESTÜTZTE
          </h1>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-sans text-blue mb-8 tracking-widest">
            BAUAUFSICHT.
          </h1>
        </motion.div>
        
        <motion.p 
          className="font-body text-xl md:text-2xl text-zinc-300 max-w-2xl mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Mannheims Amtsblätter, Bauanträge und DIN-Normen
          automatisch überwacht und rechtssicher aufbereitet.
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-6 items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <CTAButton href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_T0 || "/preise"}>
            BAUVORHABEN ABSICHERN
          </CTAButton>
          <a href="#how-it-works" className="font-sans text-white tracking-widest hover:text-blue-light transition-colors border-b border-transparent hover:border-blue-light pb-1">
            WIE ES FUNKTIONIERT
          </a>
        </motion.div>
      </div>
    </section>
  );
}
