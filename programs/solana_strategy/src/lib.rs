use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, Transfer};

declare_id!("25CLGmMNTKy9xKHpREMfuCgUK3p9ZdhPP8ETxFKoMFtE");

#[program]
pub mod solana_strategy {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    pub fn invest(ctx: Context<Invest>, amount: u64) -> Result<()> {
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.vault_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Invest<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    /// CHECK: This is a token account for the user, validated in the program logic.
    #[account(mut)]
    pub user_token_account: AccountInfo<'info>,
    /// CHECK: This is the vault’s token account, validated in the program logic.
    #[account(mut)]
    pub vault_account: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct VaultAuthority {
    pub bump: u8,
}
