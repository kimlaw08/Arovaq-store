'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CreatorUploadForm({ onProductPublished }: { onProductPublished?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ title: string; slug: string } | null>(null);
  
  // Post-publish review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [experience, setExperience] = useState<'smooth' | 'hiccups'>('smooth');
  const [duration, setDuration] = useState<'under_1m' | '1_2m' | 'over_2m'>('under_1m');
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const price = parseFloat(formData.get('price') as string);
    const creatorId = formData.get('creatorId') as string;
    const description = formData.get('description') as string;
    const affiliateShare = parseInt(formData.get('affiliateShare') as string, 10);

    try {
      const { error } = await supabase.from('products').insert([
        {
          title,
          slug,
          price,
          creator_id: creatorId,
          description,
          affiliate_share: affiliateShare,
        },
      ]);

      if (error) throw error;

      setSuccessData({ title, slug });
      onProductPublished?.(); // Safely calls the function if provided
      setShowReviewModal(true); // Trigger post-publish experience review modal
    } catch (err: any) {
      alert('Error publishing product: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 shadow-xl">
        <h2 className="text-xl font-semibold text-white">List Digital Product</h2>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Product Title</label>
          <input 
            name="title" 
            required 
            placeholder="e.g. Advanced Solana Smart Contract Guide" 
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Custom Link (Product Web Address)</label>
            <input 
              name="slug" 
              required 
              placeholder="solana-guide-vol1" 
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Price (USDT)</label>
            <input 
              name="price" 
              type="number" 
              step="0.01" 
              required 
              placeholder="15.00" 
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Creator ID / Handle</label>
          <input 
            name="creatorId" 
            required 
            placeholder="crypto-baze" 
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Affiliate Commission Split</label>
          <select 
            name="affiliateShare" 
            defaultValue="10"
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="2">2% - Micro Affiliate Tier</option>
            <option value="10">10% - Standard Partner</option>
            <option value="20">20% - Growth Partner</option>
            <option value="40">40% - Pro Promoter</option>
            <option value="50">50% - Equal Split Tier</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
          <textarea 
            name="description" 
            rows={3}
            placeholder="Describe what buyers will learn or receive..." 
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-500 font-semibold text-white py-3 rounded-lg transition-colors shadow-lg"
        >
          {loading ? 'Publishing Instantly...' : 'Publish Verified Product'}
        </button>
      </form>

      {/* Post-Publish Experience Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl text-white">
            {!reviewSubmitted ? (
              <>
                <div className="text-center space-y-2">
                  <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full font-medium">
                    🚀 Successfully Live on Storefront!
                  </span>
                  <h3 className="text-2xl font-bold">How was your publishing experience?</h3>
                  <p className="text-sm text-slate-400">
                    Your product <span className="text-white font-semibold">"{successData?.title}"</span> is now active on your shelf.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">1. How was the experience?</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setExperience('smooth')}
                      className={`py-2.5 px-4 rounded-lg font-medium border text-sm transition-all ${
                        experience === 'smooth' 
                          ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      ⚡ Smooth & Instant
                    </button>
                    <button
                      type="button"
                      onClick={() => setExperience('hiccups')}
                      className={`py-2.5 px-4 rounded-lg font-medium border text-sm transition-all ${
                        experience === 'hiccups' 
                          ? 'bg-amber-600 border-amber-500 text-white shadow-lg' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      ⚠️ Had Hiccups
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">2. Roughly how long did it take?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'under_1m', label: 'Under 1 min' },
                      { id: '1_2m', label: '1–2 mins' },
                      { id: 'over_2m', label: 'More than 2 mins' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setDuration(item.id as any)}
                        className={`py-2 px-3 rounded-lg font-medium border text-xs transition-all ${
                          duration === item.id 
                            ? 'bg-emerald-600 border-emerald-500 text-white' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">3. Drop a quick review or feedback note:</label>
                  <textarea
                    rows={2}
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Was it easy? Anything you'd change for everyday creators?"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setReviewSubmitted(true)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 font-semibold py-2.5 rounded-lg text-sm transition-colors"
                  >
                    Submit Review & Continue
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4 py-6">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h3 className="text-xl font-bold">Thank You for Your Feedback!</h3>
                <p className="text-sm text-slate-400">
                  Your review has been captured. Payout settings and Binance connections will be managed securely from your profile dashboard.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewSubmitted(false);
                  }}
                  className="w-full bg-slate-800 hover:bg-slate-700 font-semibold py-2.5 rounded-lg text-sm transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}