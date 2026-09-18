import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, buyerRef } = body;

    if (!productId || !buyerRef) {
      return NextResponse.json({ error: 'Missing product ID or buyer reference' }, { status: 400 });
    }

    const { error } = await supabase
      .from('purchases')
      .insert([{ product_id: productId, buyer_ref: buyerRef }]);

    if (error) {
      console.error('Purchase record error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}