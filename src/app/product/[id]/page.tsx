import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductCheckoutPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch the specific product from Supabase
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0b0f19] text-slate-100 p-6 md:p-12 font-mono">
      <div className="max-w-xl mx-auto space-y-8 pt-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-4">
          <Link href="/" className="hover:text-emerald-400 transition-colors">
            &larr; Back to Marketplace
          </Link>
          <span className="text-emerald-400 font-semibold uppercase tracking-wider">Secure Checkout</span>
        </div>

        {/* Product Card */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
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
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-600/40 px-3 py-1 rounded-full">
                Verified Digital Asset
              </span>
              <span className="text-2xl font-bold text-emerald-400">
                {product.currency} {product.price?.toLocaleString()}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white leading-snug">
              {product.title}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Secure Checkout Action */}
          <div className="pt-6 border-t border-slate-800 space-y-4">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs text-slate-400 space-y-2">
              <span className="text-emerald-400 font-bold block uppercase tracking-wider">Instant Secure Delivery</span>
              <p>After completing payment through Arovaq rails, your encrypted download link will be instantly unlocked.</p>
            </div>

            <a 
              href={product.product_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full block text-center bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-8 py-4 rounded-xl text-sm transition-colors cursor-pointer shadow-lg shadow-emerald-950/50"
            >
              Pay {product.currency} {product.price?.toLocaleString()} & Unlock Access
            </a>
          </div>
        </div>

        <div className="text-center text-xs text-slate-600 pt-4">
          Secured by <span className="text-emerald-500 font-semibold">Arovaq</span> Creator Rails
        </div>

      </div>
    </main>
  );
}