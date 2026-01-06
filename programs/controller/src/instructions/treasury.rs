use anchor_lang::prelude::*;
use anchor_lang::system_program::{self, Transfer};
use crate::state::ControllerState;
use crate::error::ControllerError;

#[derive(Accounts)]
pub struct FundTreasury<'info> {
    #[account(
        seeds = [b"controller_state"],
        bump = state.bump
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
    pub funder: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn fund_handler(ctx: Context<FundTreasury>, amount: u64) -> Result<()> {
    require!(amount > 0, ControllerError::ZeroAmount);

    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            Transfer {
                from: ctx.accounts.funder.to_account_info(),
                to: ctx.accounts.sol_vault.to_account_info(),
            },
        ),
        amount,
    )?;

    msg!("Treasury funded with {} lamports", amount);

    Ok(())
}

#[derive(Accounts)]
pub struct WithdrawTreasury<'info> {
    #[account(
        seeds = [b"controller_state"],
        bump = state.bump,
        constraint = admin.key() == state.admin @ ControllerError::UnauthorizedAdmin
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
    pub admin: Signer<'info>,

    /// CHECK: Withdrawal destination
    #[account(mut)]
    pub destination: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}

pub fn withdraw_handler(ctx: Context<WithdrawTreasury>, amount: u64) -> Result<()> {
    require!(amount > 0, ControllerError::ZeroAmount);

    let vault_balance = ctx.accounts.sol_vault.lamports();
    require!(
        vault_balance >= amount,
        ControllerError::InsufficientBalance
    );

    // Transfer from vault to destination
    **ctx.accounts.sol_vault.try_borrow_mut_lamports()? -= amount;
    **ctx.accounts.destination.try_borrow_mut_lamports()? += amount;

    msg!(
        "Admin withdrew {} lamports from treasury to {}",
        amount,
        ctx.accounts.destination.key()
    );

    Ok(())
}

