/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Enterprise dark theme - refined, institutional
        bg: {
          primary: '#080b12',
          secondary: '#0d1117',
          tertiary: '#161b22',
          elevated: '#1c2128',
          hover: '#21262d',
        },
        accent: {
          primary: '#3fb68b',      // Refined emerald - trustworthy, institutional
          secondary: '#22c55e',    // Softer green
          tertiary: '#10b981',
          muted: 'rgba(63, 182, 139, 0.1)',
          warning: '#f59e0b',
          error: '#ef4444',
        },
        text: {
          primary: '#f0f6fc',
          secondary: '#8b949e',
          muted: '#484f58',
          inverse: '#080b12',
        },
        border: {
          default: 'rgba(255, 255, 255, 0.08)',
          subtle: 'rgba(255, 255, 255, 0.04)',
          hover: 'rgba(255, 255, 255, 0.16)',
          accent: 'rgba(63, 182, 139, 0.3)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-cabinet)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'Menlo', 'monospace'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.08', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg': ['3.5rem', { lineHeight: '1.12', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading-lg': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading-md': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '500' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      animation: {
        'shimmer': 'shimmer 600ms ease-out forwards',
        'float-slow': 'float-slow 20s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'pulse-subtle': 'pulse-subtle 4s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'ribbon-flow': 'ribbon-flow 12s ease-in-out infinite',
        'draw-stroke': 'draw-stroke 1.5s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'spring-in': 'spring-in 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        'shimmer': {
          '0%': { 
            backgroundPosition: '-200% 0',
            opacity: '0.6',
          },
          '100%': { 
            backgroundPosition: '200% 0',
            opacity: '1',
          },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-10px) rotate(1deg)' },
          '50%': { transform: 'translateY(-5px) rotate(-1deg)' },
          '75%': { transform: 'translateY(-15px) rotate(0.5deg)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.7' },
        },
        'glow-pulse': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(63, 182, 139, 0.15), 0 0 40px rgba(63, 182, 139, 0.1)',
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(63, 182, 139, 0.25), 0 0 60px rgba(63, 182, 139, 0.15)',
          },
        },
        'ribbon-flow': {
          '0%': { transform: 'translateX(-5%) translateY(0) scale(1)', opacity: '0.15' },
          '25%': { transform: 'translateX(0%) translateY(-10px) scale(1.02)', opacity: '0.2' },
          '50%': { transform: 'translateX(5%) translateY(0) scale(1)', opacity: '0.15' },
          '75%': { transform: 'translateX(0%) translateY(10px) scale(0.98)', opacity: '0.2' },
          '100%': { transform: 'translateX(-5%) translateY(0) scale(1)', opacity: '0.15' },
        },
        'draw-stroke': {
          'from': { strokeDashoffset: '1000' },
          'to': { strokeDashoffset: '0' },
        },
        'fade-in-up': {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'spring-in': {
          '0%': { opacity: '0', transform: 'scale(0.9) translateY(10px)' },
          '50%': { transform: 'scale(1.02) translateY(-2px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'shimmer-gradient': 'linear-gradient(90deg, transparent 0%, rgba(63, 182, 139, 0.08) 50%, transparent 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 50%, rgba(63, 182, 139, 0.02) 100%)',
        'hero-gradient': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(63, 182, 139, 0.15) 0%, transparent 50%)',
        'section-gradient': 'linear-gradient(180deg, transparent 0%, rgba(63, 182, 139, 0.03) 50%, transparent 100%)',
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(63, 182, 139, 0.15)',
        'glow-md': '0 0 30px rgba(63, 182, 139, 0.2)',
        'glow-lg': '0 0 50px rgba(63, 182, 139, 0.25)',
        'inner-glow': 'inset 0 0 30px rgba(63, 182, 139, 0.1)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
        'browser': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'gentle': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'smooth': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
};
