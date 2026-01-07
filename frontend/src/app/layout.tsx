import './globals.css';
import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/navbar';

export const metadata: Metadata = {
  title: 'Liquid | Solana Rewards Dashboard',
  description: 'Earn SOL from liquidity fees—verifiable, transparent, automated.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <Providers>
          {/* Noise texture overlay */}
          <div className="noise-overlay" />
          
          {/* Main app */}
          <div className="relative min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
