import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Forces Next.js to render this route dynamically at runtime (prevents static build errors)
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileKey = searchParams.get('file');

    if (!fileKey) {
      return NextResponse.json({ error: 'File identifier missing' }, { status: 400 });
    }

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Generate a secure signed URL or fetch asset data from Supabase Storage
    const { data, error } = await supabase.storage
      .from('digital-products')
      .createSignedUrl(fileKey, 60); // Link expires in 60 seconds

    if (error || !data) {
      throw new Error(error?.message || 'Failed to generate download link');
    }

    // Redirect the user securely to the temporary signed file download URL
    return NextResponse.redirect(data.signedUrl);

  } catch (err: any) {
    console.error('Download error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error during download' },
      { status: 500 }
    );
  }
}