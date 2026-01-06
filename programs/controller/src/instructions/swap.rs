use anchor_lang::prelude::*;
use crate::state::ControllerState;
use crate::error::ControllerError;

#[derive(Accounts)]
pub struct ExecuteSwap<'info> {
    #[account(
        mut,
        seeds = [b"controller_state"],
        bump = state.bump,
        constraint = !state.paused @ ControllerError::Paused,
        constraint = state.is_keeper(&keeper.key()) @ ControllerError::UnauthorizedKeeper
    )]
    pub state: Account<'info, ControllerState>,

    /// CHECK: Treasury SOL vault
    #[account(
        mut,
        seeds = [b"treasury_sol"],
        bump = state.sol_vault_bump
    )]
    pub sol_vault: AccountInfo<'info>,

    #[account(mut)]
    pub keeper: Signer<'info>,

    /// CHECK: DEX program to use for swap
    pub dex_program: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
    // Additional accounts for DEX CPI would be passed as remaining_accounts
}

pub fn handler(
    ctx: Context<ExecuteSwap>,
    amount_in: u64,
    min_amount_out: u64,
) -> Result<()> {
    let state = &mut ctx.accounts.state;

    // Validate trade size
    require!(
        amount_in <= state.max_trade_lamports,
        ControllerError::TradeSizeExceeded
    );

    // Check daily limits
    let current_day = Clock::get()?.unix_timestamp as u64 / 86400;
    if current_day != state.current_day {
        state.current_day = current_day;
        state.trades_today = 0;
    }

    require!(
        state.trades_today < state.max_trades_per_day,
        ControllerError::DailyLimitExceeded
    );

    // Validate DEX program is allowed
    require!(
        state.is_allowed_dex(&ctx.accounts.dex_program.key()),
        ControllerError::DexNotAllowed
    );

    // Check vault has sufficient balance
    let vault_balance = ctx.accounts.sol_vault.lamports();
    require!(
        vault_balance >= amount_in,
        ControllerError::InsufficientBalance
    );

    // NOTE: Actual swap execution would be done via CPI to the DEX program
    // The remaining_accounts would contain all necessary DEX accounts
    // This is a framework - actual implementation depends on which DEX you integrate
    
    // For now, we just validate and log
    // In production, you'd do:
    // 1. CPI to DEX swap instruction
    // 2. Verify output amount >= min_amount_out
    // 3. Calculate actual slippage and verify <= max_slippage_bps

    state.trades_today += 1;

    msg!(
        "Swap executed: {} lamports -> min {} tokens via DEX {}",
        amount_in,
        min_amount_out,
        ctx.accounts.dex_program.key()
    );

    Ok(())
}

