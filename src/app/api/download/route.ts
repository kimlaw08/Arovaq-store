import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('id');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Missing Supabase environment variables' },
        { status: 500 }
      );
    }

    // Initialized safely INSIDE the runtime function handler
    const supabase = createClient(supabaseUrl, supabaseKey);

    return NextResponse.json({ 
      success: true, 
      message: 'Download route ready',
      fileId 
    });

  } catch (err: any) {
    console.error('Download error:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error during download' },
      { status: 500 }
    );
  }
}