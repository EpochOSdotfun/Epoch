'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { WalletButton } from './wallet-button';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Overview' },
  { href: '/earnings', label: 'Dashboard' },
  { href: '/epochs', label: 'Epochs' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border-default bg-bg-primary/95 backdrop-blur-sm">
      <div className="container-main">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-accent-primary" />
            <span className="font-semibold text-body">Epoch</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-1.5 rounded text-caption font-medium transition-colors duration-150',
                  pathname === item.href
                    ? 'text-text-primary bg-bg-secondary'
                    : 'text-text-muted hover:text-text-primary hover:bg-bg-secondary'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-caption text-text-muted">
              <span className="status-dot status-dot-success" />
              <span>Mainnet</span>
            </div>
            <div className="hidden md:block">
              <WalletButton />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded hover:bg-bg-secondary transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5 text-text-secondary" />
              ) : (
                <Menu className="w-5 h-5 text-text-secondary" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden py-3 border-t border-border-default animate-fade-in">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'px-3 py-2.5 rounded text-body font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-bg-secondary text-text-primary'
                      : 'text-text-muted hover:text-text-primary hover:bg-bg-secondary'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 px-3 border-t border-border-default mt-2">
                <WalletButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
