import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SolanaStrategy } from "../target/types/solana_strategy";
import { assert } from "chai";

describe("solana_strategy", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolanaStrategy as Program<SolanaStrategy>;

  it("Is initialized with data!", async () => {
    // Define a keypair for the base_account
    const baseAccount = anchor.web3.Keypair.generate();
    const data = new anchor.BN(42); // The data we want to initialize with

    // Send the transaction to initialize the account with data
    const tx = await program.methods
      .initialize(data)
      .accounts({
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      } as any)
      .signers([baseAccount]) // Sign the transaction with baseAccount
      .rpc();

    console.log("Your transaction signature:", tx);

    // Fetch the account data to verify initialization
    const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    assert.ok(account.data.eq(data), "The data was not set correctly");
  });
});
