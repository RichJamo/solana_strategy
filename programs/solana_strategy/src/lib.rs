use anchor_lang::prelude::*;

declare_id!("YourProgramIDHere");

#[program]
pub mod my_anchor_project {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, data: u64) -> Result<()> {
        let base_account = &mut ctx.accounts.base_account;
        base_account.data = data;
        Ok(())
    }
}

#[account]
pub struct BaseAccount {
    pub data: u64,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
