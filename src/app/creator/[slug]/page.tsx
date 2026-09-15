import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function CreatorStorefront({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Fetch all products listed by this specific creator ID / handle
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("creator_id", slug);

  if (error || !products) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Storefront Not Found</h1>
          <p className="text-slate-400 text-sm">This creator profile does not have any active listings yet.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12 max-w-6xl mx-auto">
      <div className="mb-8 border-b border-slate-800 pb-6">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">Verified Creator Shelf</span>
        <h1 className="text-3xl font-extrabold mt-1 tracking-tight">Creator ID: {slug}</h1>
        <p className="text-slate-400 text-sm mt-1">Browse verified digital assets and Web3 tools by this creator.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
            {/* Product Cover Image / Shelf Thumbnail */}
            {product.cover_image_url ? (
              <img 
                src={product.cover_image_url} 
                alt={product.title} 
                className="w-full h-48 object-cover border-b border-slate-800" 
              />
            ) : (
              <div className="w-full h-48 bg-slate-800 flex items-center justify-center text-slate-500 text-xs font-mono">
                No Cover Image
              </div>
            )}

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg text-white mb-2">{product.title}</h3>
                <p className="text-slate-400 text-xs line-clamp-2 mb-4">
                  {product.description || "No description provided for this digital asset."}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-emerald-400 font-mono text-sm font-semibold">${product.price_usdt} USDT</span>
                <Link
                  href={`/products/${product.slug}`}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold py-2 px-4 rounded-xl transition"
                >
                  View Product
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}