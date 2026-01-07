'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Wallet, ChevronDown, LogOut, Copy, ExternalLink } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function WalletButton() {
  const { publicKey, disconnect, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
      setDropdownOpen(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setDropdownOpen(false);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (!connected || !publicKey) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="btn-primary"
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={cn(
          'btn-secondary',
          dropdownOpen && 'bg-background-hover border-foreground-muted'
        )}
      >
        <div className="w-2 h-2 bg-success rounded-full" />
        {truncateAddress(publicKey.toBase58())}
        <ChevronDown className={cn(
          'w-4 h-4 transition-transform duration-200',
          dropdownOpen && 'rotate-180'
        )} />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-background-elevated border border-border rounded-card-sm shadow-elevated overflow-hidden animate-slide-down">
          <div className="p-3 border-b border-border">
            <p className="text-caption text-foreground-muted">Connected wallet</p>
            <p className="text-sm font-mono text-foreground truncate">
              {publicKey.toBase58()}
            </p>
          </div>
          <div className="p-1.5">
            <button
              onClick={handleCopyAddress}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground-secondary hover:text-foreground hover:bg-background-hover rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy address
            </button>
            <a
              href={`https://solscan.io/account/${publicKey.toBase58()}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setDropdownOpen(false)}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-foreground-secondary hover:text-foreground hover:bg-background-hover rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View on Solscan
            </a>
            <button
              onClick={handleDisconnect}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-error hover:bg-error-muted rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
