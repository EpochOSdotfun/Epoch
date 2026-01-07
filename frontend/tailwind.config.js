/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // 12-column grid system
    container: {
      center: true,
      padding: {
        DEFAULT: '16px',
        sm: '24px',
        lg: '32px',
      },
    },
    // Type scale based on 8px system
    fontSize: {
      // Captions: 13/18
      'caption': ['13px', { lineHeight: '18px', letterSpacing: '0.01em' }],
      'caption-sm': ['11px', { lineHeight: '14px', letterSpacing: '0.02em' }],
      // Body: 16/26
      'body': ['16px', { lineHeight: '26px', letterSpacing: '0' }],
      'body-sm': ['14px', { lineHeight: '22px', letterSpacing: '0' }],
      // Headings
      'title-sm': ['18px', { lineHeight: '24px', letterSpacing: '-0.01em' }],
      'title': ['24px', { lineHeight: '32px', letterSpacing: '-0.015em' }],
      // H2: 32/40
      'h2': ['32px', { lineHeight: '40px', letterSpacing: '-0.02em' }],
      // H1: 52/56
      'h1': ['52px', { lineHeight: '56px', letterSpacing: '-0.025em' }],
      // Large display
      'display': ['64px', { lineHeight: '68px', letterSpacing: '-0.03em' }],
      // Mono for numbers
      'mono': ['14px', { lineHeight: '20px', letterSpacing: '0' }],
      'mono-lg': ['18px', { lineHeight: '24px', letterSpacing: '-0.01em' }],
    },
    // 8px spacing system
    spacing: {
      '0': '0',
      '1': '4px',
      '2': '8px',
      '3': '12px',
      '4': '16px',
      '5': '20px',
      '6': '24px',
      '7': '28px',
      '8': '32px',
      '9': '36px',
      '10': '40px',
      '11': '44px',
      '12': '48px',
      '14': '56px',
      '16': '64px',
      '18': '72px',
      '20': '80px',
      '24': '96px',
      '28': '112px',
      '32': '128px',
      '36': '144px',
      '40': '160px',
    },
    extend: {
      colors: {
        // Near-black background palette
        bg: {
          primary: '#0B0E14',
          secondary: '#0F1218',
          tertiary: '#14181F',
          elevated: '#1A1F28',
          hover: '#1F252F',
        },
        // Surface colors for cards/elements
        surface: {
          50: '#1A1F28',
          100: '#1F252F',
          200: '#252C38',
          300: '#2D3542',
        },
        // Text hierarchy
        ink: {
          900: '#F4F5F6',
          700: '#C8CCD2',
          500: '#8B919A',
          300: '#565C66',
          100: '#2D3542',
        },
        // Single accent: teal-cyan (professional, not neon)
        accent: '#14B8A6',
        'accent-dim': '#0D7D70',
        'accent-bright': '#2DD4BF',
        'accent-subtle': 'rgba(20, 184, 166, 0.08)',
        // Status colors (muted, not alarming)
        positive: '#22C55E',
        'positive-dim': '#166534',
        warning: '#EAB308',
        'warning-dim': '#A16207',
        negative: '#EF4444',
        'negative-dim': '#991B1B',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.3)',
        'DEFAULT': '0 2px 8px rgba(0, 0, 0, 0.4)',
        'md': '0 4px 16px rgba(0, 0, 0, 0.4)',
        'lg': '0 8px 32px rgba(0, 0, 0, 0.5)',
        'accent': '0 0 0 1px rgba(20, 184, 166, 0.3), 0 2px 8px rgba(20, 184, 166, 0.15)',
      },
      // Subtle motion: 180-240ms ease-out
      transitionDuration: {
        '180': '180ms',
        '200': '200ms',
        '240': '240ms',
      },
      transitionTimingFunction: {
        'out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-out': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(4px)' },
        },
        'count-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'skeleton': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 240ms ease-out forwards',
        'fade-out': 'fade-out 180ms ease-out forwards',
        'count-up': 'count-up 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'skeleton': 'skeleton 1.5s ease-in-out infinite',
      },
      gridTemplateColumns: {
        '12': 'repeat(12, minmax(0, 1fr))',
        'layout': '1fr minmax(0, 1200px) 1fr',
      },
    },
  },
  plugins: [],
};
