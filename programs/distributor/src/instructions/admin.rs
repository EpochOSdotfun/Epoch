use anchor_lang::prelude::*;
use crate::state::DistributorState;
use crate::error::DistributorError;

#[derive(Accounts)]
pub struct UpdateAdmin<'info> {
    #[account(
        mut,
        seeds = [b"distributor_state"],
        bump = state.bump,
        constraint = admin.key() == state.admin @ DistributorError::Unauthorized
    )]
    pub state: Account<'info, DistributorState>,

    pub admin: Signer<'info>,
}

pub fn update_admin_handler(ctx: Context<UpdateAdmin>, new_admin: Pubkey) -> Result<()> {
    let state = &mut ctx.accounts.state;
    let old_admin = state.admin;
    state.admin = new_admin;
    
    msg!("Admin updated from {} to {}", old_admin, new_admin);
    
    Ok(())
}

#[derive(Accounts)]
pub struct UpdateKeeper<'info> {
    #[account(
        mut,
        seeds = [b"distributor_state"],
        bump = state.bump,
        constraint = admin.key() == state.admin @ DistributorError::Unauthorized
    )]
    pub state: Account<'info, DistributorState>,

    pub admin: Signer<'info>,
}

pub fn update_keeper_handler(ctx: Context<UpdateKeeper>, new_keeper: Pubkey) -> Result<()> {
    let state = &mut ctx.accounts.state;
    let old_keeper = state.keeper;
    state.keeper = new_keeper;
    
    msg!("Keeper updated from {} to {}", old_keeper, new_keeper);
    
    Ok(())
}

#[derive(Accounts)]
pub struct SetPaused<'info> {
    #[account(
        mut,
        seeds = [b"distributor_state"],
        bump = state.bump,
        constraint = admin.key() == state.admin @ DistributorError::Unauthorized
    )]
    pub state: Account<'info, DistributorState>,

    pub admin: Signer<'info>,
}

pub fn set_paused_handler(ctx: Context<SetPaused>, paused: bool) -> Result<()> {
    let state = &mut ctx.accounts.state;
    state.paused = paused;
    
    msg!("Distributor paused state set to: {}", paused);
    
    Ok(())
}


