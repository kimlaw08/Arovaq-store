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

  // Fetch all products to inspect database contents
  const { data: allProducts, error } = await supabase
    .from('products')
    .select('*');

  const products = allProducts?.filter(p => p.handle?.toLowerCase() === handle) || [];

  return (
    <main className="min-h-screen bg-[#0b0f19] text-slate-100 p-6 md:p-12 font-mono">
      <div className="max-w-xl mx-auto space-y-8">
        
        {/* CREATOR HEADER */}
        <div className="space-y-2 border-b border-slate-800 pb-6">
          <span className="text-[10px] tracking-widest text-emerald-400 uppercase font-semibold bg-emerald-950/60 border border-emerald-600/30 px-3 py-1 rounded-full">
            VERIFIED CREATOR SHELF
          </span>
          <h1 className="text-3xl font-bold text-white pt-2">
            {handle ? handle.charAt(0).toUpperCase() + handle.slice(1) : ''}
          </h1>
          <p className="text-xs text-slate-400">
            URL Handle: &quot;{handle}&quot; | Total rows in DB: {allProducts?.length || 0}
          </p>
        </div>

        {error && (
          <div className="bg-red-950/50 border border-red-500/50 text-red-400 text-xs p-4 rounded-xl">
            Database Error: {error.message}
          </div>
        )}

        {/* DIAGNOSTIC PANEL */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs space-y-2 text-slate-300">
          <p className="font-bold text-emerald-400">Database Diagnostic Inspector:</p>
          {allProducts && allProducts.length > 0 ? (
            allProducts.map((p, idx) => (
              <div key={idx} className="border-t border-slate-800 pt-2 space-y-1">
                <p>• Title: <span className="text-white font-bold">{p.title}</span></p>
                <p>• Stored Handle: <span className="text-yellow-400 font-bold">&quot;{p.handle}&quot;</span></p>
              </div>
            ))
          ) : (
            <p className="text-red-400 font-bold">The `products` table returned 0 rows! The publishing form did not successfully write to Supabase.</p>
          )}
        </div>

        {/* PRODUCTS LIST */}
        {products.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
            <p className="text-sm text-slate-400">No products matched handle &quot;{handle}&quot;.</p>
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