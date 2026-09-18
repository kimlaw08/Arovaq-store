import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

// Initialize Supabase client using environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CreatorPage({ params }: PageProps) {
  const resolvedParams = await params;
  const handle = resolvedParams.slug;

  // 1. Fetch profile data based on the URL handle
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('handle', handle)
    .single();

  if (profileError || !profile) {
    notFound();
  }

  // 2. Fetch products associated with this creator's ID
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('creator_id', profile.id);

  return (
    <main className="min-h-screen bg-[#0b0f19] text-white px-6 py-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Creator Header */}
        <div className="mb-10 border-b border-gray-800 pb-6">
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">
            Verified Creator Shelf
          </span>
          <h1 className="text-3xl font-bold mt-2">{profile.full_name}</h1>
          <p className="text-gray-400 mt-1">@{profile.handle} — Explore verified digital assets and Web3 tools.</p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products && products.length > 0 ? (
            products.map((product) => (
              <div 
                key={product.id} 
                className="bg-[#131b2e] border border-gray-800 rounded-xl p-6 flex flex-col justify-between hover:border-emerald-500/50 transition-all"
              >
                <div>
                  <span className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-md font-medium">
                    Digital Asset
                  </span>
                  <h2 className="text-xl font-semibold mt-3">{product.title}</h2>
                  <p className="text-gray-400 text-sm mt-2 line-clamp-3">{product.description}</p>
                </div>
                
                <div className="mt-6 flex items-center justify-between border-t border-gray-800/60 pt-4">
                  <span className="text-lg font-bold text-emerald-400">
                    ${Number(product.price_usdt).toFixed(2)} USDT
                  </span>
                  <a 
                    href={`/checkout/${product.slug}`}
                    className="px-4 py-2 bg-emerald-500 text-slate-950 font-semibold rounded-lg hover:bg-emerald-400 transition-colors text-sm"
                  >
                    View & Buy ⚡
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 col-span-2">No digital assets listed on this shelf yet.</p>
          )}
        </div>

      </div>
    </main>
  );
}