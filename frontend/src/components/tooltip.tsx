'use client';

import { useState, useRef, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export function Tooltip({ 
  content, 
  children, 
  position = 'top',
  delay = 200 
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);

  const showTooltip = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        let x = 0;
        let y = 0;

        switch (position) {
          case 'top':
            x = rect.left + rect.width / 2;
            y = rect.top - 8;
            break;
          case 'bottom':
            x = rect.left + rect.width / 2;
            y = rect.bottom + 8;
            break;
          case 'left':
            x = rect.left - 8;
            y = rect.top + rect.height / 2;
            break;
          case 'right':
            x = rect.right + 8;
            y = rect.top + rect.height / 2;
            break;
        }

        setCoords({ x, y });
        setIsVisible(true);
      }
    }, delay);
  }, [position, delay]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  }, []);

  const tooltipStyle: React.CSSProperties = {
    position: 'fixed',
    left: coords.x,
    top: coords.y,
    transform: position === 'top' 
      ? 'translate(-50%, -100%)' 
      : position === 'bottom'
      ? 'translate(-50%, 0)'
      : position === 'left'
      ? 'translate(-100%, -50%)'
      : 'translate(0, -50%)',
    zIndex: 9999,
  };

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-flex"
      >
        {children}
      </span>
      {typeof window !== 'undefined' && isVisible && createPortal(
        <div
          style={tooltipStyle}
          className="px-2.5 py-1.5 text-caption bg-bg-inverse text-text-inverse rounded shadow-elevated animate-fade-in max-w-xs"
          role="tooltip"
        >
          {content}
        </div>,
        document.body
      )}
    </>
  );
}

// Common tooltip content for technical terms
export const tooltipContent = {
  merkleRoot: 'A cryptographic hash that verifies all allocations for this epoch. Used to prove your claim on-chain.',
  epochSlot: 'The Solana slot number when this epoch snapshot was taken.',
  eligibleSupply: 'Total token supply excluding burned tokens, LP vaults, and treasury holdings.',
  proofPath: 'The Merkle proof path used to verify your allocation on-chain.',
};

