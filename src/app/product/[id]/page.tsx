import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function MarketplaceHomePage() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: false });

  return (
    <main className="min-h-screen bg-[#0b0f19] text-slate-100 p-6 md:p-12 font-mono">
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* HERO SECTION */}
        <div className="space-y-6 text-center pt-8 pb-6 border-b border-slate-800">
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-[10px] tracking-widest text-amber-400 uppercase font-semibold bg-amber-950/60 border border-amber-500/40 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              GENESIS PRE-LAUNCH LIVE
            </span>
            <span className="text-[10px] tracking-widest text-emerald-400 uppercase font-semibold bg-emerald-950/60 border border-emerald-600/30 px-3 py-1 rounded-full">
              AROVAQ DIGITAL RAILS
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            The Web3 Creator & <span className="text-emerald-400">Digital Storefront</span>
          </h1>

          <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Discover verified e-books, Web3 tools, and digital assets published by pioneer creators. Instant secure delivery powered by Arovaq.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link 
              href="/lawi" 
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-lg shadow-emerald-950/50"
            >
              Explore Creator Shelf
            </Link>
            <a 
              href="#marketplace" 
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold px-6 py-3 rounded-xl text-sm transition-colors"
            >
              Browse All Assets
            </a>
          </div>
        </div>

        {/* BADGE SYSTEM HIGHLIGHT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
            <span className="text-amber-400 font-bold uppercase tracking-wider block">Genesis Pioneer</span>
            <p className="text-slate-400">Exclusive badge and recognition for early members joining during pre-launch.</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
            <span className="text-purple-400 font-bold uppercase tracking-wider block">Elite Affiliate</span>
            <p className="text-slate-400">High-tier promotional splits (40%-50%) for top scaling partners.</p>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
            <span className="text-emerald-400 font-bold uppercase tracking-wider block">Verified Creator</span>
            <p className="text-slate-400">Trusted publishers providing authentic assets and instant downloads.</p>
          </div>
        </div>

        {/* MARKETPLACE FEED */}
        <div id="marketplace" className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white tracking-wider uppercase">Live Marketplace Feed</h2>
            <span className="text-xs text-slate-500">{products?.length || 0} Assets Available</span>
          </div>

          {error || !products || products.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <p className="text-sm text-slate-400">No public assets live in the marketplace feed yet.</p>
              <p className="text-xs text-slate-600">Assets published via your publishing hub will appear here automatically.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                  {product.cover_image && (
                    <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                      <img 
                        src={product.cover_image} 
                        alt={product.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-600/40 px-3 py-1 rounded-full">
                          Digital Asset
                        </span>
                        {product.handle && (
                          <Link 
                            href={`/${product.handle}`}
                            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors bg-slate-950 border border-slate-800 px-3 py-1 rounded-full"
                          >
                            @{product.handle} shelf ↗
                          </Link>
                        )}
                      </div>
                      <span className="text-xl font-bold text-emerald-400">
                        {product.currency} {product.price?.toLocaleString()}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white leading-snug">
                      {product.title}
                    </h3>

                    <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <Link 
                      href={`/product/${product.id}`}
                      className="w-full md:w-auto text-center bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-8 py-3 rounded-xl text-sm transition-colors cursor-pointer shadow-lg shadow-emerald-950/50"
                    >
                      Secure Checkout &bull; {product.currency} {product.price?.toLocaleString()}
                    </Link>
                    {product.handle && (
                      <Link 
                        href={`/${product.handle}`}
                        className="text-xs text-slate-400 hover:text-white transition-colors"
                      >
                        View Creator Shelf →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}