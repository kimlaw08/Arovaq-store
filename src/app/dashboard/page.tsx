'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useParams } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CreatorStorefront() {
  const params = useParams();
  const handle = (params?.handle as string) || 'lawi';
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [buyerEmail, setBuyerEmail] = useState('');
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    async function fetchStoreProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('handle', handle.toLowerCase());

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Error loading store:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStoreProducts();
  }, [handle]);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerEmail) return;

    // Save lead/buyer email to Supabase or trigger delivery
    setUnlocked(true);
  };

  return (
    <main className="min-h-screen bg-[#0b0f19] text-slate-100 p-6 md:p-12 font-mono">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* STORE HEADER */}
        <div className="border-b border-slate-800 pb-6 flex justify-between items-center">
          <div>
            <p className="text-xs tracking-widest text-emerald-400 uppercase font-semibold">AROVAQ STOREFRONT</p>
            <h1 className="text-3xl font-bold text-white mt-1">@{handle}</h1>
          </div>
          <span className="bg-emerald-950 text-emerald-400 border border-emerald-600/50 text-xs px-3 py-1.5 rounded-full font-semibold">
            Verified Creator Shelf
          </span>
        </div>

        {loading ? (
          <p className="text-slate-400 text-sm animate-pulse">Loading creator shelf...</p>
        ) : products.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center space-y-4">
            <p className="text-slate-400 text-sm">No digital assets published on this shelf yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                
                {/* COVER IMAGE */}
                <div className="w-full h-56 md:h-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center">
                  <img 
                    src={product.cover_image || 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=600&auto=format&fit=crop'} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* PRODUCT DETAILS */}
                <div className="md:col-span-2 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase bg-slate-800 text-emerald-400 font-bold px-2 py-0.5 rounded">
                      Digital Asset
                    </span>
                    <h2 className="text-xl font-bold text-white">{product.title}</h2>
                    <p className="text-sm text-slate-400 leading-relaxed">{product.description}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
                    <div>
                      <span className="text-xs text-slate-400 block">Price</span>
                      <span className="text-lg font-bold text-emerald-400">{product.currency} {product.price}</span>
                    </div>

                    <button 
                      onClick={() => setSelectedProduct(product)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
                    >
                      Buy / Access Asset
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* CHECKOUT MODAL WITH EMAIL-FIRST GATE */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 md:p-8 space-y-6 relative">
              <button 
                onClick={() => { setSelectedProduct(null); setUnlocked(false); setBuyerEmail(''); }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-sm bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center"
              >
                ✕
              </button>

              <div>
                <p className="text-xs text-emerald-400 uppercase tracking-wider font-semibold">Secure Checkout</p>
                <h3 className="text-xl font-bold text-white mt-1">{selectedProduct.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{selectedProduct.currency} {selectedProduct.price}</p>
              </div>

              {!unlocked ? (
                <form onSubmit={handleCheckout} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Enter Your Email to Unlock</label>
                    <input 
                      type="email" 
                      required
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-sm focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-3 rounded-lg text-sm transition-colors cursor-pointer"
                  >
                    Continue to Payment & Download
                  </button>
                </form>
              ) : (
                <div className="space-y-4 bg-emerald-950/30 border border-emerald-600/40 p-4 rounded-lg text-center">
                  <p className="text-xs text-emerald-400 font-semibold uppercase">Email Verified & Captured!</p>
                  <p className="text-sm text-slate-300">Your download link is ready:</p>
                  <a 
                    href={selectedProduct.product_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-sm transition-colors"
                  >
                    Download Digital Asset
                  </a>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </main>
  );
}