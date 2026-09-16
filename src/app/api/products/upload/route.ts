import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Forces Next.js to treat this as a dynamic server route
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Initialize Supabase client INSIDE the function (runs at runtime, not build time)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Perform your database insertion or upload logic here
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