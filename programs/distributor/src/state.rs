use anchor_lang::prelude::*;

/// Global distributor state
#[account]
#[derive(Default)]
pub struct DistributorState {
    /// Admin authority (should be multisig)
    pub admin: Pubkey,
    /// Keeper authority for publishing epochs
    pub keeper: Pubkey,
    /// SOL rewards vault bump
    pub sol_vault_bump: u8,
    /// Token rewards vault bump (if applicable)
    pub token_vault_bump: u8,
    /// State PDA bump
    pub bump: u8,
    /// Current epoch ID (auto-incremented)
    pub current_epoch: u64,
    /// Total SOL distributed across all epochs
    pub total_sol_distributed: u64,
    /// Total tokens distributed across all epochs
    pub total_token_distributed: u64,
    /// Paused flag
    pub paused: bool,
    /// Reserved for future use
    pub _reserved: [u8; 64],
}

impl DistributorState {
    pub const LEN: usize = 8 + // discriminator
        32 + // admin
        32 + // keeper
        1 +  // sol_vault_bump
        1 +  // token_vault_bump
        1 +  // bump
        8 +  // current_epoch
        8 +  // total_sol_distributed
        8 +  // total_token_distributed
        1 +  // paused
        64;  // reserved
}

/// Per-epoch state with merkle root and totals
#[account]
#[derive(Default)]
pub struct EpochState {
    /// Epoch identifier
    pub epoch_id: u64,
    /// Merkle root for this epoch's allocations
    pub merkle_root: [u8; 32],
    /// Total SOL rewards for this epoch
    pub total_rewards_sol: u64,
    /// Total token rewards for this epoch
    pub total_rewards_token: u64,
    /// Total SOL claimed so far
    pub claimed_sol: u64,
    /// Total tokens claimed so far
    pub claimed_token: u64,
    /// Slot when epoch started
    pub start_slot: u64,
    /// Slot when epoch ended
    pub end_slot: u64,
    /// Timestamp when published
    pub publish_time: i64,
    /// Number of unique claimants
    pub num_claimants: u32,
    /// Bump for PDA
    pub bump: u8,
    /// Reserved for future use
    pub _reserved: [u8; 32],
}

impl EpochState {
    pub const LEN: usize = 8 + // discriminator
        8 +  // epoch_id
        32 + // merkle_root
        8 +  // total_rewards_sol
        8 +  // total_rewards_token
        8 +  // claimed_sol
        8 +  // claimed_token
        8 +  // start_slot
        8 +  // end_slot
        8 +  // publish_time
        4 +  // num_claimants
        1 +  // bump
        32;  // reserved
}

/// Claim receipt - tracks that a wallet has claimed for an epoch
#[account]
#[derive(Default)]
pub struct ClaimReceipt {
    /// Wallet that claimed
    pub wallet: Pubkey,
    /// Epoch ID
    pub epoch_id: u64,
    /// SOL amount claimed
    pub amount_sol: u64,
    /// Token amount claimed
    pub amount_token: u64,
    /// Timestamp of claim
    pub claimed_at: i64,
    /// Bump for PDA
    pub bump: u8,
}

impl ClaimReceipt {
    pub const LEN: usize = 8 + // discriminator
        32 + // wallet
        8 +  // epoch_id
        8 +  // amount_sol
        8 +  // amount_token
        8 +  // claimed_at
        1;   // bump
}

