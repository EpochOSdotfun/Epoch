use anchor_lang::prelude::*;

declare_id!("CtrlrXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

pub mod error;
pub mod instructions;
pub mod state;

use instructions::*;

#[program]
pub mod controller {
    use super::*;

    /// Initialize the controller with admin and default config
    pub fn initialize(
        ctx: Context<Initialize>,
        bump: u8,
        config: ControllerConfig,
    ) -> Result<()> {
        instructions::initialize::handler(ctx, bump, config)
    }

    /// Update routing weights (admin only)
    pub fn update_weights(ctx: Context<UpdateConfig>, weights: RoutingWeights) -> Result<()> {
        instructions::config::update_weights_handler(ctx, weights)
    }

    /// Update slippage limits (admin only)
    pub fn update_slippage(ctx: Context<UpdateConfig>, max_slippage_bps: u16) -> Result<()> {
        instructions::config::update_slippage_handler(ctx, max_slippage_bps)
    }

    /// Update max trade size (admin only)
    pub fn update_max_trade(ctx: Context<UpdateConfig>, max_trade_lamports: u64) -> Result<()> {
        instructions::config::update_max_trade_handler(ctx, max_trade_lamports)
    }

    /// Add authorized keeper (admin only)
    pub fn add_keeper(ctx: Context<UpdateConfig>, keeper: Pubkey) -> Result<()> {
        instructions::config::add_keeper_handler(ctx, keeper)
    }

    /// Remove authorized keeper (admin only)
    pub fn remove_keeper(ctx: Context<UpdateConfig>, keeper: Pubkey) -> Result<()> {
        instructions::config::remove_keeper_handler(ctx, keeper)
    }

    /// Add allowed DEX program (admin only)
    pub fn add_dex(ctx: Context<UpdateConfig>, dex_program: Pubkey) -> Result<()> {
        instructions::config::add_dex_handler(ctx, dex_program)
    }

    /// Pause/unpause the flywheel (admin only)
    pub fn set_paused(ctx: Context<UpdateConfig>, paused: bool) -> Result<()> {
        instructions::config::set_paused_handler(ctx, paused)
    }

    /// Keeper executes a swap (with on-chain validation)
    pub fn execute_swap(
        ctx: Context<ExecuteSwap>,
        amount_in: u64,
        min_amount_out: u64,
    ) -> Result<()> {
        instructions::swap::handler(ctx, amount_in, min_amount_out)
    }

    /// Keeper routes SOL to different destinations
    pub fn route_funds(ctx: Context<RouteFunds>, action: RouteAction, amount: u64) -> Result<()> {
        instructions::route::handler(ctx, action, amount)
    }

    /// Fund the treasury vault
    pub fn fund_treasury(ctx: Context<FundTreasury>, amount: u64) -> Result<()> {
        instructions::treasury::fund_handler(ctx, amount)
    }

    /// Withdraw from treasury (admin only, for emergencies)
    pub fn withdraw_treasury(ctx: Context<WithdrawTreasury>, amount: u64) -> Result<()> {
        instructions::treasury::withdraw_handler(ctx, amount)
    }

    /// Update admin (requires current admin)
    pub fn update_admin(ctx: Context<UpdateAdmin>, new_admin: Pubkey) -> Result<()> {
        instructions::admin::update_admin_handler(ctx, new_admin)
    }
}

/// Routing weights - must sum to 100
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Default, Debug)]
pub struct RoutingWeights {
    /// Percentage to rewards distribution
    pub rewards_pct: u8,
    /// Percentage to buyback (token reflections)
    pub buyback_pct: u8,
    /// Percentage to buy and burn
    pub burn_pct: u8,
    /// Percentage to auto-LP
    pub auto_lp_pct: u8,
}

impl RoutingWeights {
    pub fn validate(&self) -> bool {
        self.rewards_pct + self.buyback_pct + self.burn_pct + self.auto_lp_pct == 100
    }
}

/// Controller configuration
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Default, Debug)]
pub struct ControllerConfig {
    pub weights: RoutingWeights,
    pub max_slippage_bps: u16,
    pub max_trade_lamports: u64,
    pub max_trades_per_day: u16,
}

/// Route action enum
#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, PartialEq)]
pub enum RouteAction {
    Rewards,
    Buyback,
    Burn,
    AutoLp,
}

