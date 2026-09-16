import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic execution so Next.js doesn't static-collect or fail prerender during build
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('file') || searchParams.get('id');

    if (!fileId) {
      return NextResponse.json({ error: 'Missing file identifier parameter (?file=)' }, { status: 400 });
    }

    // Generate signed download URL from Supabase storage (expires in 60 seconds)
    const { data, error } = await supabase.storage
      .from('products')
      .createSignedUrl(fileId, 60);

    if (error || !data?.signedUrl) {
      return NextResponse.json(
        { error: 'Asset unverified or vault access expired', details: error?.message },
        { status: 404 }
      );
    }

    // Redirect user directly to the encrypted Supabase storage file stream
    return NextResponse.redirect(data.signedUrl);
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Internal gateway error', details: err?.message },
      { status: 500 }
    );
  }
}