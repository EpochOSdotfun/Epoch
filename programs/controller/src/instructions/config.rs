use anchor_lang::prelude::*;
use crate::state::{ControllerState, MAX_KEEPERS, MAX_DEX_PROGRAMS};
use crate::error::ControllerError;
use crate::RoutingWeights;

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    #[account(
        mut,
        seeds = [b"controller_state"],
        bump = state.bump,
        constraint = admin.key() == state.admin @ ControllerError::UnauthorizedAdmin
    )]
    pub state: Account<'info, ControllerState>,

    pub admin: Signer<'info>,
}

pub fn update_weights_handler(ctx: Context<UpdateConfig>, weights: RoutingWeights) -> Result<()> {
    require!(weights.validate(), ControllerError::InvalidWeights);
    
    let state = &mut ctx.accounts.state;
    state.weights = weights;
    
    msg!(
        "Weights updated: rewards={}%, buyback={}%, burn={}%, auto_lp={}%",
        weights.rewards_pct,
        weights.buyback_pct,
        weights.burn_pct,
        weights.auto_lp_pct
    );
    
    Ok(())
}

pub fn update_slippage_handler(ctx: Context<UpdateConfig>, max_slippage_bps: u16) -> Result<()> {
    let state = &mut ctx.accounts.state;
    state.max_slippage_bps = max_slippage_bps;
    
    msg!("Max slippage updated to {} bps", max_slippage_bps);
    
    Ok(())
}

pub fn update_max_trade_handler(ctx: Context<UpdateConfig>, max_trade_lamports: u64) -> Result<()> {
    let state = &mut ctx.accounts.state;
    state.max_trade_lamports = max_trade_lamports;
    
    msg!("Max trade size updated to {} lamports", max_trade_lamports);
    
    Ok(())
}

pub fn add_keeper_handler(ctx: Context<UpdateConfig>, keeper: Pubkey) -> Result<()> {
    let state = &mut ctx.accounts.state;
    
    require!(
        (state.num_keepers as usize) < MAX_KEEPERS,
        ControllerError::MaxKeepersReached
    );
    
    state.keepers[state.num_keepers as usize] = keeper;
    state.num_keepers += 1;
    
    msg!("Keeper added: {}", keeper);
    
    Ok(())
}

pub fn remove_keeper_handler(ctx: Context<UpdateConfig>, keeper: Pubkey) -> Result<()> {
    let state = &mut ctx.accounts.state;
    
    let mut found_idx: Option<usize> = None;
    for i in 0..state.num_keepers as usize {
        if state.keepers[i] == keeper {
            found_idx = Some(i);
            break;
        }
    }
    
    let idx = found_idx.ok_or(ControllerError::KeeperNotFound)?;
    
    // Shift remaining keepers down
    for i in idx..(state.num_keepers as usize - 1) {
        state.keepers[i] = state.keepers[i + 1];
    }
    state.keepers[state.num_keepers as usize - 1] = Pubkey::default();
    state.num_keepers -= 1;
    
    msg!("Keeper removed: {}", keeper);
    
    Ok(())
}

pub fn add_dex_handler(ctx: Context<UpdateConfig>, dex_program: Pubkey) -> Result<()> {
    let state = &mut ctx.accounts.state;
    
    require!(
        (state.num_dex_programs as usize) < MAX_DEX_PROGRAMS,
        ControllerError::MaxDexProgramsReached
    );
    
    state.allowed_dex_programs[state.num_dex_programs as usize] = dex_program;
    state.num_dex_programs += 1;
    
    msg!("DEX program added: {}", dex_program);
    
    Ok(())
}

pub fn set_paused_handler(ctx: Context<UpdateConfig>, paused: bool) -> Result<()> {
    let state = &mut ctx.accounts.state;
    state.paused = paused;
    
    msg!("Controller paused state set to: {}", paused);
    
    Ok(())
}

