use anchor_lang::prelude::*;
use crate::state::{DistributorState, EpochState};
use crate::error::DistributorError;

#[derive(Accounts)]
#[instruction(epoch_id: u64)]
pub struct PublishEpoch<'info> {
    #[account(
        mut,
        seeds = [b"distributor_state"],
        bump = state.bump,
        constraint = !state.paused @ DistributorError::Paused
    )]
    pub state: Account<'info, DistributorState>,

    #[account(
        init,
        payer = keeper,
        space = EpochState::LEN,
        seeds = [b"epoch", &epoch_id.to_le_bytes()],
        bump
    )]
    pub epoch: Account<'info, EpochState>,

    #[account(
        mut,
        constraint = keeper.key() == state.keeper || keeper.key() == state.admin @ DistributorError::Unauthorized
    )]
    pub keeper: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<PublishEpoch>,
    epoch_id: u64,
    merkle_root: [u8; 32],
    total_rewards_sol: u64,
    total_rewards_token: u64,
    start_slot: u64,
    end_slot: u64,
) -> Result<()> {
    let state = &mut ctx.accounts.state;
    let epoch = &mut ctx.accounts.epoch;

    // Validate epoch sequence
    require!(
        epoch_id == state.current_epoch + 1,
        DistributorError::InvalidEpochSequence
    );

    // Validate slot range
    require!(
        end_slot >= start_slot,
        DistributorError::InvalidSlotRange
    );

    // Initialize epoch state
    epoch.epoch_id = epoch_id;
    epoch.merkle_root = merkle_root;
    epoch.total_rewards_sol = total_rewards_sol;
    epoch.total_rewards_token = total_rewards_token;
    epoch.claimed_sol = 0;
    epoch.claimed_token = 0;
    epoch.start_slot = start_slot;
    epoch.end_slot = end_slot;
    epoch.publish_time = Clock::get()?.unix_timestamp;
    epoch.num_claimants = 0;
    epoch.bump = ctx.bumps.epoch;

    // Update global state
    state.current_epoch = epoch_id;

    msg!(
        "Epoch {} published: {} SOL, {} tokens available",
        epoch_id,
        total_rewards_sol,
        total_rewards_token
    );

    Ok(())
}

