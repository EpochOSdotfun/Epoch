'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { WalletButton } from './wallet-button';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/docs', label: 'Docs' },
  { href: '/epochs', label: 'Metrics' },
  { href: '/earnings', label: 'Earnings' },
  { href: '/security', label: 'Security' },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-200',
        scrolled 
          ? 'bg-bg-primary/95 backdrop-blur-sm border-b border-surface-100' 
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <nav className="container-default h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-ink-900 rounded flex items-center justify-center">
            <span className="text-bg-primary font-semibold text-body-sm">E</span>
          </div>
          <span className="font-semibold text-body text-ink-900 group-hover:text-accent transition-colors duration-180">
            Epoch
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-1.5 rounded text-body-sm transition-colors duration-180',
                  isActive
                    ? 'text-ink-900 bg-surface-50'
                    : 'text-ink-500 hover:text-ink-900 hover:bg-surface-50/50'
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Wallet */}
        <div className="hidden md:flex items-center gap-4">
          <WalletButton />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 -mr-2 text-ink-500 hover:text-ink-900"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="md:hidden border-t border-surface-100 bg-bg-primary">
          <div className="container-default py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'block px-3 py-2 rounded text-body-sm transition-colors duration-180',
                    isActive
                      ? 'text-ink-900 bg-surface-50'
                      : 'text-ink-500 hover:text-ink-900 hover:bg-surface-50'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-4 px-3">
              <WalletButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
