use anchor_lang::prelude::*;
use crate::state::ControllerState;
use crate::error::ControllerError;

#[derive(Accounts)]
pub struct UpdateAdmin<'info> {
    #[account(
        mut,
        seeds = [b"controller_state"],
        bump = state.bump,
        constraint = admin.key() == state.admin @ ControllerError::UnauthorizedAdmin
    )]
    pub state: Account<'info, ControllerState>,

    pub admin: Signer<'info>,
}

pub fn update_admin_handler(ctx: Context<UpdateAdmin>, new_admin: Pubkey) -> Result<()> {
    let state = &mut ctx.accounts.state;
    let old_admin = state.admin;
    state.admin = new_admin;
    
    msg!("Admin updated from {} to {}", old_admin, new_admin);
    
    Ok(())
}

