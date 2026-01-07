'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletButton } from './wallet-button';

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border-dim)]'
          : 'bg-transparent'
      }`}
    >
      <div className="container-editorial py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-2 h-2 rounded-full bg-[var(--accent)] group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium tracking-wide">Epoch OS</span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/" active={pathname === '/'}>
            Home
          </NavLink>
          <NavLink href="/epochs" active={pathname === '/epochs'}>
            Epochs
          </NavLink>
          <NavLink href="/earnings" active={pathname === '/earnings'}>
            Earnings
          </NavLink>
        </div>

        {/* Wallet */}
        <WalletButton minimal />
      </div>
    </nav>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`text-sm transition-colors ${
        active
          ? 'text-[var(--text-primary)]'
          : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
      }`}
    >
      {children}
    </Link>
  );
}

