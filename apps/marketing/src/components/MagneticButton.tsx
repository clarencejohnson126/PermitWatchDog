'use client';

import { useRef, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function MagneticButton({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);
  
  const innerX = useSpring(0, springConfig);
  const innerY = useSpring(0, springConfig);

  useEffect(() => {
    // Only apply on fine pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const { clientX, clientY } = e;
      const { width, height, left, top } = ref.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;
      // Approximate proximity radius
      const radius = Math.max(width, height) / 2 + 80;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      if (distance < radius) {
        x.set(distanceX * 0.1);
        y.set(distanceY * 0.1);
        innerX.set(distanceX * 0.2);
        innerY.set(distanceY * 0.2);
      } else {
        x.set(0);
        y.set(0);
        innerX.set(0);
        innerY.set(0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y, innerX, innerY]);

  return (
    <motion.div ref={ref} style={{ x, y }} className={`inline-block ${className}`}>
      <motion.div style={{ x: innerX, y: innerY }} className="w-full h-full flex items-center justify-center">
        {children}
      </motion.div>
    </motion.div>
  );
}
