import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface PageProps {
  params: {
    handle: string;
  };
}

export default async function StorefrontPage({ params }: PageProps) {
  const { handle } = params;

  // Fetch products for this creator handle from Supabase
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('handle', handle.toLowerCase());

  if (error || !products || products.length === 0) {
    notFound();
  }

  const product = products[0]; // Display the primary creator product

  return (
    <main className="min-h-screen bg-[#0b0f19] text-slate-100 p-6 md:p-12 font-mono">
      <div className="max-w-xl mx-auto space-y-8">
        
        {/* STORE HEADER */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <span className="text-xs tracking-widest text-emerald-400 uppercase font-semibold">
            AROVAQ // STOREFRONT
          </span>
          <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
            @{product.handle}
          </span>
        </div>

        {/* PRODUCT CARD */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
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

            <h1 className="text-2xl md:text-3xl font-bold text-white leading-snug">
              {product.title}
            </h1>

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

        <div className="text-center text-xs text-slate-600">
          Powered by <span className="text-emerald-500 font-semibold">Arovaq</span> Digital Rails
        </div>

      </div>
    </main>
  );
}