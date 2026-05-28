'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const getPageTitle = (path: string) => {
    if (path === '/') return 'HOME';
    const parts = path.split('/');
    return parts[parts.length - 1].toUpperCase();
  };
  const pageTitle = getPageTitle(pathname);

  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname} className="flex-1 flex flex-col min-h-screen">
        {/* Entrance overlay: starts covering the screen, slides UP off-screen */}
        <motion.div
          className="fixed inset-0 z-[110] bg-blue flex items-center justify-center pointer-events-none"
          initial={{ top: 0 }}
          animate={{ top: '-100%' }}
          exit={{ top: '-100%' }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <span className="font-serif text-5xl text-white tracking-widest">{pageTitle}</span>
        </motion.div>

        {/* Exit overlay: starts below screen, slides UP to cover */}
        <motion.div
          className="fixed inset-0 z-[110] bg-blue flex items-center justify-center pointer-events-none"
          initial={{ top: '100%' }}
          animate={{ top: '100%' }}
          exit={{ top: 0 }}
          transition={{ duration: 0.2, ease: "easeIn" }}
        >
          <span className="font-serif text-5xl text-white tracking-widest">{pageTitle}</span>
        </motion.div>

        {children}
      </motion.div>
    </AnimatePresence>
  );
}
