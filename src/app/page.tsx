import ProductCheckout from "@/components/ProductCheckout";
import { createClient } from "@supabase/supabase-js";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Initialize strictly at runtime inside the component
  const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseKey || 'placeholder-key'
  );

  const { data: products } = await supabase.from("products").select("*");

  return (
    <main className="min-h-screen bg-[#090d16] text-slate-100">
      <header className="border-b border-slate-800 pb-4">
        <span className="text-xs font-mono text-cyan-400">Arovaq Store</span>
        <h1 className="text-xl font-bold mt-1">Local Rail Marketplace</h1>
      </header>
      <div className="space-y-4 p-4">
        {products && products.length > 0 ? (
          products.map((item: any) => (
            <div key={item.id} className="bg-slate-900/60 p-4 rounded-lg">
              <h2 className="font-semibold">{item.name}</h2>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No products found.</p>
        )}
      </div>
    </main>
  );
}