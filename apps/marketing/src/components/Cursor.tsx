'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';

export default function Cursor() {
  const [hoveredType, setHoveredType] = useState<'default' | 'pointer' | 'image'>('default');
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // 90ms ease approximate using springs
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (isTouchDevice) return;

    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      const isClickable = target.closest('a') || target.closest('button') || target.closest('[role="button"]');
      const isImage = target.tagName === 'IMG' || target.closest('img');
      
      if (isImage) {
        setHoveredType('image');
      } else if (isClickable) {
        setHoveredType('pointer');
      } else {
        setHoveredType('default');
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isTouchDevice, mouseX, mouseY]);

  if (isTouchDevice) return null;

  const variants = {
    default: {
      width: 8,
      height: 8,
      backgroundColor: '#ffffff',
      border: '0px solid transparent',
      x: '-50%',
      y: '-50%'
    },
    pointer: {
      width: 32,
      height: 32,
      backgroundColor: 'rgba(22, 84, 255, 0.2)',
      border: '1px solid #ffffff',
      x: '-50%',
      y: '-50%'
    },
    image: {
      width: 64,
      height: 64,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid #ffffff',
      x: '-50%',
      y: '-50%'
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (pointer: fine) {
          * { cursor: none !important; }
        }
      `}} />
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none flex items-center justify-center mix-blend-difference z-[999]"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={hoveredType}
        variants={variants}
        transition={{ type: "tween", ease: "backOut", duration: 0.15 }}
      >
        <AnimatePresence>
          {hoveredType === 'image' && (
            <motion.span 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-white font-sans text-xs tracking-widest uppercase font-bold"
            >
              VIEW
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
