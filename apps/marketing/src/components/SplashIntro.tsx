'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

export default function SplashIntro() {
  const [show, setShow] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const hasSeenSplash = localStorage.getItem('hasSeenSplash');
    if (!hasSeenSplash && !shouldReduceMotion) {
      setShow(true);
      localStorage.setItem('hasSeenSplash', 'true');
      
      // Auto-hide after 1.6s
      const timer = setTimeout(() => setShow(false), 1600);
      return () => clearTimeout(timer);
    }
  }, [shouldReduceMotion]);

  useEffect(() => {
    const handleSkip = () => setShow(false);
    if (show) {
      window.addEventListener('keydown', handleSkip);
      window.addEventListener('click', handleSkip);
      return () => {
        window.removeEventListener('keydown', handleSkip);
        window.removeEventListener('click', handleSkip);
      };
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
        >
          {/* 0.0 - 0.4s: Logo fades in */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute z-10 flex flex-col items-center justify-center pointer-events-none"
          >
            <h1 className="text-4xl md:text-6xl font-sans tracking-widest text-white uppercase drop-shadow-2xl">
              PERMIT<span className="text-blue-light">WATCHDOG</span>
            </h1>
          </motion.div>

          {/* 0.4 - 1.0s: Bauantrag rotates and fades in */}
          <motion.div
            initial={{ opacity: 0, rotate: -3, scale: 0.9 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            className="absolute w-[90vw] max-w-[600px] aspect-[1/1.4] z-20 pointer-events-none shadow-2xl"
          >
            <Image
              src="/images/bauantrag.png"
              alt="Bauantrag"
              fill
              className="object-cover rounded-xl"
              priority
            />
            
            {/* 1.0 - 1.3s: Blue STADT MANNHEIM stamp thud */}
            <motion.div
              initial={{ opacity: 0, scale: 3, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: -5 }}
              transition={{ delay: 1.0, type: "spring", stiffness: 400, damping: 15 }}
              className="absolute bottom-[10%] right-[5%] md:bottom-[20%] md:right-[10%] w-32 h-32 md:w-40 md:h-40 pointer-events-none"
            >
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_15px_rgba(22,84,255,0.5)]">
                <circle cx="100" cy="100" r="90" fill="none" stroke="#1654FF" strokeWidth="8" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="#1654FF" strokeWidth="4" />
                <text x="100" y="105" textAnchor="middle" fill="#1654FF" fontFamily="sans-serif" fontSize="24" fontWeight="bold" transform="rotate(-15, 100, 100)">
                  STADT MANNHEIM
                </text>
                <text x="100" y="135" textAnchor="middle" fill="#1654FF" fontFamily="sans-serif" fontSize="18" fontWeight="bold" transform="rotate(-15, 100, 100)">
                  GENEHMIGT
                </text>
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
