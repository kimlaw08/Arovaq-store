import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface PageProps {
  params: Promise<{ handle: string }>;
}

export default async function CreatorShelfPage({ params }: PageProps) {
  const { handle } = await params;

  // Fetch creator profile
  const { data: creator, error: creatorError } = await supabase
    .from('creators')
    .select('*')
    .eq('handle', handle)
    .single();

  if (creatorError || !creator) {
    notFound();
  }

  // Fetch creator's products
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('handle', handle)
    .order('id', { ascending: false });

  return (
    <main className="min-h-screen bg-[#0b0f19] text-slate-100 p-6 md:p-12 font-mono">
      <div className="max-w-2xl mx-auto space-y-8 pt-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-4">
          <Link href="/" className="hover:text-emerald-400 transition-colors">
            &larr; Back to Marketplace
          </Link>
          <span className="text-emerald-400 font-semibold uppercase tracking-wider">Verified Creator Shelf</span>
        </div>

        {/* Creator Header Profile */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4 shadow-xl text-center">
          {creator.avatar_url && (
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-emerald-500/40 bg-slate-950">
              <img src={creator.avatar_url} alt={creator.name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-white">{creator.name}</h1>
            <p className="text-xs text-emerald-400">@{creator.handle}</p>
          </div>
          {creator.bio && (
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">{creator.bio}</p>
          )}
        </div>

        {/* Products List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Digital Storefront</h2>
            <span className="text-xs text-slate-500">{products?.length || 0} Assets</span>
          </div>

          {!products || products.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-sm">
              No digital assets published on this shelf yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                  {product.cover_image && (
                    <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                      <img src={product.cover_image} alt={product.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-600/40 px-3 py-1 rounded-full">
                        Digital Asset
                      </span>
                      <span className="text-xl font-bold text-emerald-400">
                        {product.currency} {product.price?.toLocaleString()}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white">{product.title}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">{product.description}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <Link 
                      href={`/product/${product.id}`}
                      className="w-full block text-center bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-lg shadow-emerald-950/50"
                    >
                      Secure Checkout &bull; {product.currency} {product.price?.toLocaleString()}
                    </Link>
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