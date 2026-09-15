'use client';

import { useState } from 'react';
import Link from 'next/link';
import ToggleUploadButton from '@/components/ToggleUploadButton';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'all' | 'masterclasses' | 'courses' | 'ebooks' | 'templates'>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500 selection:text-black">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
            AROVAQ // v1.0
          </span>
          <h1 className="text-sm font-semibold tracking-tight text-white hidden sm:block">
            Decentralized Creator Marketplace
          </h1>
        </div>

        {/* Quick Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-300 font-medium">
          <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">Creator Dashboard</Link>
          <Link href="/library" className="hover:text-emerald-400 transition-colors">Buyer Library</Link>
          <Link href="/leaderboard" className="hover:text-emerald-400 transition-colors">Leaderboard</Link>
          <Link href="/affiliate" className="hover:text-emerald-400 transition-colors">Affiliates</Link>
        </nav>

        {/* Mobile Menu Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden bg-slate-900 border border-slate-800 text-slate-300 px-3 py-2 rounded-lg text-xs font-medium hover:text-white"
        >
          {mobileMenuOpen ? '✕ Close' : '☰ Menu'}
        </button>
      </header>

      {/* Mobile Slide-out Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-6 py-4 space-y-3 animate-in slide-in-from-top duration-200">
          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-200 hover:text-emerald-400 py-1">Creator Dashboard</Link>
          <Link href="/library" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-200 hover:text-emerald-400 py-1">Buyer Library</Link>
          <Link href="/leaderboard" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-200 hover:text-emerald-400 py-1">Community Leaderboard</Link>
          <Link href="/affiliate" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-200 hover:text-emerald-400 py-1">Affiliate Hub</Link>
          <Link href="/coming-soon" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-400 hover:text-emerald-400 py-1">Smart Revenue Splits (Phase 2)</Link>
        </div>
      )}

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 py-12 sm:py-16 text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-1.5 rounded-full text-xs text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Frictionless Digital Commerce & Instant Smart Payouts
        </div>
        
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
          Publish, Sell & Scale Your <span className="text-emerald-400">Digital Assets</span> Instantly.
        </h2>
        
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Built for modern creators. List masterclasses, courses, eBooks, and templates with zero friction and automated revenue routing.
        </p>

        {/* Compact Toggle Upload Hub */}
        <div className="pt-4 max-w-xl mx-auto">
          <ToggleUploadButton />
        </div>
      </section>

      {/* Categories & Explore Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 border-t border-slate-900 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">Explore Creator Shelf</h3>
            <p className="text-xs sm:text-sm text-slate-400">Browse verified digital assets across all categories.</p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Assets' },
              { id: 'masterclasses', label: 'Masterclasses' },
              { id: 'courses', label: 'Courses' },
              { id: 'ebooks', label: 'eBooks' },
              { id: 'templates', label: 'Templates' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`text-xs px-3.5 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Solana Smart Contract Masterclass', category: 'Masterclasses', price: '45.00', creator: 'Crypto Baze', slug: 'solana-masterclass' },
            { title: 'The Digital Rail System eBook', category: 'eBooks', price: '15.00', creator: 'Crypto Baze', slug: 'digital-rail-ebook' },
            { title: 'n8n Automated Workflow Template', category: 'Templates', price: '25.00', creator: 'ArovaQ Lab', slug: 'n8n-workflow-template' },
          ]
            .filter((item) => activeTab === 'all' || item.category.toLowerCase().includes(activeTab))
            .map((item, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400">by {item.creator}</span>
                  </div>
                  <h4 className="font-semibold text-white text-base">{item.title}</h4>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
                  <span className="text-emerald-400 font-bold text-sm">${item.price} USDT</span>
                  <Link 
                    href={`/product/${item.slug}`}
                    className="text-xs bg-slate-800 hover:bg-emerald-600 text-white px-3.5 py-2 rounded-lg transition-colors font-medium"
                  >
                    View & Buy ⚡
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Feature Navigation Footer Cards */}
      <section className="max-w-6xl mx-auto px-4 py-12 border-t border-slate-900 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">🏆</div>
          <h4 className="font-semibold text-white">Community Leaderboard</h4>
          <p className="text-xs text-slate-400 leading-relaxed">Track top-performing creators, masterclasses, and community affiliates.</p>
          <Link href="/leaderboard" className="inline-block text-xs font-semibold text-emerald-400 hover:underline pt-1">View Leaderboard →</Link>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">🤝</div>
          <h4 className="font-semibold text-white">Affiliate Partner Hub</h4>
          <p className="text-xs text-slate-400 leading-relaxed">Promote digital assets and earn automated commission splits instantly.</p>
          <Link href="/affiliate" className="inline-block text-xs font-semibold text-emerald-400 hover:underline pt-1">Explore Affiliate Program →</Link>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-6 space-y-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">⚡</div>
          <h4 className="font-semibold text-white">Smart Revenue Routing</h4>
          <p className="text-xs text-slate-400 leading-relaxed">Phase 2 programmable revenue splits and decentralized escrow mechanics.</p>
          <Link href="/coming-soon" className="inline-block text-xs font-semibold text-emerald-400 hover:underline pt-1">Learn About Phase 2 →</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <p>© 2026 ArovaQ Creator Marketplace. Built for high-speed Web3 commerce.</p>
        <div className="flex justify-center gap-4">
          <Link href="/coming-soon" className="hover:text-slate-300">Terms & Conditions</Link>
          <span>•</span>
          <Link href="/coming-soon" className="hover:text-slate-300">Privacy Policy</Link>
          <span>•</span>
          <Link href="/dashboard" className="hover:text-slate-300">Creator Portal</Link>
        </div>
      </footer>
    </main>
  );
}