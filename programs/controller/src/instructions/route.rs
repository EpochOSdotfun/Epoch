use anchor_lang::prelude::*;
use crate::state::ControllerState;
use crate::error::ControllerError;
use crate::RouteAction;

#[derive(Accounts)]
pub struct RouteFunds<'info> {
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

    /// CHECK: Destination account (rewards vault, buyback, burn address, or LP)
    #[account(mut)]
    pub destination: AccountInfo<'info>,

    #[account(mut)]
    pub keeper: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<RouteFunds>, action: RouteAction, amount: u64) -> Result<()> {
    require!(amount > 0, ControllerError::ZeroAmount);

    let state = &mut ctx.accounts.state;
    let vault_balance = ctx.accounts.sol_vault.lamports();
    
    require!(
        vault_balance >= amount,
        ControllerError::InsufficientBalance
    );

    // Transfer SOL from vault to destination
    **ctx.accounts.sol_vault.try_borrow_mut_lamports()? -= amount;
    **ctx.accounts.destination.try_borrow_mut_lamports()? += amount;

    // Update tracking based on action
    match action {
        RouteAction::Rewards => {
            state.total_routed_rewards = state
                .total_routed_rewards
                .checked_add(amount)
                .ok_or(ControllerError::MathOverflow)?;
            msg!("Routed {} lamports to rewards", amount);
        }
        RouteAction::Buyback => {
            state.total_routed_buyback = state
                .total_routed_buyback
                .checked_add(amount)
                .ok_or(ControllerError::MathOverflow)?;
            msg!("Routed {} lamports to buyback", amount);
        }
        RouteAction::Burn => {
            state.total_routed_burn = state
                .total_routed_burn
                .checked_add(amount)
                .ok_or(ControllerError::MathOverflow)?;
            msg!("Routed {} lamports to burn", amount);
        }
        RouteAction::AutoLp => {
            state.total_routed_auto_lp = state
                .total_routed_auto_lp
                .checked_add(amount)
                .ok_or(ControllerError::MathOverflow)?;
            msg!("Routed {} lamports to auto-LP", amount);
        }
    }

    Ok(())
}


