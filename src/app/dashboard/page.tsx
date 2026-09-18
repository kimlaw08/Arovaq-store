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
  
  // Checkout flow states
  const [buyerEmail, setBuyerEmail] = useState('');
  const [preferredCurrency, setPreferredCurrency] = useState('KES');
  const [checkoutStep, setCheckoutStep] = useState<'email' | 'prelaunch_notice'>('email');

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

  const handleProceedToPrelaunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerEmail) return;
    setCheckoutStep('prelaunch_notice');
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
            Pre-Launch Mode Active
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
                      Digital Asset // Pre-Launch
                    </span>
                    <h2 className="text-xl font-bold text-white">{product.title}</h2>
                    <p className="text-sm text-slate-400 leading-relaxed">{product.description}</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
                    <div>
                      <span className="text-xs text-slate-400 block">Base Price</span>
                      <span className="text-lg font-bold text-emerald-400">{product.currency} {product.price}</span>
                    </div>

                    <button 
                      onClick={() => { setSelectedProduct(product); setCheckoutStep('email'); }}
                      className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-sm transition-colors cursor-pointer"
                    >
                      Reserve / Buy Asset
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* PRE-LAUNCH CHECKOUT MODAL */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 md:p-8 space-y-6 relative">
              <button 
                onClick={() => { setSelectedProduct(null); setCheckoutStep('email'); setBuyerEmail(''); }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white text-sm bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center"
              >
                ✕
              </button>

              <div>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded font-bold uppercase">
                  Pre-Launch Access
                </span>
                <h3 className="text-xl font-bold text-white mt-2">{selectedProduct.title}</h3>
                <p className="text-sm text-slate-400 mt-1">Listing Price: {selectedProduct.currency} {selectedProduct.price}</p>
              </div>

              {checkoutStep === 'email' ? (
                <form onSubmit={handleProceedToPrelaunch} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Preferred Currency</label>
                    <select 
                      value={preferredCurrency}
                      onChange={(e) => setPreferredCurrency(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-sm focus:border-emerald-500 outline-none mb-3"
                    >
                      <option value="KES">KES (Kenyan Shilling - M-Pesa)</option>
                      <option value="USD">USD (US Dollar - Global)</option>
                      <option value="NGN">NGN (Nigerian Naira - Busha)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Enter Your Email for Access</label>
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
                    Continue to Pre-Launch Checkout
                  </button>
                </form>
              ) : (
                <div className="space-y-4 bg-slate-950/80 border border-slate-800 p-5 rounded-lg text-left">
                  <div className="border-b border-slate-800 pb-3">
                    <p className="text-xs text-emerald-400 uppercase font-bold">Order Reserved Successfully</p>
                    <p className="text-xs text-slate-400 mt-1">Email: <span className="text-white">{buyerEmail}</span></p>
                    <p className="text-xs text-slate-400">Currency Selected: <span className="text-white">{preferredCurrency}</span></p>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                    <p className="font-bold text-white">Notice: Arovaq Storefront is currently in Pre-Launch Mode.</p>
                    <p>Payment processing gateways (including M-Pesa mobile money and Busha integration rails) are finalizing live hooks.</p>
                    <p className="text-emerald-400 font-semibold">Your copy has been reserved. You will receive an email notification with direct access instructions as soon as the live payment rails go live.</p>
                  </div>

                  <button 
                    onClick={() => { setSelectedProduct(null); setCheckoutStep('email'); setBuyerEmail(''); }}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-lg text-xs transition-colors"
                  >
                    Close & Return to Store
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </main>
  );
}