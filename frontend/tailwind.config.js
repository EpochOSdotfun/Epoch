/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Executive monochrome palette
        surface: {
          0: '#FAFAFA',      // Background
          50: '#F5F5F5',     // Elevated
          100: '#EBEBEB',    // Cards
          200: '#E0E0E0',    // Borders
          300: '#BDBDBD',    // Disabled
        },
        ink: {
          900: '#1A1A1A',    // Primary text
          700: '#424242',    // Secondary text
          500: '#757575',    // Tertiary text
          300: '#9E9E9E',    // Muted text
          100: '#E0E0E0',    // Faint text
        },
        // Single accent - muted teal
        accent: {
          DEFAULT: '#0D9488',
          hover: '#0F766E',
          muted: '#0D948810',
          subtle: '#0D948808',
        },
        // Semantic
        positive: '#059669',
        negative: '#DC2626',
        warning: '#D97706',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        // Type scale
        'display': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
        'title-lg': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'title': ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.01em', fontWeight: '600' }],
        'title-sm': ['1rem', { lineHeight: '1.5', fontWeight: '600' }],
        'body': ['0.9375rem', { lineHeight: '1.6' }],
        'body-sm': ['0.8125rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.01em' }],
        'mono': ['0.8125rem', { lineHeight: '1.5' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '6px',
        'md': '8px',
        'lg': '12px',
      },
      boxShadow: {
        'subtle': '0 1px 2px rgba(0,0,0,0.04)',
        'card': '0 1px 3px rgba(0,0,0,0.06)',
        'elevated': '0 4px 12px rgba(0,0,0,0.08)',
      },
      transitionDuration: {
        '150': '150ms',
      },
    },
  },
  plugins: [],
};
