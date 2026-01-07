'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface GradientDividerProps {
  className?: string;
  variant?: 'default' | 'strong' | 'subtle';
}

/**
 * GradientDivider - Animated section divider that responds to scroll
 * 
 * Motion Guidelines:
 * - Gradient position linked to scroll progress
 * - Smooth, continuous animation
 * - Never jarring or attention-grabbing
 * - Enhances section separation elegantly
 */
export function GradientDivider({ 
  className = '', 
  variant = 'default' 
}: GradientDividerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Transform scroll progress to gradient position
  const gradientPosition = useTransform(
    scrollYProgress, 
    [0, 1], 
    ['0%', '100%']
  );

  const opacityMap = {
    default: [0.2, 0.5, 0.2],
    strong: [0.3, 0.7, 0.3],
    subtle: [0.1, 0.3, 0.1]
  };

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    opacityMap[variant]
  );

  return (
    <motion.div 
      ref={ref}
      className={`relative w-full h-px overflow-hidden ${className}`}
      style={{ opacity }}
    >
      {/* Static base line */}
      <div className="absolute inset-0 bg-border-subtle" />
      
      {/* Animated gradient overlay */}
      <motion.div 
        className="absolute inset-0 h-full"
        style={{
          background: `linear-gradient(90deg, 
            transparent 0%, 
            rgba(63, 182, 139, 0.3) 20%, 
            rgba(63, 182, 139, 0.6) 50%, 
            rgba(63, 182, 139, 0.3) 80%, 
            transparent 100%
          )`,
          backgroundSize: '200% 100%',
          backgroundPositionX: gradientPosition,
        }}
      />

      {/* Glow effect */}
      <motion.div 
        className="absolute inset-0 h-4 -top-1.5 blur-sm"
        style={{
          background: `radial-gradient(ellipse at center, rgba(63, 182, 139, 0.15) 0%, transparent 70%)`,
          opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 0])
        }}
      />
    </motion.div>
  );
}

/**
 * AnimatedSectionDivider - Full-width divider with scroll-linked animation
 */
export function AnimatedSectionDivider({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative py-8 ${className}`}>
      {/* Left fade */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-px bg-gradient-to-r from-transparent to-border-subtle" />
      
      {/* Center animated section */}
      <motion.div 
        className="mx-auto max-w-4xl h-px relative overflow-hidden"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="absolute inset-0 scroll-gradient-line" />
      </motion.div>

      {/* Right fade */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-px bg-gradient-to-l from-transparent to-border-subtle" />

      {/* Center glow dot */}
      <motion.div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent-primary"
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 0.6 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: [0.4, 0, 0.2, 1] }}
        style={{
          boxShadow: '0 0 20px rgba(63, 182, 139, 0.5)'
        }}
      />
    </div>
  );
}

export default GradientDivider;

