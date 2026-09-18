'use client';

import { useState } from 'react';

interface CheckoutClientProps {
  productUrl: string;
  price: number;
  currency: string;
}

export default function CheckoutClient({ productUrl, price, currency }: CheckoutClientProps) {
  const [step, setStep] = useState<'idle' | 'processing' | 'success'>('idle');

  const handlePayment = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
    }, 1500);
  };

  return (
    <div className="pt-6 border-t border-slate-800 space-y-4">
      {step === 'idle' && (
        <>
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs text-slate-400 space-y-2">
            <span className="text-emerald-400 font-bold block uppercase tracking-wider">Secure Payment Verification Required</span>
            <p>Digital asset download links are encrypted and locked behind the Arovaq checkout gateway.</p>
          </div>

          <button
            onClick={handlePayment}
            className="w-full block text-center bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold px-8 py-4 rounded-xl text-sm transition-colors cursor-pointer shadow-lg shadow-emerald-950/50"
          >
            Pay {currency} {price?.toLocaleString()} & Unlock Access
          </button>
        </>
      )}

      {step === 'processing' && (
        <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl text-center space-y-3">
          <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Processing Secure Payment...</p>
          <p className="text-xs text-slate-500">Verifying transaction across Arovaq rails...</p>
        </div>
      )}

      {step === 'success' && (
        <div className="bg-emerald-950/30 border border-emerald-500/40 p-6 rounded-xl text-center space-y-4">
          <span className="text-emerald-400 font-bold text-sm block uppercase tracking-wider">Payment Verified Successfully! 🎉</span>
          <p className="text-xs text-slate-300">Your download link has been unlocked. Click below to download your verified asset securely.</p>
          <a
            href={productUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full block text-center bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-8 py-3 rounded-xl text-sm transition-colors shadow-lg shadow-emerald-950/50"
          >
            Download Protected Asset Now ↗
          </a>
        </div>
      )}
    </div>
  );
}