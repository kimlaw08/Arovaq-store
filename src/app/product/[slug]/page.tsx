'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useParams } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Product {
  title: string;
  description: string;
  price: number;
  creator_id: string;
  slug: string;
}

export default function StorefrontProductPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) {
        setLoading(false); // Stop loading immediately if no slug is in the URL
        return;
      }
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        if (data) setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400 text-sm animate-pulse">Loading secure storefront...</p>
      </div>
    );
  }

  // Fallback defaults if no product row matches or viewing root
  const title = product?.title || 'Local Rail Digital Access';
  const description = product?.description || 'Instant decentralized access to premium creator tools and masterclass guides.';
  const price = product?.price ? Number(product.price).toFixed(2) : '15.00';

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
        
        {/* Header Branding */}
        <div className="space-y-1">
          <span className="text-xs text-emerald-400 font-semibold tracking-wider uppercase">
            AROVAQ // STOREFRONT
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed">
          {description}
        </p>

        {/* Action Card / Checkout Box */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Secure Settlement</span>
            <span className="text-emerald-400 font-medium">USDT Rail</span>
          </div>

          <button 
            onClick={() => alert('Direct crypto settlement processing...')}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>Pay Crypto Direct</span>
            <span className="bg-emerald-700/60 px-2 py-0.5 rounded text-xs">
              ${price} USDT
            </span>
          </button>
        </div>

        <p className="text-center text-xs text-slate-500">
          Powered by ArovaQ Smart Routing Architecture
        </p>
      </div>
    </main>
  );
}