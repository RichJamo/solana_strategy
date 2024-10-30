import * as fs from "fs";
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaStrategy } from "../target/types/solana_strategy";
import { createMint, createAccount, mintTo, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { assert } from "chai";
import { Keypair } from "@solana/web3.js";

describe("SolanaStrategy", () => {
  const payerKeypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync("/Users/richardjamieson/.config/solana/id.json", "utf-8")))
  );

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.SolanaStrategy as Program<SolanaStrategy>;
  const provider = anchor.getProvider() as anchor.AnchorProvider;

  let mint = null;
  let userTokenAccount = null;
  let vaultTokenAccount = null;
  const vaultAccountKeypair = Keypair.generate(); // New Keypair for the vault token account

  before(async () => {
    // 1. Create an SPL token mint for testing.
    mint = await createMint(
      provider.connection,
      payerKeypair,
      provider.wallet.publicKey,
      null,
      6 // Assuming USDC with 6 decimals
    );

    // 2. Create the user's token account.
    userTokenAccount = await createAccount(
      provider.connection,
      payerKeypair,
      mint,
      provider.wallet.publicKey
    );

    // 3. Mint some tokens to the user's account for testing.
    await mintTo(
      provider.connection,
      payerKeypair,
      mint,
      userTokenAccount,
      payerKeypair,
      100_000_000 // Mint 100 tokens (6 decimals)
    );

    // 4. Create a token account for the vault with an on-curve address.
    vaultTokenAccount = await createAccount(
      provider.connection,
      payerKeypair,
      mint,
      vaultAccountKeypair.publicKey // Vault account is now an on-curve Keypair
    );
  });

  it("Initializes the vault", async () => {
    await program.methods
      .initialize()
      .accounts({
        user: provider.wallet.publicKey,
      })
      .rpc();
  });

  it("Invests tokens in the vault", async () => {
    const investAmount = new anchor.BN(10_000_000); // 10 tokens

    // Call the invest function
    await program.methods
      .invest(investAmount)
      .accounts({
        user: provider.wallet.publicKey,
        userTokenAccount: userTokenAccount,
        vaultAccount: vaultTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    // Check that the vault received the tokens
    const vaultBalance = await provider.connection.getTokenAccountBalance(vaultTokenAccount);
    assert.equal(vaultBalance.value.amount, "10000000", "Vault should have 10 tokens");
  });
});
