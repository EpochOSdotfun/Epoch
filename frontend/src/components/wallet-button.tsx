'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { ChevronDown, LogOut, Copy, Check, Wallet } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { shortenAddress, cn } from '@/lib/utils';

export function WalletButton() {
  const { publicKey, disconnect, connected, connecting } = useWallet();
  const { setVisible } = useWalletModal();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!connected) {
    return (
      <button
        onClick={() => setVisible(true)}
        disabled={connecting}
        className="btn-primary btn-sm"
      >
        {connecting ? (
          <div className="animate-spin w-3 h-3 border-2 border-bg-primary border-t-transparent rounded-full" />
        ) : (
          <Wallet className="w-3.5 h-3.5" />
        )}
        {connecting ? 'Connecting...' : 'Connect'}
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={cn(
          'btn-secondary btn-sm',
          dropdownOpen && 'bg-surface-50'
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-positive" />
        <span className="font-mono">{shortenAddress(publicKey!.toBase58())}</span>
        <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-180', dropdownOpen && 'rotate-180')} />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-bg-secondary border border-surface-100 rounded-md shadow-lg overflow-hidden z-50 animate-fade-in">
          <button
            onClick={handleCopy}
            className="w-full px-3 py-2.5 flex items-center gap-2.5 hover:bg-surface-50 transition-colors duration-180 text-left"
          >
            {copied ? (
              <Check className="w-4 h-4 text-positive" />
            ) : (
              <Copy className="w-4 h-4 text-ink-300" />
            )}
            <span className="text-body-sm text-ink-700">{copied ? 'Copied!' : 'Copy Address'}</span>
          </button>
          <div className="h-px bg-surface-100" />
          <button
            onClick={() => {
              disconnect();
              setDropdownOpen(false);
            }}
            className="w-full px-3 py-2.5 flex items-center gap-2.5 hover:bg-surface-50 transition-colors duration-180 text-left"
          >
            <LogOut className="w-4 h-4 text-ink-300" />
            <span className="text-body-sm text-ink-700">Disconnect</span>
          </button>
        </div>
      )}
    </div>
  );
}
