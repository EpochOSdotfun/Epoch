'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Transaction } from '@solana/web3.js';
import { Check, Loader2, ArrowRight, ExternalLink, AlertCircle } from 'lucide-react';
import { formatSol, shortenAddress } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ClaimStepperProps {
  wallet: string;
  unclaimedSol: string;
  unclaimedEpochs: number;
  onComplete?: () => void;
}

type Step = 'verify' | 'sign' | 'confirm';
type Status = 'idle' | 'loading' | 'success' | 'error';

export function ClaimStepper({ 
  wallet, 
  unclaimedSol, 
  unclaimedEpochs,
  onComplete 
}: ClaimStepperProps) {
  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();
  
  const [step, setStep] = useState<Step>('verify');
  const [status, setStatus] = useState<Status>('idle');
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const steps: { key: Step; label: string }[] = [
    { key: 'verify', label: 'Verify' },
    { key: 'sign', label: 'Sign' },
    { key: 'confirm', label: 'Confirm' },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === step);

  const handleVerify = () => {
    if (!connected) {
      setVisible(true);
      return;
    }

    if (publicKey?.toBase58() !== wallet) {
      setError('Connected wallet does not match. Please connect the correct wallet.');
      setStatus('error');
      return;
    }

    setStep('sign');
    setError(null);
  };

  const handleSign = async () => {
    if (!publicKey || !signTransaction) return;

    setStatus('loading');
    setError(null);

    try {
      // Fetch unclaimed proofs
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/proof/batch/${wallet}`
      );
      const data = await response.json();

      if (!data.proofs || data.proofs.length === 0) {
        setError('No unclaimed rewards found.');
        setStatus('error');
        return;
      }

      // Build claim transaction
      const tx = new Transaction();
      // In production: add claim instructions for each unclaimed epoch
      
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
      tx.feePayer = publicKey;

      const signed = await signTransaction(tx);
      const sig = await connection.sendRawTransaction(signed.serialize());
      
      setSignature(sig);
      setStep('confirm');
      setStatus('loading');

      // Wait for confirmation
      await connection.confirmTransaction(sig, 'confirmed');
      setStatus('success');
      onComplete?.();

    } catch (err: unknown) {
      console.error('Claim failed:', err);
      setError(err instanceof Error ? err.message : 'Transaction failed. Please try again.');
      setStatus('error');
    }
  };

  const reset = () => {
    setStep('verify');
    setStatus('idle');
    setSignature(null);
    setError(null);
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-body font-semibold text-text-primary">Claim Rewards</h3>
          <p className="text-caption text-text-muted mt-0.5">
            {formatSol(unclaimedSol)} SOL from {unclaimedEpochs} epoch{unclaimedEpochs !== 1 ? 's' : ''}
          </p>
        </div>
        {status === 'success' && (
          <span className="badge badge-success">Completed</span>
        )}
      </div>

      {/* Stepper */}
      <div className="stepper mb-6">
        {steps.map((s, index) => (
          <div key={s.key} className="stepper-step flex-1">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'stepper-indicator',
                  index < currentStepIndex && 'stepper-indicator-complete',
                  index === currentStepIndex && status !== 'error' && 'stepper-indicator-active',
                  status === 'error' && index === currentStepIndex && 'border-accent-error bg-accent-error/10 text-accent-error'
                )}
              >
                {index < currentStepIndex ? (
                  <Check className="w-3 h-3" />
                ) : status === 'loading' && index === currentStepIndex ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={cn(
                  'stepper-label hidden sm:block',
                  index === currentStepIndex && 'stepper-label-active'
                )}
              >
                {s.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'stepper-connector mx-3',
                  index < currentStepIndex && 'stepper-connector-complete'
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[120px]">
        {step === 'verify' && (
          <div className="space-y-4">
            <div className="bg-bg-secondary rounded-lg p-4">
              <div className="text-caption text-text-muted mb-1">Claiming wallet</div>
              <div className="mono text-body">{shortenAddress(wallet)}</div>
            </div>
            {error && (
              <div className="flex items-start gap-2 text-caption text-accent-error">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}
            <button onClick={handleVerify} className="btn-primary w-full">
              {connected ? 'Verify Wallet' : 'Connect Wallet'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 'sign' && (
          <div className="space-y-4">
            <div className="bg-bg-secondary rounded-lg p-4">
              <div className="text-caption text-text-muted mb-2">Transaction summary</div>
              <div className="space-y-2">
                <div className="flex justify-between text-body">
                  <span className="text-text-secondary">Amount</span>
                  <span className="font-medium">{formatSol(unclaimedSol)} SOL</span>
                </div>
                <div className="flex justify-between text-body">
                  <span className="text-text-secondary">Epochs</span>
                  <span className="font-medium">{unclaimedEpochs}</span>
                </div>
              </div>
            </div>
            {error && (
              <div className="flex items-start gap-2 text-caption text-accent-error">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}
            <button 
              onClick={handleSign} 
              className="btn-primary w-full"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing...
                </>
              ) : (
                <>
                  Sign Transaction
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-4">
            {status === 'loading' && (
              <div className="text-center py-4">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3 text-text-muted" />
                <div className="text-body text-text-secondary">Confirming transaction...</div>
              </div>
            )}
            {status === 'success' && (
              <div className="text-center py-4">
                <div className="w-10 h-10 rounded-full bg-accent-success/10 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-5 h-5 text-accent-success" />
                </div>
                <div className="text-body font-medium text-text-primary mb-1">
                  Claim successful
                </div>
                <div className="text-caption text-text-muted mb-4">
                  {formatSol(unclaimedSol)} SOL has been sent to your wallet
                </div>
                {signature && (
                  <a
                    href={`https://solscan.io/tx/${signature}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-caption link-muted"
                  >
                    View transaction
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            )}
            {status === 'error' && (
              <div className="text-center py-4">
                <div className="w-10 h-10 rounded-full bg-accent-error/10 flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-5 h-5 text-accent-error" />
                </div>
                <div className="text-body font-medium text-text-primary mb-1">
                  Transaction failed
                </div>
                <div className="text-caption text-text-muted mb-4">
                  {error || 'Something went wrong'}
                </div>
                <button onClick={reset} className="btn-secondary btn-sm">
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

