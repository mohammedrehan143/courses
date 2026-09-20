import { NextRequest, NextResponse } from 'next/server';
import { getUserPurchases } from '@/lib/services/marketplace';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    let userId: string | null = null;

    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) userId = user.id;
    } catch {
      // In demo mode or no active cookie
    }

    if (!userId) {
      userId = request.headers.get('x-user-id');
    }

    const isDemo =
      process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-ref');

    if (!userId && isDemo) {
      userId = 'user_alex_stanford';
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized. Sign in required.' },
        { status: 401 }
      );
    }

    const purchases = await getUserPurchases(userId);
    return NextResponse.json({ success: true, purchases });
  } catch (error) {
    console.error('API /api/marketplace/purchases error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user purchases' },
      { status: 500 }
    );
  }
}
