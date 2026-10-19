import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/admin-auth';
import { ClientManager } from '@/components/admin/ClientManager';
import type { Profile } from '@/lib/supabase/types';

export default async function AdminClientsPage() {
  const { user, profile } = await requireAdmin();
  const supabase = createAdminClient();

  let clients: Profile[] = [];
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error querying profiles:', error);
    } else if (data && data.length > 0) {
      clients = data as Profile[];
    }
  } catch (err) {
    console.error('Error querying profiles:', err);
  }

  // Provide sample client dossiers if database is empty so admin can immediately test CRM
  if (clients.length === 0) {
    clients = [
      {
        id: 'client-seed-1',
        created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
        updated_at: new Date().toISOString(),
        full_name: 'Mohammad Farhad Reza',
        email: 'farhad.reza@gmail.com',
        phone: '+880 1819-223344',
        role: 'client',
        passport_number: 'A09876543',
        passport_expiry: new Date(Date.now() + 86400000 * 250).toISOString().split('T')[0],
        nationality: 'Bangladeshi',
        date_of_birth: '1985-06-15',
        drive_folder_link: 'https://drive.google.com/drive/folders/sample-dossier-1',
        avatar_url: null,
        is_active: true,
      },
      {
        id: 'client-seed-2',
        created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
        updated_at: new Date().toISOString(),
        full_name: 'Nusrat Jahan Chowdhury',
        email: 'nusrat.jahan@yahoo.com',
        phone: '+880 1712-998877',
        role: 'client',
        passport_number: 'B01234567',
        passport_expiry: new Date(Date.now() + 86400000 * 95).toISOString().split('T')[0], // expiring soon (<180d)
        nationality: 'Bangladeshi',
        date_of_birth: '1992-11-20',
        drive_folder_link: 'https://drive.google.com/drive/folders/sample-dossier-2',
        avatar_url: null,
        is_active: true,
      },
    ];
  }

  return <ClientManager initialClients={clients} />;
}
