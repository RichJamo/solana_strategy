use anchor_lang::prelude::*;

declare_id!("25CLGmMNTKy9xKHpREMfuCgUK3p9ZdhPP8ETxFKoMFtE");

#[program]
pub mod solana_strategy {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
