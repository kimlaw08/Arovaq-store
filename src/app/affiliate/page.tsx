import Link from 'next/link';

export default function AffiliatePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b border-slate-900 pb-4">
        <div>
          <span className="text-xs font-mono text-emerald-400">AROVAQ // PARTNERS</span>
          <h1 className="text-2xl font-bold">Affiliate Commission Hub</h1>
        </div>
        <Link href="/" className="text-xs bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-lg hover:border-emerald-500/50">← Back to Storefront</Link>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="font-semibold text-white">Your Referral Link</h3>
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400">
          https://arovaq.store/ref/cryptobaze
        </div>
        <p className="text-xs text-slate-400">Earn automated revenue splits instantly when buyers purchase through your link.</p>
      </div>
    </main>
  );
}