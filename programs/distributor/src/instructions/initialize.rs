use anchor_lang::prelude::*;
use crate::state::DistributorState;

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = admin,
        space = DistributorState::LEN,
        seeds = [b"distributor_state"],
        bump
    )]
    pub state: Account<'info, DistributorState>,

    /// CHECK: SOL vault PDA - just holds lamports
    #[account(
        seeds = [b"sol_vault"],
        bump
    )]
    pub sol_vault: AccountInfo<'info>,

    #[account(mut)]
    pub admin: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<Initialize>, bump: u8) -> Result<()> {
    let state = &mut ctx.accounts.state;
    
    state.admin = ctx.accounts.admin.key();
    state.keeper = ctx.accounts.admin.key(); // Initially admin is keeper
    state.bump = bump;
    state.sol_vault_bump = ctx.bumps.sol_vault;
    state.current_epoch = 0;
    state.total_sol_distributed = 0;
    state.total_token_distributed = 0;
    state.paused = false;

    msg!("Distributor initialized with admin: {}", state.admin);
    
    Ok(())
}


