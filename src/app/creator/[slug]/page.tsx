import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface CreatorPageProps {
  params: {
    slug: string;
  };
}

export default async function CreatorPage({ params }: CreatorPageProps) {
  const { slug } = params;

  // Retrieve environment variables safely inside runtime execution
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    notFound();
  }

  // Initialized strictly at runtime - never during build evaluation
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch the creator profile based on the slug/handle
  const { data: creator, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('handle', slug)
    .single();

  if (error || !creator) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8 bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{creator.full_name || creator.handle}&apos;s Store</h1>
        <p className="text-gray-400 mb-6">Official storefront and digital products powered by Arovaq.</p>
      </div>
    </main>
  );
}