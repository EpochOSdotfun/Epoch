use anchor_lang::prelude::*;

#[error_code]
pub enum DistributorError {
    #[msg("Invalid merkle proof")]
    InvalidProof,
    #[msg("Already claimed for this epoch")]
    AlreadyClaimed,
    #[msg("Epoch not found")]
    EpochNotFound,
    #[msg("Insufficient vault balance")]
    InsufficientBalance,
    #[msg("Distributor is paused")]
    Paused,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Invalid epoch sequence")]
    InvalidEpochSequence,
    #[msg("Epoch already published")]
    EpochAlreadyPublished,
    #[msg("Math overflow")]
    MathOverflow,
    #[msg("Invalid slot range")]
    InvalidSlotRange,
    #[msg("Zero amount")]
    ZeroAmount,
}


