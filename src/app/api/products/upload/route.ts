import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Forces Next.js to treat this as a dynamic server route (prevents static build errors)
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Initialize Supabase client with environment keys
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Perform your upload / database insertion logic here
    // Example: const { data, error } = await supabase.from('products').insert([body]);

    return NextResponse.json({ 
      success: true, 
      message: 'Product uploaded successfully',
      data: body 
    });

  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error during upload' },
      { status: 500 }
    );
  }
}