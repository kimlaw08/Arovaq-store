import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CheckoutClient from './CheckoutClient';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductCheckoutPage({ params }: PageProps) {
  const { id } = await params;

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
        
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-4">
          <Link href="/" className="hover:text-amber-400 transition-colors">
            &larr; Back to Marketplace
          </Link>
          <span className="text-amber-400 font-semibold uppercase tracking-wider">Genesis Pre-Launch Gate</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
          {product.cover_image && (
            <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
              <img src={product.cover_image} alt={product.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider bg-amber-950 text-amber-400 border border-amber-500/40 px-3 py-1 rounded-full">
                Pre-Launch Asset
              </span>
              <span className="text-2xl font-bold text-amber-400">
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

          <CheckoutClient 
            productId={product.id}
            price={product.price} 
            currency={product.currency} 
          />
        </div>

        <div className="text-center text-xs text-slate-600 pt-4">
          Secured by <span className="text-emerald-500 font-semibold">Arovaq</span> Creator Rails
        </div>

      </div>
    </main>
  );
}