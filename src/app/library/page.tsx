import Link from 'next/link';

export default function LibraryPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b border-slate-900 pb-4">
        <div>
          <span className="text-xs font-mono text-emerald-400">AROVAQ // SECURE VAULT</span>
          <h1 className="text-2xl font-bold">Buyer Digital Library</h1>
        </div>
        <Link href="/" className="text-xs bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-lg hover:border-emerald-500/50">← Back to Storefront</Link>
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-3">
        <p className="text-slate-400 text-sm">No purchases found on this local session yet.</p>
        <p className="text-xs text-slate-500">Assets purchased via direct crypto settlement will appear here instantly.</p>
      </div>
    </main>
  );
}