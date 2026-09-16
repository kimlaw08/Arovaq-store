import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { fullName, handle, email, role, termsAccepted } = await request.json();

    if (!email || !handle || !role || !termsAccepted) {
      return NextResponse.json(
        { error: 'Missing required fields, handle, email, role, or terms acceptance.' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Upsert user profile into Supabase
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          email,
          full_name: fullName,
          handle,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      )
      .select();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    const userId = profileData[0]?.id;

    // 2. Automatically issue the Genesis Pioneer badge tied to their active track
    if (userId) {
      const { error: badgeError } = await supabase.from('badges').upsert(
        {
          user_id: userId,
          badge_code: 'genesis_pioneer',
          badge_name: 'Genesis Pioneer',
          category: role, // 'creator' or 'affiliate'
          is_on_chain: false,
        },
        { onConflict: 'user_id,badge_code' }
      );

      if (badgeError) {
        console.error('Badge assignment warning:', badgeError.message);
      }
    }

    return NextResponse.json({ success: true, profile: profileData[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}