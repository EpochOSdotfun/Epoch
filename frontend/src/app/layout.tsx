import './globals.css';
import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/navbar';

export const metadata: Metadata = {
  title: 'SOL Flywheel | Automated Token Rewards',
  description: 'Earn SOL rewards automatically from LP fees. The flywheel that rewards holders.',
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
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg-primary text-text-primary min-h-screen antialiased">
        <Providers>
          <div className="relative min-h-screen">
            {/* Background grid pattern */}
            <div className="fixed inset-0 bg-grid-pattern bg-[length:50px_50px] opacity-50 pointer-events-none" />
            
            {/* Gradient orbs */}
            <div className="fixed top-0 left-1/4 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl pointer-events-none" />
            
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

