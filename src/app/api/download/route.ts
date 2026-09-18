import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Missing environment variables' }, 
        { status: 500 }
      );
    }

    // Initialized strictly at runtime inside the function handler
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Add your download verification/logic here
    return NextResponse.json({ success: true, message: 'Download route active' });

  } catch (err: any) {
    console.error('Download error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error' }, 
      { status: 500 }
    );
  }
}