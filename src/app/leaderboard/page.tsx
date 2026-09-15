import Link from 'next/link';

export default function LeaderboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b border-slate-900 pb-4">
        <div>
          <span className="text-xs font-mono text-emerald-400">AROVAQ // RANKINGS</span>
          <h1 className="text-2xl font-bold">Creator Leaderboard</h1>
        </div>
        <Link href="/" className="text-xs bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-lg hover:border-emerald-500/50">← Back to Storefront</Link>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-slate-800 text-sm font-semibold text-slate-300">
          <span>Rank & Creator</span>
          <span>Top Asset</span>
          <span>Volume (USDT)</span>
        </div>
        <div className="flex justify-between items-center py-3 text-sm">
          <span className="flex items-center gap-2"><span className="text-emerald-400 font-bold">#1</span> Crypto Baze</span>
          <span className="text-slate-400 text-xs">Solana Masterclass</span>
          <span className="text-emerald-400 font-bold">$12,450</span>
        </div>
      </div>
    </main>
  );
}