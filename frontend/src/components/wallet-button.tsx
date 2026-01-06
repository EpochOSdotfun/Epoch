'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Wallet, ChevronDown, LogOut, Copy, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { shortenAddress } from '@/lib/utils';

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
        className="btn-primary"
      >
        {connecting ? (
          <div className="animate-spin w-4 h-4 border-2 border-bg-primary border-t-transparent rounded-full" />
        ) : (
          <Wallet className="w-4 h-4" />
        )}
        {connecting ? 'Connecting...' : 'Connect Wallet'}
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="btn-secondary"
      >
        <div className="w-2 h-2 rounded-full bg-accent-primary" />
        <span>{shortenAddress(publicKey!.toBase58())}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-bg-secondary border border-border-default rounded-lg shadow-xl overflow-hidden z-50">
          <button
            onClick={handleCopy}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-bg-elevated transition-colors text-left"
          >
            {copied ? (
              <Check className="w-4 h-4 text-accent-primary" />
            ) : (
              <Copy className="w-4 h-4 text-text-muted" />
            )}
            <span>{copied ? 'Copied!' : 'Copy Address'}</span>
          </button>
          <button
            onClick={() => {
              disconnect();
              setDropdownOpen(false);
            }}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-bg-elevated transition-colors text-left text-accent-error"
          >
            <LogOut className="w-4 h-4" />
            <span>Disconnect</span>
          </button>
        </div>
      )}
    </div>
  );
}

