'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { formatSol } from '@/lib/utils';

interface ClaimButtonProps {
  wallet: string;
  unclaimedSol: string;
  onSuccess?: () => void;
}

export function ClaimButton({ wallet, unclaimedSol, onSuccess }: ClaimButtonProps) {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwnWallet = connected && publicKey?.toBase58() === wallet;

  const handleClaim = async () => {
    if (!isOwnWallet) {
      setVisible(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulated claim for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || 'Claim failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <button disabled className="btn-accent opacity-80 cursor-default">
        <CheckCircle className="w-4 h-4" />
        Claimed
      </button>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleClaim}
        disabled={isLoading}
        className="btn-accent disabled:opacity-70"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : isOwnWallet ? (
          <>
            Claim All
            <ArrowRight className="w-4 h-4" />
          </>
        ) : (
          <>
            Connect to Claim
          </>
        )}
      </button>
      {error && (
        <span className="text-caption text-negative">{error}</span>
      )}
    </div>
  );
}
