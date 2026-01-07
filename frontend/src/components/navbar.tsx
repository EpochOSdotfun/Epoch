'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { WalletButton } from './wallet-button';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/earnings', label: 'Earnings' },
  { href: '/epochs', label: 'Epochs' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-surface-200 bg-white/80 backdrop-blur-sm">
      <div className="container-default">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-ink-900 rounded flex items-center justify-center">
              <span className="text-white font-semibold text-sm">E</span>
            </div>
            <span className="font-semibold text-ink-900 hidden sm:block">Epoch</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 rounded text-body-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'text-ink-900 bg-surface-100'
                    : 'text-ink-500 hover:text-ink-900 hover:bg-surface-50'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Wallet Button */}
          <div className="hidden md:block">
            <WalletButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded hover:bg-surface-100 transition-colors"
          >
            {mobileOpen ? (
              <X className="w-5 h-5 text-ink-700" />
            ) : (
              <Menu className="w-5 h-5 text-ink-700" />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-surface-200">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-surface-100 text-ink-900'
                      : 'text-ink-500 hover:text-ink-900 hover:bg-surface-50'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-4 px-4">
                <WalletButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
