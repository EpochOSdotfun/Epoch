use anchor_lang::prelude::*;
use crate::state::{ControllerState, MAX_KEEPERS, MAX_DEX_PROGRAMS};
use crate::error::ControllerError;
use crate::ControllerConfig;

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = admin,
        space = ControllerState::LEN,
        seeds = [b"controller_state"],
        bump
    )]
    pub state: Account<'info, ControllerState>,

    /// CHECK: SOL vault PDA
    #[account(
        seeds = [b"treasury_sol"],
        bump
    )]
    pub sol_vault: AccountInfo<'info>,

    #[account(mut)]
    pub admin: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Initialize>, bump: u8, config: ControllerConfig) -> Result<()> {
    require!(config.weights.validate(), ControllerError::InvalidWeights);

    let state = &mut ctx.accounts.state;
    
    state.admin = ctx.accounts.admin.key();
    state.paused = false;
    state.weights = config.weights;
    state.max_slippage_bps = config.max_slippage_bps;
    state.max_trade_lamports = config.max_trade_lamports;
    state.max_trades_per_day = config.max_trades_per_day;
    state.trades_today = 0;
    state.current_day = 0;
    state.keepers = [Pubkey::default(); MAX_KEEPERS];
    state.keepers[0] = ctx.accounts.admin.key(); // Admin is initial keeper
    state.num_keepers = 1;
    state.allowed_dex_programs = [Pubkey::default(); MAX_DEX_PROGRAMS];
    state.num_dex_programs = 0;
    state.sol_vault_bump = ctx.bumps.sol_vault;
    state.bump = bump;
    state.total_routed_rewards = 0;
    state.total_routed_buyback = 0;
    state.total_routed_burn = 0;
    state.total_routed_auto_lp = 0;
    state.total_tokens_burned = 0;

    msg!("Controller initialized with admin: {}", state.admin);
    msg!(
        "Weights: rewards={}%, buyback={}%, burn={}%, auto_lp={}%",
        config.weights.rewards_pct,
        config.weights.buyback_pct,
        config.weights.burn_pct,
        config.weights.auto_lp_pct
    );

    Ok(())
}


