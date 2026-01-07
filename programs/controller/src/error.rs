use anchor_lang::prelude::*;

#[error_code]
pub enum ControllerError {
    #[msg("Controller is paused")]
    Paused,
    #[msg("Unauthorized keeper")]
    UnauthorizedKeeper,
    #[msg("Unauthorized admin")]
    UnauthorizedAdmin,
    #[msg("Invalid routing weights - must sum to 100")]
    InvalidWeights,
    #[msg("Slippage exceeded maximum allowed")]
    SlippageExceeded,
    #[msg("Trade size exceeds maximum")]
    TradeSizeExceeded,
    #[msg("Daily trade limit exceeded")]
    DailyLimitExceeded,
    #[msg("DEX program not allowed")]
    DexNotAllowed,
    #[msg("Maximum keepers reached")]
    MaxKeepersReached,
    #[msg("Maximum DEX programs reached")]
    MaxDexProgramsReached,
    #[msg("Keeper not found")]
    KeeperNotFound,
    #[msg("Insufficient treasury balance")]
    InsufficientBalance,
    #[msg("Math overflow")]
    MathOverflow,
    #[msg("Zero amount")]
    ZeroAmount,
    #[msg("Invalid amount")]
    InvalidAmount,
}


