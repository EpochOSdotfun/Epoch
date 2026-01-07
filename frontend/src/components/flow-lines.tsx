'use client';

import { useEffect, useRef } from 'react';

export function FlowLines() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!svgRef.current) return;
      const scrollY = window.scrollY;
      const paths = svgRef.current.querySelectorAll('path');
      paths.forEach((path, i) => {
        const offset = scrollY * (0.02 + i * 0.01);
        path.style.transform = `translateY(${offset}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <svg
      ref={svgRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Decorative flow lines */}
      <path
        d="M -100 200 Q 300 180 600 220 T 1200 200 T 2000 240"
        stroke="url(#flow-gradient)"
        strokeWidth="1"
        fill="none"
        className="flow-line-animated"
        style={{ transition: 'transform 0.1s ease-out' }}
      />
      <path
        d="M -100 400 Q 400 380 800 420 T 1400 400 T 2100 440"
        stroke="url(#flow-gradient)"
        strokeWidth="1"
        fill="none"
        className="flow-line-animated"
        style={{ transition: 'transform 0.1s ease-out', animationDelay: '-5s' }}
      />
      <path
        d="M -100 600 Q 350 580 700 620 T 1300 600 T 2000 640"
        stroke="url(#flow-gradient)"
        strokeWidth="1"
        fill="none"
        className="flow-line-animated"
        style={{ transition: 'transform 0.1s ease-out', animationDelay: '-10s' }}
      />
      <path
        d="M -100 800 Q 500 780 900 820 T 1500 800 T 2200 840"
        stroke="url(#flow-gradient)"
        strokeWidth="1"
        fill="none"
        className="flow-line-animated"
        style={{ transition: 'transform 0.1s ease-out', animationDelay: '-15s' }}
      />

      {/* Vertical accent line */}
      <line
        x1="80"
        y1="0"
        x2="80"
        y2="1080"
        stroke="var(--accent)"
        strokeWidth="1"
        opacity="0.04"
      />
    </svg>
  );
}

