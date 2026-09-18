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
  const [productFile, setProductFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('KES');
  const [handle, setHandle] = useState('lawi');
  const [commission, setCommission] = useState('10% - Standard Partner');
  const [description, setDescription] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [createdProduct, setCreatedProduct] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    setCreatedProduct(null);

    try {
      let finalProductUrl = productUrl;
      let finalCoverUrl = 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=600&auto=format&fit=crop';

      // 1. Upload Product File if Direct Upload is selected
      if (deliveryType === 'upload' && productFile) {
        const fileExt = productFile.name.split('.').pop();
        const fileName = `product-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(fileName, productFile);

        if (uploadError) throw new Error('Product upload failed: ' + uploadError.message);
        
        const { data: pubData } = supabase.storage.from('products').getPublicUrl(fileName);
        finalProductUrl = pubData.publicUrl;
      }

      // 2. Upload Cover Image File if provided
      if (coverFile) {
        const fileExt = coverFile.name.split('.').pop();
        const fileName = `cover-${Date.now()}.${fileExt}`;
        const { error: coverError } = await supabase.storage
          .from('products')
          .upload(fileName, coverFile);

        if (coverError) throw new Error('Cover image upload failed: ' + coverError.message);

        const { data: coverPubData } = supabase.storage.from('products').getPublicUrl(fileName);
        finalCoverUrl = coverPubData.publicUrl;
      }

      // 3. Insert into Products table
      const { data, error: insertError } = await supabase
        .from('products')
        .insert([
          {
            handle: handle.trim().toLowerCase(),
            title,
            description,
            price: parseFloat(price),
            currency,
            delivery_type: deliveryType,
            product_url: finalProductUrl,
            cover_image: finalCoverUrl,
            commission_split: commission,
          }
        ])
        .select()
        .single();

      if (insertError) throw insertError;
      
      setCreatedProduct(data);
      setTitle('');
      setProductUrl('');
      setProductFile(null);
      setCoverFile(null);
      setPrice('');
      setDescription('');
    } catch (err: any) {
      alert('Error publishing product: ' + err.message);
    } finally {
      setPublishing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const storeLink = createdProduct ? `https://arovaq.store/${createdProduct.handle}` : '';

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

        {/* SUCCESS MODAL / SHARE CARD */}
        {createdProduct && (
          <div className="bg-emerald-950/40 border border-emerald-600/60 rounded-xl p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs uppercase bg-emerald-600 text-slate-950 font-bold px-2 py-1 rounded">
                  Published Successfully
                </span>
                <h2 className="text-xl font-bold text-white mt-2">{createdProduct.title}</h2>
              </div>
              <button 
                onClick={() => setCreatedProduct(null)}
                className="text-slate-400 hover:text-white text-sm bg-slate-900 px-3 py-1 rounded border border-slate-800"
              >
                Create Another
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-950/80 p-6 rounded-lg border border-slate-800">
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 uppercase block mb-1">Custom Store Link</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      readOnly
                      value={storeLink}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2.5 text-emerald-400 text-xs outline-none"
                    />
                    <button 
                      onClick={() => copyToClipboard(storeLink)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-4 rounded text-xs transition-colors"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <p>• Price: <span className="text-white font-semibold">{createdProduct.currency} {createdProduct.price}</span></p>
                  <p>• Affiliate Split: <span className="text-white font-semibold">{createdProduct.commission_split}</span></p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center bg-white p-4 rounded-lg w-fit mx-auto">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${storeLink}`} 
                  alt="Product QR Code"
                  className="w-36 h-36"
                />
                <span className="text-[10px] text-slate-900 font-bold mt-2 uppercase tracking-wider">Scan to Buy</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 md:p-8">
          <h2 className="text-xl font-semibold text-white mb-6">List Digital Product</h2>

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

            {/* COVER IMAGE UPLOAD */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Product Cover Image (Upload File)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-300 text-sm cursor-pointer file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-emerald-600 file:text-white"
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
                  onChange={(e) => setProductFile(e.target.files?.[0] || null)}
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
                <option value="2% - Starter Partner">2% - Starter Partner</option>
                <option value="10% - Standard Partner">10% - Standard Partner</option>
                <option value="25% - Pro Partner">25% - Pro Partner</option>
                <option value="40% - Growth Partner">40% - Growth Partner</option>
                <option value="50% - Master Partner">50% - Master Partner</option>
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
              {publishing ? 'Publishing Asset & Uploading Files...' : 'Publish Verified Product'}
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}