import ProductCheckout from "@/components/ProductCheckout";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function Home() {
  const { data: products } = await supabase.from("products").select("*");

  return (
    <main className="min-h-screen bg-[#090d16] text-slate-100 p-8 max-w-xl mx-auto space-y-6">
      <header className="border-b border-slate-800 pb-4">
        <span className="text-xs font-mono text-cyan-400 tracking-wider">AROVAQ // STOREFRONT</span>
        <h1 className="text-xl font-bold mt-1">Local Rail Digital Access</h1>
      </header>

      <div className="space-y-4">
        {products && products.length > 0 ? (
          products.map((item: any) => (
            <div key={item.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div>
                <h2 className="text-base font-semibold">{item.name}</h2>
                <p className="text-xs text-slate-400 mt-1">{item.description}</p>
              </div>
              <ProductCheckout product={item} />
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500 font-mono">Loading rail assets...</p>
        )}
      </div>
    </main>
  );
}