use anchor_lang::prelude::*;
use crate::{RoutingWeights, ControllerConfig};

/// Maximum number of authorized keepers
pub const MAX_KEEPERS: usize = 5;
/// Maximum number of allowed DEX programs
pub const MAX_DEX_PROGRAMS: usize = 10;

/// Global controller state
#[account]
pub struct ControllerState {
    /// Admin authority (should be multisig)
    pub admin: Pubkey,
    /// Paused flag - stops all keeper operations
    pub paused: bool,
    /// Routing weights configuration
    pub weights: RoutingWeights,
    /// Maximum slippage in basis points (100 = 1%)
    pub max_slippage_bps: u16,
    /// Maximum trade size in lamports per transaction
    pub max_trade_lamports: u64,
    /// Maximum trades per day
    pub max_trades_per_day: u16,
    /// Trades executed today
    pub trades_today: u16,
    /// Day counter (unix timestamp / 86400)
    pub current_day: u64,
    /// Authorized keeper addresses
    pub keepers: [Pubkey; MAX_KEEPERS],
    /// Number of active keepers
    pub num_keepers: u8,
    /// Allowed DEX program IDs for swaps
    pub allowed_dex_programs: [Pubkey; MAX_DEX_PROGRAMS],
    /// Number of allowed DEX programs
    pub num_dex_programs: u8,
    /// Treasury SOL vault bump
    pub sol_vault_bump: u8,
    /// Treasury token vault bump
    pub token_vault_bump: u8,
    /// State PDA bump
    pub bump: u8,
    /// Total SOL routed to rewards
    pub total_routed_rewards: u64,
    /// Total SOL used for buyback
    pub total_routed_buyback: u64,
    /// Total SOL used for burn
    pub total_routed_burn: u64,
    /// Total SOL used for auto-LP
    pub total_routed_auto_lp: u64,
    /// Total tokens burned
    pub total_tokens_burned: u64,
    /// Reserved for future use
    pub _reserved: [u8; 64],
}

impl ControllerState {
    pub const LEN: usize = 8 + // discriminator
        32 + // admin
        1 +  // paused
        4 +  // weights (4 bytes)
        2 +  // max_slippage_bps
        8 +  // max_trade_lamports
        2 +  // max_trades_per_day
        2 +  // trades_today
        8 +  // current_day
        (32 * MAX_KEEPERS) + // keepers
        1 +  // num_keepers
        (32 * MAX_DEX_PROGRAMS) + // allowed_dex_programs
        1 +  // num_dex_programs
        1 +  // sol_vault_bump
        1 +  // token_vault_bump
        1 +  // bump
        8 +  // total_routed_rewards
        8 +  // total_routed_buyback
        8 +  // total_routed_burn
        8 +  // total_routed_auto_lp
        8 +  // total_tokens_burned
        64;  // reserved

    pub fn is_keeper(&self, key: &Pubkey) -> bool {
        for i in 0..self.num_keepers as usize {
            if self.keepers[i] == *key {
                return true;
            }
        }
        false
    }

    pub fn is_allowed_dex(&self, program_id: &Pubkey) -> bool {
        for i in 0..self.num_dex_programs as usize {
            if self.allowed_dex_programs[i] == *program_id {
                return true;
            }
        }
        false
    }
}

/// Swap execution record for audit trail
#[account]
pub struct SwapRecord {
    /// Keeper who executed
    pub keeper: Pubkey,
    /// Amount in (SOL lamports)
    pub amount_in: u64,
    /// Amount out (tokens)
    pub amount_out: u64,
    /// Slippage bps achieved
    pub actual_slippage_bps: u16,
    /// DEX program used
    pub dex_program: Pubkey,
    /// Timestamp
    pub timestamp: i64,
    /// Bump
    pub bump: u8,
}

impl SwapRecord {
    pub const LEN: usize = 8 + 32 + 8 + 8 + 2 + 32 + 8 + 1;
}

/// Route execution record
#[account]
pub struct RouteRecord {
    /// Action type
    pub action: u8, // 0=rewards, 1=buyback, 2=burn, 3=auto_lp
    /// Amount routed
    pub amount: u64,
    /// Destination (if applicable)
    pub destination: Pubkey,
    /// Timestamp
    pub timestamp: i64,
    /// Bump
    pub bump: u8,
}

impl RouteRecord {
    pub const LEN: usize = 8 + 1 + 8 + 32 + 8 + 1;
}

