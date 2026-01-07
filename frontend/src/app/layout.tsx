import './globals.css';
import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import { Navbar } from '@/components/navbar';

export const metadata: Metadata = {
  title: 'Epoch | SOL Rewards Distribution',
  description: 'Automated SOL rewards from LP fees. Transparent, verifiable, on-chain.',
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
    <html lang="en">
      <body className="bg-bg-primary text-text-primary min-h-screen">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border-default mt-auto">
      <div className="container-main py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-accent-primary" />
            <span className="text-caption font-medium">Epoch</span>
          </div>
          <div className="flex items-center gap-6 text-caption text-text-muted">
            <a href="https://docs.epoch.fund" className="link-muted">Docs</a>
            <a href="https://github.com/EpochOSdotfun" className="link-muted">GitHub</a>
            <a href="https://twitter.com/epochdotfun" className="link-muted">Twitter</a>
          </div>
          <div className="text-micro text-text-muted">
            Program: <code className="mono">Distr...XXX</code>
          </div>
        </div>
      </div>
    </footer>
  );
}
