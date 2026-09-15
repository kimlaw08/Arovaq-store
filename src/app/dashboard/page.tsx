import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import CreatorUploadForm from "@/components/CreatorUploadForm";

// Force Next.js to always fetch fresh live data from Supabase (no static caching)
export const dynamic = "force-dynamic";
export const revalidate = 0;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function DashboardPage() {
  // Fetch live products from your Supabase database
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12 max-w-6xl mx-auto">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">Arovaq Creator Studio</span>
          <h1 className="text-3xl font-extrabold mt-1 tracking-tight">Publisher Dashboard</h1>
        </div>
        <Link 
          href="/" 
          className="text-xs font-mono bg-slate-900 border border-slate-800 hover:bg-slate-800 px-4 py-2.5 rounded-xl transition"
        >
          ← Back to Storefront
        </Link>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Secure Upload Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <CreatorUploadForm />
          </div>
        </div>

        {/* Right Column: Live Digital Library Shelf */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Your Digital Library Shelf 📚</h2>
            <span className="text-xs font-mono text-slate-400">
              {products ? `${products.length} Active Listing(s)` : "Loading..."}
            </span>
          </div>
          <p className="text-slate-400 text-xs">
            Live catalog items fetched directly from your Supabase database and storage buckets.
          </p>

          {error && (
            <div className="p-4 bg-red-950/50 border border-red-800 rounded-xl text-red-300 text-xs font-mono">
              Database error: {error.message}
            </div>
          )}

          <div className="space-y-4 pt-2">
            {products && products.length > 0 ? (
              products.map((product) => (
                <div 
                  key={product.id} 
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-4">
                    {product.cover_image_url ? (
                      <img 
                        src={product.cover_image_url} 
                        alt={product.title} 
                        className="w-16 h-16 object-cover rounded-xl border border-slate-800 flex-shrink-0" 
                      />
                    ) : (
                      <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 text-[10px] font-mono flex-shrink-0">
                        No Cover
                      </div>
                    )}

                    <div>
                      <h3 className="font-bold text-white text-sm">{product.title}</h3>
                      <p className="text-emerald-400 font-mono text-xs mt-0.5">${product.price_usdt} USDT</p>
                      <span className="text-[10px] font-mono text-slate-500 block mt-1">
                        Fingerprint: {product.content_hash ? `${product.content_hash.substring(0, 12)}...` : "Unhashed"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/products/${product.slug}`}
                      className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold py-2 px-4 rounded-xl transition whitespace-nowrap"
                    >
                      View Live
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs font-mono">
                Your shelf is currently empty. Use the upload form on the left to publish your first verified digital asset!
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}