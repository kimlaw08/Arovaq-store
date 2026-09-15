"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { VersionedTransaction, PublicKey, Connection, clusterApiUrl } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

declare const window: any;

function CheckoutInner({ product }: { product: any }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Capture referral tag safely at runtime
  const searchParams = useSearchParams();
  const referralChannel = searchParams.get("ref") || "direct_traffic";

  const handleSolanaSplitPay = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = window?.phantom?.solana || window?.solana;
      if (!provider || !provider.isPhantom) throw new Error("Please install or open your Phantom wallet.");
      await provider.connect();
      
      const buyerPubkeyStr = provider.publicKey.toBase58();
      const buyerPubkey = new PublicKey(buyerPubkeyStr);
      const tokenMint = new PublicKey(product.token_mint_address || "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
      const buyerTokenAccount = getAssociatedTokenAddressSync(tokenMint, buyerPubkey);

      // 1. Request sponsored split transaction from backend
      const res = await fetch("/api/solana/sponsor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerPubkeyStr,
          buyerTokenAccountStr: buyerTokenAccount.toBase58(),
          creatorTokenAccountStr: product.creator_wallet,
          platformTokenAccountStr: process.env.NEXT_PUBLIC_PLATFORM_ATA,
          totalAmount: product.price_usdt_microunits || 1000000,
          creatorShareBps: 9000,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // 2. Sign and broadcast transaction via Phantom wallet
      const txBuf = Buffer.from(data.transaction, "base64");
      const tx = VersionedTransaction.deserialize(txBuf);
      const signedTx = await provider.signTransaction(tx);
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const sig = await connection.sendRawTransaction(signedTx.serialize());

      // 3. Log completed order and affiliate channel to Supabase
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          customer_email: "customer@arovaq.store",
          amount: product.price_usdt,
          payment_rail: "solana_direct",
          tx_signature: sig,
          referral_channel: referralChannel, // Counts affiliate traffic accurately!
        }),
      });

      alert(`Success! Order recorded under referral: ${referralChannel}. Signature: ${sig}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 pt-2">
      {error && <p className="text-xs text-red-400 font-mono bg-red-950/40 p-2.5 rounded-lg border border-red-900">{error}</p>}
      <button
        onClick={handleSolanaSplitPay}
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold py-3 px-4 rounded-xl transition shadow-lg shadow-emerald-950/50"
      >
        {loading ? "Processing Split Payment..." : `Pay Crypto Direct ($${product.price_usdt} USDT)`}
      </button>
    </div>
  );
}

export default function ProductCheckout({ product }: { product: any }) {
  return (
    <Suspense fallback={<div className="text-xs text-slate-500 font-mono py-2">Loading secure checkout...</div>}>
      <CheckoutInner product={product} />
    </Suspense>
  );
}