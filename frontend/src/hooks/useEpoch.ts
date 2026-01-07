import { useQuery } from '@tanstack/react-query';

interface Epoch {
  epochId: number;
  startSlot: string;
  endSlot: string;
  merkleRoot: string;
  rewardsSol: string;
  rewardsToken: string;
  claimedSol: string;
  claimedToken: string;
  numClaimants: number;
  totalAllocations: number;
  totalClaims: number;
  publishedAt: string;
  publishSig: string | null;
  csvHash: string | null;
  claimProgress: string;
}

async function fetchEpoch(epochId: number): Promise<Epoch> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/epochs/${epochId}`
  );
  if (!res.ok) throw new Error('Epoch not found');
  return res.json();
}

export function useEpoch(epochId: number) {
  return useQuery({
    queryKey: ['epoch', epochId],
    queryFn: () => fetchEpoch(epochId),
    enabled: !isNaN(epochId),
  });
}


