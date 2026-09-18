import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const buyerRef = searchParams.get('buyer') || 'guest';

  const { data: purchase, error: purchaseError } = await supabase
    .from('purchases')
    .select('*')
    .eq('product_id', id)
    .eq('buyer_ref', buyerRef)
    .single();

  if (purchaseError || !purchase) {
    return NextResponse.json({ error: 'Access denied: No verified purchase found for this asset.' }, { status: 403 });
  }

  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (productError || !product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const rawUrl = product.product_url;
  const pathParts = rawUrl.split('/public/');
  const storagePath = pathParts.length > 1 ? pathParts[1].replace(/^[^/]+\//, '') : rawUrl.split('/').pop();

  // Using the verified private 'digital-assets' bucket
  const { data, error: signError } = await supabase.storage
    .from('digital-assets')
    .createSignedUrl(storagePath || '', 60);

  if (signError || !data) {
    return NextResponse.json({ error: 'Failed to generate secure link' }, { status: 500 });
  }

  return NextResponse.json({ signedUrl: data.signedUrl });
}