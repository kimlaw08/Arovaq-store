'use client';

import { useState } from 'react';
import CreatorUploadForm from './CreatorUploadForm';

export default function ToggleUploadButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto my-6">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white font-medium py-4 px-6 rounded-xl shadow-lg flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg group-hover:bg-emerald-500/20 transition-colors">
              +
            </span>
            <div className="text-left">
              <p className="text-sm font-semibold">List New Digital Product</p>
              <p className="text-xs text-slate-400">Masterclasses, Courses, eBooks & Templates</p>
            </div>
          </div>
          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 group-hover:border-emerald-500/50 transition-colors">
            Expand Form ⚡
          </span>
        </button>
      ) : (
        <div className="relative animate-in fade-in zoom-in-95 duration-200">
          <div className="flex justify-between items-center mb-3 px-1">
            <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
              // Creator Publishing Hub Active
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg transition-colors"
            >
              ✕ Collapse View
            </button>
          </div>
          
          <CreatorUploadForm onProductPublished={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
}