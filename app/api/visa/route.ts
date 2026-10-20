import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { getVisas, persistVisas } from '@/lib/visa-storage';

export async function GET() {
  const visas = await getVisas();
  return NextResponse.json({ visas });
}

export async function POST(request: Request) {
  try {
    // 1. Check for Admin authorization:
    // Support either Master Admin cookie session or Supabase authenticated user with admin profile role
    const cookieStore = await cookies();
    const isMasterAdmin = cookieStore.get('geo_admin_session')?.value === 'true';

    let isAdmin = isMasterAdmin;
    if (!isAdmin) {
      try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (profile?.role === 'admin') {
            isAdmin = true;
          }
        }
      } catch (authErr) {
        console.warn('Auth check error in /api/visa:', authErr);
      }
    }

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    // 2. Validate payload
    const body = await request.json();
    if (!body || !Array.isArray(body.visas)) {
      return NextResponse.json({ error: 'Invalid payload: visas array required.' }, { status: 400 });
    }

    // 3. Persist visas to Supabase Database with local disk and /tmp fallbacks
    const result = await persistVisas(body.visas);

    return NextResponse.json({
      success: true,
      visas: body.visas,
      savedToDb: result.savedToDb,
      savedToDisk: result.savedToDisk,
      message: result.savedToDb
        ? 'Visa requirements and pricing saved permanently to cloud database.'
        : 'Visa requirements updated in server cache.',
    });
  } catch (err: any) {
    console.error('Error in POST /api/visa:', err);
    return NextResponse.json({ error: err?.message || 'Server error saving visa data' }, { status: 500 });
  }
}
