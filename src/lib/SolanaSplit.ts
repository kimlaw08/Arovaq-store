import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { createTransferInstruction, TOKEN_PROGRAM_ID } from "@solana/spl-token";

export async function buildSponsoredSplitTx(params: {
  connection: Connection;
  buyerTokenAccount: PublicKey;
  creatorTokenAccount: PublicKey;
  platformTokenAccount: PublicKey;
  buyerPubkey: PublicKey;
  gasPayerPubkey: PublicKey;
  totalAmount: number; // raw token micro-units
  creatorShareBps: number; // e.g. 9000 for 90%
}) {
  const {
    connection,
    buyerTokenAccount,
    creatorTokenAccount,
    platformTokenAccount,
    buyerPubkey,
    gasPayerPubkey,
    totalAmount,
    creatorShareBps,
  } = params;

  const creatorAmount = Math.floor((totalAmount * creatorShareBps) / 10000);
  const platformAmount = totalAmount - creatorAmount;

  const tx = new Transaction();
  tx.feePayer = gasPayerPubkey;

  if (creatorAmount > 0) {
    tx.add(
      createTransferInstruction(
        buyerTokenAccount,
        creatorTokenAccount,
        buyerPubkey,
        creatorAmount,
        [],
        TOKEN_PROGRAM_ID
      )
    );
  }

  if (platformAmount > 0) {
    tx.add(
      createTransferInstruction(
        buyerTokenAccount,
        platformTokenAccount,
        buyerPubkey,
        platformAmount,
        [],
        TOKEN_PROGRAM_ID
      )
    );
  }

  const { blockhash } = await connection.getLatestBlockhash("confirmed");
  tx.recentBlockhash = blockhash;

  return tx;
}