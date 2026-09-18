import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface PageProps {
  params: Promise<{
    handle: string;
  }>;
}

export default async function CreatorShelfPage({ params }: PageProps) {
  const resolvedParams = await params;
  const handle = resolvedParams.handle?.toLowerCase() || '';

  // Fetch products for this handle
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .ilike('handle', handle);

  const formattedHandle = handle ? handle.charAt(0).toUpperCase() + handle.slice(1) : '';

  // Determine active badges based on profile or high-tier affiliate status (e.g., 40%-50% split tiers)
  // These can later be driven dynamically by a creator/profile table in Supabase.
  const badges = [
    { label: 'GENESIS PIONEER', color: 'text-amber-400 bg-amber-950/60 border-amber-500/40 shadow-amber-950/40', pulse: true },
    { label: 'ELITE AFFILIATE (50% TIER)', color: 'text-purple-400 bg-purple-950/60 border-purple-500/40 shadow-purple-950/40', pulse: false },
    { label: 'VERIFIED CREATOR', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-600/30 shadow-none', pulse: false },
  ];

  return (
    <main className="min-h-screen bg-[#0b0f19] text-slate-100 p-6 md:p-12 font-mono">
      <div className="max-w-xl mx-auto space-y-8">
        
        {/* CREATOR HEADER WITH MULTI-TIER BADGES */}
        <div className="space-y-3 border-b border-slate-800 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            {badges.map((badge, idx) => (
              <span 
                key={idx} 
                className={`text-[10px] tracking-widest uppercase font-semibold border px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg ${badge.color}`}
              >
                {badge.pulse && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>}
                {badge.label}
              </span>
            ))}
          </div>

          <h1 className="text-3xl font-bold text-white pt-1">
            {formattedHandle}
          </h1>

          <p className="text-xs text-slate-400">
            @{handle} — Genesis partner, high-tier affiliate, and verified Web3 publisher on Arovaq.
          </p>
        </div>

        {/* PRODUCTS LIST */}
        {error || !products || products.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
            <p className="text-sm text-slate-400">No digital assets listed on this shelf yet.</p>
            <p className="text-xs text-slate-600">Publish your first asset via the Creator Publishing Hub.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {products.map((product) => (
              <div key={product.id || product.title} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
                {product.cover_image && (
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                    <img 
                      src={product.cover_image} 
                      alt={product.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-600/40 px-3 py-1 rounded-full">
                      Digital Asset
                    </span>
                    <span className="text-xl font-bold text-emerald-400">
                      {product.currency} {product.price?.toLocaleString()}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-white leading-snug">
                    {product.title}
                  </h2>

                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line pt-2 border-t border-slate-800">
                    {product.description}
                  </p>
                </div>

                {/* CHECKOUT SECTION */}
                <div className="pt-4 border-t border-slate-800 space-y-4">
                  <a 
                    href={product.product_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-4 rounded-xl text-sm transition-colors cursor-pointer shadow-lg shadow-emerald-950/50"
                  >
                    Buy Now & Download
                  </a>
                  <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest">
                    Instant secure delivery powered by Arovaq
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center text-xs text-slate-600 pt-6">
          Powered by <span className="text-emerald-500 font-semibold">Arovaq</span> Digital Rails
        </div>

      </div>
    </main>
  );
}