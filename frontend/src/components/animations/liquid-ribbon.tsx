'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface LiquidRibbonProps {
  className?: string;
}

/**
 * LiquidRibbon - Subtle flowing SVG animation for hero backgrounds
 * 
 * Motion Guidelines:
 * - Very subtle opacity (0.08-0.2 range)
 * - Slow, gentle movement (12s cycle)
 * - Organic, liquid-like path morphing
 * - Non-distracting background element
 */
export function LiquidRibbon({ className = '' }: LiquidRibbonProps) {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    // Smooth path morphing using CSS animations defined in globals.css
    // The animation is purely CSS-based for optimal performance
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 1200 400"
        className="absolute w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          {/* Gradient for ribbon fill */}
          <linearGradient id="ribbon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(63, 182, 139)" stopOpacity="0" />
            <stop offset="30%" stopColor="rgb(63, 182, 139)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="rgb(63, 182, 139)" stopOpacity="0.5" />
            <stop offset="70%" stopColor="rgb(63, 182, 139)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(63, 182, 139)" stopOpacity="0" />
          </linearGradient>

          {/* Blur filter for soft edges */}
          <filter id="ribbon-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" />
          </filter>

          {/* Glow filter */}
          <filter id="ribbon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Primary ribbon - slow flowing animation */}
        <motion.path
          ref={pathRef}
          d="M-100 200 Q 150 120, 350 200 T 700 200 T 1050 200 T 1400 200"
          stroke="url(#ribbon-gradient)"
          strokeWidth="60"
          fill="none"
          filter="url(#ribbon-blur)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: 0.15,
            d: [
              "M-100 200 Q 150 120, 350 200 T 700 200 T 1050 200 T 1400 200",
              "M-100 200 Q 150 280, 350 180 T 700 220 T 1050 180 T 1400 200",
              "M-100 200 Q 150 160, 350 220 T 700 180 T 1050 220 T 1400 200",
              "M-100 200 Q 150 240, 350 200 T 700 220 T 1050 200 T 1400 200",
              "M-100 200 Q 150 120, 350 200 T 700 200 T 1050 200 T 1400 200",
            ]
          }}
          transition={{
            pathLength: { duration: 2, ease: "easeOut" },
            opacity: { duration: 2 },
            d: { 
              duration: 12, 
              repeat: Infinity, 
              ease: "easeInOut",
              times: [0, 0.25, 0.5, 0.75, 1]
            }
          }}
        />

        {/* Secondary ribbon - offset timing */}
        <motion.path
          d="M-100 220 Q 200 160, 400 220 T 800 220 T 1200 220 T 1400 220"
          stroke="url(#ribbon-gradient)"
          strokeWidth="40"
          fill="none"
          filter="url(#ribbon-blur)"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.1,
            d: [
              "M-100 220 Q 200 160, 400 220 T 800 220 T 1200 220 T 1400 220",
              "M-100 220 Q 200 260, 400 180 T 800 240 T 1200 180 T 1400 220",
              "M-100 220 Q 200 200, 400 240 T 800 180 T 1200 240 T 1400 220",
              "M-100 220 Q 200 180, 400 200 T 800 200 T 1200 200 T 1400 220",
              "M-100 220 Q 200 160, 400 220 T 800 220 T 1200 220 T 1400 220",
            ]
          }}
          transition={{
            opacity: { duration: 2, delay: 0.5 },
            d: { 
              duration: 15, 
              repeat: Infinity, 
              ease: "easeInOut",
              times: [0, 0.25, 0.5, 0.75, 1]
            }
          }}
        />

        {/* Tertiary ribbon - slower, more subtle */}
        <motion.path
          d="M-100 180 Q 250 220, 450 180 T 850 180 T 1250 180 T 1400 180"
          stroke="url(#ribbon-gradient)"
          strokeWidth="25"
          fill="none"
          filter="url(#ribbon-blur)"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 0.08,
            d: [
              "M-100 180 Q 250 220, 450 180 T 850 180 T 1250 180 T 1400 180",
              "M-100 180 Q 250 140, 450 200 T 850 160 T 1250 200 T 1400 180",
              "M-100 180 Q 250 200, 450 160 T 850 200 T 1250 160 T 1400 180",
              "M-100 180 Q 250 180, 450 180 T 850 180 T 1250 180 T 1400 180",
              "M-100 180 Q 250 220, 450 180 T 850 180 T 1250 180 T 1400 180",
            ]
          }}
          transition={{
            opacity: { duration: 2, delay: 1 },
            d: { 
              duration: 18, 
              repeat: Infinity, 
              ease: "easeInOut",
              times: [0, 0.25, 0.5, 0.75, 1]
            }
          }}
        />
      </svg>
    </div>
  );
}

export default LiquidRibbon;

