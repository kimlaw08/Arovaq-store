'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CreatorDashboard() {
  const [title, setTitle] = useState('Future Express: The Intelligent and Decentralized Age');
  const [description, setDescription] = useState('The future isn\'t coming. It\'s already here. From money and blockchain to AI, digital ownership, decentralization, and the rise of intelligent systems, Future Express takes you on a powerful journey into the world being built around us. Simple, thought-provoking, and rooted in an African perspective, this book is for anyone who doesn\'t want to merely watch the future arrive—but understand it, navigate it, and build it.');
  const [price, setPrice] = useState('1200');
  const [currency, setCurrency] = useState('KES');
  const [handle, setHandle] = useState('lawi');
  const [affiliateSplit, setAffiliateSplit] = useState('40% - Growth Partner');
  
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [assetFile, setAssetFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [publishedData, setPublishedData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setErrorMessage('');

    try {
      let coverImageUrl = '';
      let productUrl = '';

      // 1. Bulletproof Cover Upload (Generates safe timestamp filename)
      if (coverFile) {
        const fileExt = coverFile.name.split('.').pop() || 'jpg';
        const fileName = `cover_${Date.now()}.${fileExt}`;
        
        const { error: coverError } = await supabase.storage
          .from('products')
          .upload(fileName, coverFile);

        if (coverError) throw new Error('Cover upload failed: ' + coverError.message);

        const { data: publicUrlData } = supabase.storage
          .from('products')
          .getPublicUrl(fileName);
        
        coverImageUrl = publicUrlData.publicUrl;
      }

      // 2. Bulletproof Asset Upload (Generates safe timestamp filename)
      if (assetFile) {
        const fileExt = assetFile.name.split('.').pop() || 'pdf';
        const assetName = `asset_${Date.now()}.${fileExt}`;

        const { error: assetError } = await supabase.storage
          .from('products')
          .upload(assetName, assetFile);

        if (assetError) throw new Error('Asset upload failed: ' + assetError.message);

        const { data: assetUrlData } = supabase.storage
          .from('products')
          .getPublicUrl(assetName);
        
        productUrl = assetUrlData.publicUrl;
      }

      // 3. Insert into products table
      const { data: savedData, error: insertError } = await supabase
        .from('products')
        .insert([
          {
            handle: handle.toLowerCase(),
            title,
            description,
            price: parseFloat(price),
            currency,
            cover_image: coverImageUrl,
            product_url: productUrl,
            affiliate_split: affiliateSplit
          }
        ])
        .select();

      if (insertError) throw new Error('Error publishing product: ' + insertError.message);

      setPublishedData(savedData?.[0]);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Publishing failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b0f19] text-slate-100 p-6 md:p-12 font-mono">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="border-b border-slate-800 pb-6 flex justify-between items-center">
          <div>
            <p className="text-xs tracking-widest text-emerald-400 uppercase font-semibold">AROVAQ // V1.0</p>
            <h1 className="text-3xl font-bold text-white mt-1">Creator Publishing Hub</h1>
          </div>
          <span className="bg-emerald-950 text-emerald-400 border border-emerald-600/50 text-xs px-3 py-1.5 rounded-full font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Hub Active
          </span>
        </div>

        {publishedData ? (
          <div className="bg-slate-900/90 border border-emerald-500/40 rounded-xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-600/50 text-xs px-3 py-1 rounded font-bold uppercase">
                Published Successfully
              </span>
              <button 
                onClick={() => { setPublishedData(null); setCoverFile(null); setAssetFile(null); }}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-bold"
              >
                Create Another
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">{publishedData.title}</h2>
              <p className="text-sm text-slate-400">Custom Store Link:</p>
              <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-emerald-400 text-sm">https://arovaq.store/{publishedData.handle}</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(`https://arovaq.store/${publishedData.handle}`)}
                  className="ml-auto bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-4 py-1.5 rounded text-xs"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePublish} className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 md:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-4">List Digital Product</h2>

            {errorMessage && (
              <div className="bg-red-950/50 border border-red-500/50 text-red-400 text-xs p-3 rounded-lg">
                {errorMessage}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-slate-400">Creator Handle</label>
              <input 
                type="text" 
                required
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-sm focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-slate-400">Product Title</label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-sm focus:border-emerald-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-slate-400">Product Cover Image (Upload File)</label>
              <input 
                type="file" 
                accept="image/*"
                required
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-300 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-slate-950 hover:file:bg-emerald-500 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-slate-400">Product Asset File (PDF / eBook / ZIP)</label>
              <input 
                type="file" 
                required
                onChange={(e) => setAssetFile(e.target.files?.[0] || null)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-300 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-slate-950 hover:file:bg-emerald-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-slate-400">Base Currency</label>
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-sm focus:border-emerald-500 outline-none"
                >
                  <option value="KES">KES (Kenyan Shilling)</option>
                  <option value="USD">USD (US Dollar)</option>
                  <option value="NGN">NGN (Nigerian Naira)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-slate-400">Price</label>
                <input 
                  type="number" 
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-sm focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-slate-400">Affiliate Commission Split</label>
              <select 
                value={affiliateSplit}
                onChange={(e) => setAffiliateSplit(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-sm focus:border-emerald-500 outline-none"
              >
                <option value="40% - Growth Partner">40% - Growth Partner</option>
                <option value="25% - Standard Partner">25% - Standard Partner</option>
                <option value="50% - Elite Partner">50% - Elite Partner</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs uppercase tracking-wider text-slate-400">Description</label>
              <textarea 
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-sm focus:border-emerald-500 outline-none"
              />
            </div>

            <button 
              type="submit"
              disabled={uploading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold py-3.5 rounded-lg text-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {uploading ? 'Publishing Asset & Uploading Files...' : 'Publish Verified Product'}
            </button>
          </form>
        )}

      </div>
    </main>
  );
}