import { useQuery } from '@tanstack/react-query';

interface TopEarner {
  wallet: string;
  tokenBalance: string;
  reward: string;
  claimed: boolean;
}

interface EpochDetails {
  id: number;
  publishedAt: string;
  totalSol: string;
  totalToken: string;
  holderCount: number;
  claimCount: number;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
  merkleRoot: string;
  publishTx: string;
  feeClaimTx?: string;
  buybackTx?: string;
  burnTx?: string;
  rewardsSol?: string;
  rewardsPercent?: number;
  buybackSol?: string;
  buybackPercent?: number;
  autoLpSol?: string;
  autoLpPercent?: number;
  treasurySol?: string;
  treasuryPercent?: number;
  topEarners?: TopEarner[];
}

async function fetchEpochDetails(epochId: number): Promise<EpochDetails> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/epochs/${epochId}`
  );
  if (!res.ok) throw new Error('Epoch not found');
  return res.json();
}

export function useEpochDetails(epochId: number) {
  return useQuery({
    queryKey: ['epoch-details', epochId],
    queryFn: () => fetchEpochDetails(epochId),
    enabled: !isNaN(epochId) && epochId > 0,
    staleTime: 30 * 1000,
  });
}

