use anchor_lang::prelude::*;
use anchor_lang::system_program::{self, Transfer};
use anchor_spl::token::{self, Token, TokenAccount, Transfer as TokenTransfer};
use crate::state::DistributorState;
use crate::error::DistributorError;

#[derive(Accounts)]
pub struct FundVault<'info> {
    #[account(
        seeds = [b"distributor_state"],
        bump = state.bump
    )]
    pub state: Account<'info, DistributorState>,

    /// CHECK: SOL vault PDA
    #[account(
        mut,
        seeds = [b"sol_vault"],
        bump = state.sol_vault_bump
    )]
    pub sol_vault: AccountInfo<'info>,

    #[account(mut)]
    pub funder: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler_sol(ctx: Context<FundVault>, amount: u64) -> Result<()> {
    require!(amount > 0, DistributorError::ZeroAmount);

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

    msg!("Funded SOL vault with {} lamports", amount);

    Ok(())
}

#[derive(Accounts)]
pub struct FundTokenVault<'info> {
    #[account(
        seeds = [b"distributor_state"],
        bump = state.bump
    )]
    pub state: Account<'info, DistributorState>,

    #[account(mut)]
    pub token_vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub funder_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub funder: Signer<'info>,

    pub token_program: Program<'info, Token>,
}

pub fn handler_token(ctx: Context<FundTokenVault>, amount: u64) -> Result<()> {
    require!(amount > 0, DistributorError::ZeroAmount);

    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            TokenTransfer {
                from: ctx.accounts.funder_token_account.to_account_info(),
                to: ctx.accounts.token_vault.to_account_info(),
                authority: ctx.accounts.funder.to_account_info(),
            },
        ),
        amount,
    )?;

    msg!("Funded token vault with {} tokens", amount);

    Ok(())
}


