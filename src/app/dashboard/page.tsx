'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminDashboard() {
  const [title, setTitle] = useState('');
  const [deliveryType, setDeliveryType] = useState<'link' | 'upload'>('link');
  const [productUrl, setProductUrl] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('KES');
  const [handle, setHandle] = useState('crypto-baze');
  const [commission, setCommission] = useState('10% - Standard Partner');
  const [description, setDescription] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    setSuccessMsg('');

    try {
      const { error: insertError } = await supabase
        .from('products')
        .insert([
          {
            handle,
            title,
            description,
            price: parseFloat(price),
            currency,
            delivery_type: deliveryType,
            product_url: deliveryType === 'link' ? productUrl : null,
            commission_split: commission,
          }
        ]);

      if (insertError) throw insertError;
      
      setSuccessMsg('Product successfully published to your storefront!');
      setTitle('');
      setProductUrl('');
      setPrice('');
      setDescription('');
    } catch (err: any) {
      alert('Error publishing product: ' + err.message);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0f19] text-slate-100 p-6 md:p-12 font-mono">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="border-b border-slate-800 pb-6 flex justify-between items-center">
          <div>
            <p className="text-xs tracking-widest text-emerald-400 uppercase font-semibold">AROVAQ // v1.0</p>
            <h1 className="text-2xl font-bold text-white mt-1">Creator Publishing Hub</h1>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-300">Hub Active</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-semibold text-white mb-6">List Digital Product</h2>

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-800 text-emerald-400 rounded-lg text-sm">
              {successMsg}
            </div>
          )}

          <form onSubmit={handlePublish} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Product Title</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Advanced Solana Smart Contract Guide" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-sm focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs uppercase tracking-wider text-slate-400">Product Asset Delivery</label>
                <div className="flex gap-2 text-xs">
                  <button 
                    type="button" 
                    onClick={() => setDeliveryType('link')}
                    className={`px-3 py-1 rounded transition-colors ${deliveryType === 'link' ? 'bg-emerald-600 text-white font-semibold' : 'bg-slate-800 text-slate-400'}`}
                  >
                    Custom Link
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setDeliveryType('upload')}
                    className={`px-3 py-1 rounded transition-colors ${deliveryType === 'upload' ? 'bg-emerald-600 text-white font-semibold' : 'bg-slate-800 text-slate-400'}`}
                  >
                    Direct Upload
                  </button>
                </div>
              </div>

              {deliveryType === 'link' ? (
                <input 
                  type="text" 
                  required
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  placeholder="solana-guide-vol1 or full URL" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-sm focus:border-emerald-500 outline-none"
                />
              ) : (
                <input 
                  type="file" 
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-300 text-sm cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white"
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Base Currency</label>
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-sm focus:border-emerald-500 outline-none"
                >
                  <option value="KES">KES (Kenyan Shilling)</option>
                  <option value="NGN">NGN (Nigerian Naira)</option>
                  <option value="USD">USD (US Dollar)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Price Amount</label>
                <input 
                  type="number" 
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1500" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-sm focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Creator ID / Handle</label>
              <input 
                type="text" 
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-emerald-400 text-sm font-semibold outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Affiliate Commission Split</label>
              <select 
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-sm focus:border-emerald-500 outline-none"
              >
                <option value="10% - Standard Partner">10% - Standard Partner</option>
                <option value="20% - Pro Partner">20% - Pro Partner</option>
                <option value="30% - Elite Partner">30% - Elite Partner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Description</label>
              <textarea 
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what buyers will learn or receive..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-sm focus:border-emerald-500 outline-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={publishing}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-3.5 px-6 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {publishing ? 'Publishing Asset...' : 'Publish Verified Product'}
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}