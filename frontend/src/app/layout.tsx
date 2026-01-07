import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/navbar';

// ============================================
// TYPOGRAPHY SYSTEM
// Clean, professional, enterprise-grade
// ============================================

// Primary body font - clean, highly legible
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Monospace for code and data
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
});

// Display font - Cabinet Grotesk alternative using Space Grotesk
// For a more distinctive look, you could use a local font file
const cabinet = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cabinet',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'EpochOS | Enterprise Token Distribution Infrastructure',
  description: 'Automated SOL rewards with verifiable Merkle proofs. Enterprise-grade token distribution for the Solana ecosystem.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'EpochOS | Enterprise Token Distribution',
    description: 'Automated SOL rewards with verifiable Merkle proofs. Enterprise-grade infrastructure.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EpochOS | Enterprise Token Distribution',
    description: 'Automated SOL rewards with verifiable Merkle proofs.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`dark ${inter.variable} ${jetbrainsMono.variable} ${cabinet.variable}`}
    >
      <head>
        <meta name="theme-color" content="#080b12" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-bg-primary text-text-primary min-h-screen antialiased font-sans">
        <Providers>
          <div className="relative min-h-screen">
            {/* Subtle background texture */}
            <div 
              className="fixed inset-0 pointer-events-none opacity-30"
              style={{
                backgroundImage: `radial-gradient(rgba(63, 182, 139, 0.03) 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
              }}
            />
            
            {/* Ambient gradient orbs - very subtle */}
            <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-accent-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-accent-primary/3 rounded-full blur-[100px] pointer-events-none" />
            
            {/* Content */}
            <div className="relative z-10">
              <Navbar />
              <main>{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
