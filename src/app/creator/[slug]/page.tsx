import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function CreatorPage({ params }: PageProps) {
  const { slug } = params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    notFound();
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Fetch the creator profile
  const { data: creator, error: creatorError } = await supabase
    .from('profiles')
    .select('*')
    .eq('handle', slug)
    .single();

  if (creatorError || !creator) {
    notFound();
  }

  // 2. Fetch products associated with this creator ID
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('creator_id', creator.id);

  return (
    <main className="min-h-screen bg-[#090d16] text-slate-100 p-6 max-w-5xl mx-auto">
      <div className="border-b border-slate-800 pb-6 mb-8">
        <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">Verified Creator Shelf</span>
        <h1 className="text-3xl font-bold mt-2">{creator.fullName || creator.handle}</h1>
        <p className="text-slate-400 mt-1">Browse verified digital assets and Web3 tools by this creator.</p>
      </div>

      <h2 className="text-xl font-semibold mb-4">Available Assets</h2>

      {!products || products.length === 0 ? (
        <p className="text-slate-500 italic">No digital assets listed by this creator yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <div key={product.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{product.title}</h3>
                <p className="text-slate-400 text-sm mt-2 line-clamp-2">{product.description}</p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-emerald-400 font-bold">${product.price_usdt}</span>
                <Link 
                  href={`/checkout?productId=${product.id}`}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Get Asset
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}