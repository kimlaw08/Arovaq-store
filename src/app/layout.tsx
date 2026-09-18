import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arovaq.store — Web3 Creator Marketplace",
  description: "Mobile-first digital asset marketplace and creator rails.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0b0f19] text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950">
        {/* Global Navigation Bar */}
        <header className="border-b border-slate-800 bg-[#0b0f19]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <a href="/" className="font-mono font-bold text-lg text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              arovaq<span className="text-emerald-400">.store</span>
            </a>
            <div className="flex items-center gap-4 text-xs font-mono">
              <a href="/lawi" className="text-slate-400 hover:text-emerald-400 transition-colors">
                My Shelf
              </a>
              <span className="bg-emerald-950/80 text-emerald-400 border border-emerald-600/30 px-3 py-1 rounded-full font-semibold">
                Genesis Live
              </span>
            </div>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}