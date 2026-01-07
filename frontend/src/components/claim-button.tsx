'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Transaction } from '@solana/web3.js';
import { Loader2, CheckCircle, XCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { formatSol, cn } from '@/lib/utils';

interface ClaimButtonProps {
  wallet: string;
  unclaimedSol: string;
  className?: string;
}

type ClaimState = 'idle' | 'loading' | 'success' | 'error';

export function ClaimButton({ wallet, unclaimedSol, className }: ClaimButtonProps) {
  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();
  const [state, setState] = useState<ClaimState>('idle');
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClaim = async () => {
    if (!connected || !publicKey || !signTransaction) {
      setVisible(true);
      return;
    }

    if (publicKey.toBase58() !== wallet) {
      setError('Connected wallet does not match');
      setState('error');
      return;
    }

    setState('loading');
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/proof/batch/${wallet}`
      );
      const data = await response.json();

      if (!data.proofs || data.proofs.length === 0) {
        setError('No unclaimed rewards found');
        setState('error');
        return;
      }

      const proof = data.proofs[0];
      const tx = new Transaction();
      
      // Build claim instruction (placeholder)
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      tx.feePayer = publicKey;

      const signed = await signTransaction(tx);
      const sig = await connection.sendRawTransaction(signed.serialize());
      await connection.confirmTransaction(sig, 'confirmed');

      setSignature(sig);
      setState('success');
    } catch (err: any) {
      console.error('Claim failed:', err);
      setError(err.message || 'Failed to claim');
      setState('error');
    }
  };

  const reset = () => {
    setState('idle');
    setSignature(null);
    setError(null);
  };

  if (state === 'success') {
    return (
      <div className={cn('flex flex-col items-center gap-2', className)}>
        <div className="flex items-center gap-2 text-positive">
          <CheckCircle className="w-5 h-5" />
          <span className="text-body-sm font-medium">Claimed!</span>
        </div>
        {signature && (
          <a
            href={`https://solscan.io/tx/${signature}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-caption text-ink-500 hover:text-accent flex items-center gap-1"
          >
            View transaction <ExternalLink className="w-3 h-3" />
          </a>
        )}
        <button onClick={reset} className="text-caption text-ink-300 hover:text-ink-700">
          Done
        </button>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className={cn('flex flex-col items-center gap-2', className)}>
        <div className="flex items-center gap-2 text-negative">
          <XCircle className="w-5 h-5" />
          <span className="text-body-sm font-medium">Failed</span>
        </div>
        <p className="text-caption text-ink-500 text-center max-w-xs">{error}</p>
        <button onClick={reset} className="btn-secondary btn-sm">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleClaim}
      disabled={state === 'loading'}
      className={cn('btn-primary', className)}
    >
      {state === 'loading' ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Claiming...
        </>
      ) : (
        <>
          Claim {formatSol(unclaimedSol)} SOL
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}
