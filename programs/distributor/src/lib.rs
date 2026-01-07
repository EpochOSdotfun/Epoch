use anchor_lang::prelude::*;
use anchor_lang::solana_program::keccak;

declare_id!("DistrXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

pub mod error;
pub mod instructions;
pub mod state;

use instructions::*;

#[program]
pub mod distributor {
    use super::*;

    /// Initialize the distributor with admin authority
    pub fn initialize(ctx: Context<Initialize>, bump: u8) -> Result<()> {
        instructions::initialize::handler(ctx, bump)
    }

    /// Publish a new epoch with merkle root and reward amounts
    pub fn publish_epoch(
        ctx: Context<PublishEpoch>,
        epoch_id: u64,
        merkle_root: [u8; 32],
        total_rewards_sol: u64,
        total_rewards_token: u64,
        start_slot: u64,
        end_slot: u64,
    ) -> Result<()> {
        instructions::publish_epoch::handler(
            ctx,
            epoch_id,
            merkle_root,
            total_rewards_sol,
            total_rewards_token,
            start_slot,
            end_slot,
        )
    }

    /// Claim rewards for a specific epoch using merkle proof
    pub fn claim(
        ctx: Context<Claim>,
        epoch_id: u64,
        amount_sol: u64,
        amount_token: u64,
        proof: Vec<[u8; 32]>,
    ) -> Result<()> {
        instructions::claim::handler(ctx, epoch_id, amount_sol, amount_token, proof)
    }

    /// Fund the rewards vault with SOL
    pub fn fund_sol_vault(ctx: Context<FundVault>, amount: u64) -> Result<()> {
        instructions::fund_vault::handler_sol(ctx, amount)
    }

    /// Fund the rewards vault with tokens
    pub fn fund_token_vault(ctx: Context<FundTokenVault>, amount: u64) -> Result<()> {
        instructions::fund_vault::handler_token(ctx, amount)
    }

    /// Update admin authority (requires current admin signature)
    pub fn update_admin(ctx: Context<UpdateAdmin>, new_admin: Pubkey) -> Result<()> {
        instructions::admin::update_admin_handler(ctx, new_admin)
    }

    /// Update keeper authority
    pub fn update_keeper(ctx: Context<UpdateKeeper>, new_keeper: Pubkey) -> Result<()> {
        instructions::admin::update_keeper_handler(ctx, new_keeper)
    }
}

/// Verify merkle proof for a leaf
pub fn verify_proof(proof: &[[u8; 32]], root: [u8; 32], leaf: [u8; 32]) -> bool {
    let mut computed_hash = leaf;
    for proof_element in proof.iter() {
        if computed_hash <= *proof_element {
            computed_hash = keccak::hashv(&[&computed_hash, proof_element]).0;
        } else {
            computed_hash = keccak::hashv(&[proof_element, &computed_hash]).0;
        }
    }
    computed_hash == root
}

/// Compute leaf hash for claim verification
pub fn compute_leaf(wallet: &Pubkey, epoch_id: u64, amount_sol: u64, amount_token: u64) -> [u8; 32] {
    keccak::hashv(&[
        wallet.as_ref(),
        &epoch_id.to_le_bytes(),
        &amount_sol.to_le_bytes(),
        &amount_token.to_le_bytes(),
    ])
    .0
}


