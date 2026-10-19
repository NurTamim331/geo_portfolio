import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function requireAdmin() {
  const cookieStore = await cookies();
  const isMasterAdmin = cookieStore.get('geo_admin_session')?.value === 'true';

  if (isMasterAdmin) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@geotrips.com';
    return {
      user: { id: 'admin-master', email: adminEmail },
      profile: {
        id: 'admin-master',
        role: 'admin' as const,
        full_name: 'Md Mesbah Uddin (Admin)',
        email: adminEmail,
      },
      isMasterAdmin: true,
    };
  }

  const supabase = await createClient();
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {}

  if (!user) {
    redirect('/admin/login');
  }

  let profile = null;
  try {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    profile = data;
  } catch {}

  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  return { user, profile, isMasterAdmin: false };
}
