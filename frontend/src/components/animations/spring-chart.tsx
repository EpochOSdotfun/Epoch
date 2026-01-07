'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface SpringChartProps {
  data: number[];
  labels?: string[];
  height?: number;
  className?: string;
  variant?: 'bar' | 'line' | 'area';
  accentColor?: string;
}

/**
 * SpringChart - Charts with gentle spring physics animation
 * 
 * Motion Guidelines:
 * - Gentle spring physics (stiffness: 100, damping: 20)
 * - Never bouncy - subtle overshoot only
 * - Staggered bar animations (50ms delay between bars)
 * - Line/area draws smoothly from left to right
 */
export function SpringChart({
  data,
  labels,
  height = 200,
  className = '',
  variant = 'bar',
  accentColor = 'rgb(63, 182, 139)'
}: SpringChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const maxValue = Math.max(...data);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  if (variant === 'bar') {
    return (
      <div ref={ref} className={`w-full ${className}`} style={{ height }}>
        <div className="flex items-end justify-between h-full gap-2">
          {data.map((value, index) => (
            <SpringBar 
              key={index}
              value={value} 
              maxValue={maxValue}
              index={index}
              isInView={isInView}
              accentColor={accentColor}
              label={labels?.[index]}
            />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'line' || variant === 'area') {
    return (
      <div ref={ref} className={`w-full ${className}`} style={{ height }}>
        <SpringLine 
          data={data}
          maxValue={maxValue}
          height={height}
          isInView={isInView}
          showArea={variant === 'area'}
          accentColor={accentColor}
        />
      </div>
    );
  }

  return null;
}

interface SpringBarProps {
  value: number;
  maxValue: number;
  index: number;
  isInView: boolean;
  accentColor: string;
  label?: string;
}

function SpringBar({ value, maxValue, index, isInView, accentColor, label }: SpringBarProps) {
  const heightPercent = (value / maxValue) * 100;
  
  // Gentle spring - low bounce, smooth settle
  const springConfig = { stiffness: 100, damping: 20 };
  const animatedHeight = useSpring(0, springConfig);

  useEffect(() => {
    if (isInView) {
      // Stagger animation start
      const timer = setTimeout(() => {
        animatedHeight.set(heightPercent);
      }, index * 50);
      return () => clearTimeout(timer);
    }
  }, [isInView, heightPercent, index, animatedHeight]);

  const height = useTransform(animatedHeight, (h) => `${h}%`);

  return (
    <div className="flex-1 flex flex-col items-center gap-2">
      <div className="w-full h-full relative flex items-end">
        <motion.div
          className="w-full rounded-t-md relative overflow-hidden"
          style={{ 
            height,
            backgroundColor: `${accentColor}20`,
          }}
        >
          {/* Gradient overlay */}
          <div 
            className="absolute inset-0"
            style={{
              background: `linear-gradient(180deg, ${accentColor}40 0%, ${accentColor}10 100%)`
            }}
          />
          {/* Top highlight */}
          <div 
            className="absolute top-0 left-0 right-0 h-1 rounded-t-md"
            style={{ backgroundColor: accentColor }}
          />
        </motion.div>
      </div>
      {label && (
        <span className="text-caption text-text-muted">{label}</span>
      )}
    </div>
  );
}

interface SpringLineProps {
  data: number[];
  maxValue: number;
  height: number;
  isInView: boolean;
  showArea: boolean;
  accentColor: string;
}

function SpringLine({ data, maxValue, height, isInView, showArea, accentColor }: SpringLineProps) {
  const padding = 20;
  const chartHeight = height - padding * 2;
  const chartWidth = 100; // percentage
  
  // Generate path points
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = padding + (1 - value / maxValue) * chartHeight;
    return { x, y };
  });

  // Create smooth curve path
  const linePath = points.reduce((path, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }
    const prev = points[index - 1];
    const cpX = (prev.x + point.x) / 2;
    return `${path} C ${cpX} ${prev.y}, ${cpX} ${point.y}, ${point.x} ${point.y}`;
  }, '');

  // Area path (closes at bottom)
  const areaPath = `${linePath} L 100 ${height} L 0 ${height} Z`;

  return (
    <svg 
      viewBox={`0 0 100 ${height}`} 
      className="w-full h-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.8" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="1" />
        </linearGradient>
        <linearGradient id="area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      {showArea && (
        <motion.path
          d={areaPath}
          fill="url(#area-gradient)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
        />
      )}

      {/* Line */}
      <motion.path
        d={linePath}
        fill="none"
        stroke="url(#line-gradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ 
          pathLength: { duration: 1.2, ease: [0.4, 0, 0.2, 1] },
          opacity: { duration: 0.3 }
        }}
      />

      {/* Data points */}
      {points.map((point, index) => (
        <motion.circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="3"
          fill={accentColor}
          initial={{ scale: 0, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ 
            delay: 0.3 + index * 0.1,
            duration: 0.4,
            ease: [0.34, 1.2, 0.64, 1] // Gentle spring
          }}
        />
      ))}
    </svg>
  );
}

/**
 * MiniSparkline - Compact line chart for inline metrics
 */
interface MiniSparklineProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
}

export function MiniSparkline({ 
  data, 
  width = 80, 
  height = 24,
  className = '' 
}: MiniSparklineProps) {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - minValue) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  const isPositive = data[data.length - 1] >= data[0];

  return (
    <svg 
      width={width} 
      height={height} 
      className={className}
      viewBox={`0 0 ${width} ${height}`}
    >
      <motion.polyline
        points={points}
        fill="none"
        stroke={isPositive ? 'rgb(63, 182, 139)' : 'rgb(239, 68, 68)'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      />
    </svg>
  );
}

export default SpringChart;

