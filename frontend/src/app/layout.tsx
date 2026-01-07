import type { Metadata } from 'next';
import { Space_Mono, Instrument_Sans } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Nav } from '@/components/nav';
import './globals.css';

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Epoch OS | Solana LP Fee Distribution',
  description: 'Automated rewards for token holders. The flywheel collects LP fees, executes buybacks, burns tokens, and distributes SOL—all on-chain, every epoch.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${spaceMono.variable}`}>
      <body className="font-sans">
        <Providers>
          <Nav />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
