'use client';

import { useState } from 'react';

interface CheckoutClientProps {
  productId: string;
  price: number;
  currency: string;
}

export default function CheckoutClient({ productId, price, currency }: CheckoutClientProps) {
  const [step, setStep] = useState<'idle' | 'processing' | 'success'>('idle');

  const handlePreOrder = async () => {
    setStep('processing');
    const buyerRef = 'user_' + Math.random().toString(36).substring(7);

    try {
      const resRecord = await fetch('/api/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, buyerRef }),
      });

      if (!resRecord.ok) {
        alert('Pre-order registration failed.');
        setStep('idle');
        return;
      }

      setTimeout(() => {
        setStep('success');
      }, 1500);

    } catch (err) {
      console.error(err);
      setStep('idle');
    }
  };

  return (
    <div className="pt-6 border-t border-slate-800 space-y-4">
      {step === 'idle' && (
        <>
          <div className="bg-amber-950/40 border border-amber-500/40 p-4 rounded-xl text-xs text-amber-300 space-y-2">
            <span className="font-bold block uppercase tracking-wider">🔒 Genesis Pre-Launch Access</span>
            <p>This digital asset is currently in pre-launch mode. Secure your early-bird copy to get automated instant delivery the moment public rails unlock.</p>
          </div>

          <button
            onClick={handlePreOrder}
            className="w-full block text-center bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-4 rounded-xl text-sm transition-colors cursor-pointer shadow-lg shadow-amber-950/50"
          >
            Reserve Pre-Launch Copy &bull; {currency} {price?.toLocaleString()}
          </button>
        </>
      )}

      {step === 'processing' && (
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl text-center space-y-3">
          <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">Securing Pre-Launch Slot...</p>
          <p className="text-xs text-slate-500">Registering your reservation on Arovaq rails...</p>
        </div>
      )}

      {step === 'success' && (
        <div className="bg-emerald-950/30 border border-emerald-500/40 p-6 rounded-xl text-center space-y-4">
          <span className="text-emerald-400 font-bold text-sm block uppercase tracking-wider">Pre-Launch Reservation Confirmed! 🎉</span>
          <p className="text-xs text-slate-300">You are locked in as a Genesis Pioneer. Your encrypted download link will be emailed and unlocked on release day.</p>
        </div>
      )}
    </div>
  );
}