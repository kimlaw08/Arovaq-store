"use client";
import { useState } from "react";

export default function CreatorUploadForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/products/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setMessage("Success! Your product is fingerprinted, verified, and live on your shelf.");
      e.currentTarget.reset();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 text-white">
      <h2 className="text-xl font-bold tracking-tight">List Digital Product</h2>
      
      {message && <p className="text-xs font-mono p-3 bg-slate-800 rounded-lg text-emerald-400">{message}</p>}

      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1">Product Title</label>
        <input name="title" required placeholder="e.g. Advanced Solana Smart Contract Guide" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">URL Slug</label>
          <input name="slug" required placeholder="solana-guide-vol1" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">Price (USDT)</label>
          <input name="price_usdt" type="number" step="0.01" required placeholder="15.00" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1">Creator ID / Handle</label>
        <input name="creator_id" required placeholder="crypto-baze" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm" />
      </div>

      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1">Creator Payout Wallet (Solana)</label>
        <input name="creator_wallet" required placeholder="Creator Base58 Wallet Address" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm" />
      </div>

      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1">Description</label>
        <textarea name="description" rows={3} placeholder="Describe what buyers will learn or receive..." className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">Cover Image (Shelf Display)</label>
          <input name="cover_file" type="file" accept="image/*" className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-slate-800 file:text-white file:font-semibold" />
        </div>
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">Digital Product Asset (PDF/ZIP)</label>
          <input name="product_file" type="file" required className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-cyan-600 file:text-white file:font-semibold" />
        </div>
      </div>

      <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition text-sm">
        {loading ? "Fingerprinting & Uploading..." : "Publish Verified Product"}
      </button>
    </form>
  );
}