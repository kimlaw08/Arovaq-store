'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Profile {
  id: string;
  handle: string;
  full_name: string;
  email: string;
}

export default function AdminDashboard() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New Product Form State
  const [title, setTitle] = useState('');
  const [deliveryType, setDeliveryType] = useState<'link' | 'upload'>('link');
  const [productUrl, setProductUrl] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('KES');
  const [handle, setHandle] = useState('lawi');
  const [commission, setCommission] = useState('40%');
  const [description, setDescription] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('id, handle, full_name, email')
          .order('handle', { ascending: true });

        if (error) throw error;
        setProfiles(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch database records.');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    setSuccessMsg('');

    try {
      const { error: insertError } = await supabase
        .from('products')
        .insert([
          {
            handle: handle,
            title: title,
            description: description,
            price: parseFloat(price),
            currency: currency,
            delivery_type: deliveryType,
            product_url: deliveryType === 'link' ? productUrl : null,
            commission_split: commission,
          }
        ]);

      if (insertError) throw insertError;
      
      setSuccessMsg('Product successfully published to your store front!');
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
        
        {/* Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-xs tracking-widest text-emerald-400 uppercase font-semibold">Arovaq // Control Panel</p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-1">Creator Publishing Hub</h1>
          </div>
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-300">Hub Active</span>
          </div>
        </div>

        {/* List Product Form Section */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 md:p-8 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-white mb-6">List Digital Product</h2>

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-800 text-emerald-400 rounded-lg text-sm">
              {successMsg}
            </div>
          )}

          <form onSubmit={handlePublish} className="space-y-6">
            
            {/* Product Title */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Product Title</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Future Express Masterclass" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Front Page Cover Image Upload */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Front Page Cover Image (Poster / Artwork)</label>
              <input 
                type="file" 
                accept="image/*"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-300 text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500 mt-1">Recommended: Square or 16:9 high-res graphic for your store front display.</p>
            </div>

            {/* Delivery Method Selector: Link vs File Upload */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs uppercase tracking-wider text-slate-400">Product Asset Delivery</label>
                <div className="flex gap-2 text-xs">
                  <button 
                    type="button" 
                    onClick={() => setDeliveryType('link')}
                    className={`px-3 py-1 rounded transition-colors ${deliveryType === 'link' ? 'bg-emerald-600 text-white font-semibold' : 'bg-slate-800 text-slate-400'}`}
                  >
                    Paste Link
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setDeliveryType('upload')}
                    className={`px-3 py-1 rounded transition-colors ${deliveryType === 'upload' ? 'bg-emerald-600 text-white font-semibold' : 'bg-slate-800 text-slate-400'}`}
                  >
                    Upload File
                  </button>
                </div>
              </div>

              {deliveryType === 'link' ? (
                <input 
                  type="url" 
                  required
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or external download link" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              ) : (
                <input 
                  type="file" 
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-300 text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-slate-800 file:text-white hover:file:bg-slate-700 cursor-pointer"
                />
              )}
            </div>

            {/* Currency and Price Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Base Currency</label>
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="KES">KES - Kenya Shillings</option>
                  <option value="USD">USD - US Dollars</option>
                  <option value="NGN">NGN - Nigerian Naira</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Price Amount</label>
                <input 
                  type="number" 
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="1500" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            {/* Creator Handle */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Creator Handle</label>
              <input 
                type="text" 
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-emerald-400 text-sm font-semibold focus:outline-none"
              />
            </div>

            {/* Commission Split */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Affiliate Commission Split</label>
              <select 
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="40%">40% - Pro Promoter</option>
                <option value="30%">30% - Standard Split</option>
                <option value="20%">20% - Base Tier</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Description</label>
              <textarea 
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your digital asset, what buyers will learn, and how to get started..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              ></textarea>
            </div>

            {/* Submit Button */}
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