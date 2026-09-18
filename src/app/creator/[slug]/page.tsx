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

  // Initialized strictly at runtime inside the component function
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    notFound();
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: creator, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('handle', slug)
    .single();

  if (error || !creator) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#090d16] text-slate-100 p-6">
      <h1 className="text-2xl font-bold">{creator.fullName || creator.handle}</h1>
      <p className="text-slate-400 mt-2">Welcome to {creator.handle}'s store page.</p>
    </main>
  );
}