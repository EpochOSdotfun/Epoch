use anchor_lang::prelude::*;
use anchor_lang::system_program;
use crate::state::{DistributorState, EpochState, ClaimReceipt};
use crate::error::DistributorError;
use crate::{verify_proof, compute_leaf};

#[derive(Accounts)]
#[instruction(epoch_id: u64)]
pub struct Claim<'info> {
    #[account(
        mut,
        seeds = [b"distributor_state"],
        bump = state.bump,
        constraint = !state.paused @ DistributorError::Paused
    )]
    pub state: Account<'info, DistributorState>,

    #[account(
        mut,
        seeds = [b"epoch", &epoch_id.to_le_bytes()],
        bump = epoch.bump
    )]
    pub epoch: Account<'info, EpochState>,

    #[account(
        init,
        payer = claimant,
        space = ClaimReceipt::LEN,
        seeds = [b"claim", &epoch_id.to_le_bytes(), claimant.key().as_ref()],
        bump
    )]
    pub claim_receipt: Account<'info, ClaimReceipt>,

    /// CHECK: SOL vault PDA that holds rewards
    #[account(
        mut,
        seeds = [b"sol_vault"],
        bump = state.sol_vault_bump
    )]
    pub sol_vault: AccountInfo<'info>,

    #[account(mut)]
    pub claimant: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<Claim>,
    epoch_id: u64,
    amount_sol: u64,
    amount_token: u64,
    proof: Vec<[u8; 32]>,
) -> Result<()> {
    let epoch = &mut ctx.accounts.epoch;
    let claim_receipt = &mut ctx.accounts.claim_receipt;
    let state = &mut ctx.accounts.state;

    // Compute the leaf hash for this claim
    let leaf = compute_leaf(
        &ctx.accounts.claimant.key(),
        epoch_id,
        amount_sol,
        amount_token,
    );

    // Verify merkle proof
    require!(
        verify_proof(&proof, epoch.merkle_root, leaf),
        DistributorError::InvalidProof
    );

    // Check vault has sufficient balance for SOL
    let vault_balance = ctx.accounts.sol_vault.lamports();
    require!(
        vault_balance >= amount_sol,
        DistributorError::InsufficientBalance
    );

    // Transfer SOL from vault to claimant
    if amount_sol > 0 {
        let seeds = &[b"sol_vault".as_ref(), &[state.sol_vault_bump]];
        let signer_seeds = &[&seeds[..]];

        // Transfer lamports from vault to claimant
        **ctx.accounts.sol_vault.try_borrow_mut_lamports()? -= amount_sol;
        **ctx.accounts.claimant.try_borrow_mut_lamports()? += amount_sol;
    }

    // Update epoch claimed totals
    epoch.claimed_sol = epoch
        .claimed_sol
        .checked_add(amount_sol)
        .ok_or(DistributorError::MathOverflow)?;
    epoch.claimed_token = epoch
        .claimed_token
        .checked_add(amount_token)
        .ok_or(DistributorError::MathOverflow)?;
    epoch.num_claimants = epoch
        .num_claimants
        .checked_add(1)
        .ok_or(DistributorError::MathOverflow)?;

    // Update global totals
    state.total_sol_distributed = state
        .total_sol_distributed
        .checked_add(amount_sol)
        .ok_or(DistributorError::MathOverflow)?;
    state.total_token_distributed = state
        .total_token_distributed
        .checked_add(amount_token)
        .ok_or(DistributorError::MathOverflow)?;

    // Record the claim
    claim_receipt.wallet = ctx.accounts.claimant.key();
    claim_receipt.epoch_id = epoch_id;
    claim_receipt.amount_sol = amount_sol;
    claim_receipt.amount_token = amount_token;
    claim_receipt.claimed_at = Clock::get()?.unix_timestamp;
    claim_receipt.bump = ctx.bumps.claim_receipt;

    msg!(
        "Claimed {} SOL and {} tokens for epoch {} by {}",
        amount_sol,
        amount_token,
        epoch_id,
        ctx.accounts.claimant.key()
    );

    Ok(())
}


