'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import MagneticButton from '../MagneticButton';
import { useLang } from '@/lib/i18n/LangContext';

export default function HeroSection() {
  const { t } = useLang();
  const title = t('hero.title');
  return (
    <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="object-cover w-full h-full opacity-40 mix-blend-screen"
        >
          <source src="/videos/hero-loop.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black pointer-events-none" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <div className="inline-block mb-6 px-4 py-1.5 border border-blue-dark/50 bg-blue/10 backdrop-blur-md rounded-full text-blue-light text-sm font-sans tracking-wide uppercase">
            {t('hero.eyebrow')}
          </div>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-8 leading-[1.1] text-white">
            {title.split(' ').map((word, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, y: 40, rotateX: -45 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: i * 0.08, ease: [0.22, 0.8, 0.4, 1] }}
              >
                {word}&nbsp;
              </motion.span>
            ))}
          </h1>

          <p className="font-sans text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-6">
            <MagneticButton>
              <Link 
                href={process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_T0 || "#"} 
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-blue text-white font-sans text-lg tracking-wide hover:bg-blue-light transition-colors overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  {t('hero.cta_primary')}
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            </MagneticButton>
            
            <MagneticButton>
              <Link 
                href="/demo" 
                className="inline-flex items-center justify-center px-8 py-4 border border-zinc-700 hover:border-white text-zinc-300 hover:text-white font-sans text-lg tracking-wide transition-colors"
              >
                {t('hero.cta_secondary')}
              </Link>
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
