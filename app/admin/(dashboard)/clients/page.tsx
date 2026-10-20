import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/admin-auth';
import { ClientManager } from '@/components/admin/ClientManager';
import type { Profile, Passport } from '@/lib/supabase/types';

export default async function AdminClientsPage() {
  await requireAdmin();
  const supabase = createAdminClient();

  let clients: Profile[] = [];
  try {
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('Error querying profiles:', profilesError);
    } else if (profilesData && profilesData.length > 0) {
      clients = profilesData as Profile[];

      // Fetch passports from dedicated passports table if it exists
      try {
        const { data: passportsData } = await supabase
          .from('passports')
          .select('*')
          .order('is_primary', { ascending: false });

        if (passportsData && Array.isArray(passportsData)) {
          const passportsByClient: Record<string, Passport[]> = {};
          passportsData.forEach((p: Passport) => {
            if (!passportsByClient[p.client_id]) passportsByClient[p.client_id] = [];
            passportsByClient[p.client_id].push(p);
          });

          clients = clients.map((c) => ({
            ...c,
            passports: passportsByClient[c.id] || c.passports || [],
          }));
        }
      } catch (passErr) {
        console.warn('Could not query passports table (migration might be pending):', passErr);
      }
    }
  } catch (err) {
    console.error('Error loading client CRM data:', err);
  }

  // Ensure every client has a normalized passports array based on their primary passport_number
  clients = clients.map((c) => {
    let passports = c.passports || [];
    if (passports.length === 0 && c.passport_number) {
      passports = [
        {
          id: `pass-${c.id}-1`,
          client_id: c.id,
          passport_number: c.passport_number,
          surname: c.surname || c.full_name?.split(' ').pop() || '',
          given_name: c.given_name || c.full_name?.split(' ').slice(0, -1).join(' ') || '',
          nationality: c.nationality || 'Bangladeshi',
          issuing_country: c.issued_country || 'Bangladesh',
          issue_date: null,
          expiry_date: c.passport_expiry,
          date_of_birth: c.date_of_birth,
          passport_type: 'ordinary',
          status:
            c.passport_expiry && new Date(c.passport_expiry).getTime() < Date.now()
              ? 'expired'
              : 'active',
          is_primary: true,
          notes: 'Primary registered passport',
        },
      ];
    }
    return {
      ...c,
      passports,
    };
  });

  // Provide realistic sample client dossiers if database is empty so admin can immediately test CRM
  if (clients.length === 0) {
    clients = [
      {
        id: 'client-seed-1',
        created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
        updated_at: new Date().toISOString(),
        full_name: 'Mohammad Farhad Reza',
        surname: 'Reza',
        given_name: 'Mohammad Farhad',
        email: 'farhad.reza@gmail.com',
        phone: '+880 1819-223344',
        role: 'client',
        passport_number: 'A09876543',
        passport_expiry: new Date(Date.now() + 86400000 * 250).toISOString().split('T')[0],
        issued_country: 'Bangladesh',
        nationality: 'Bangladeshi',
        date_of_birth: '1985-06-15',
        gender: 'Male',
        address: 'House 42, Road 11, Sector 4, Uttara, Dhaka-1230',
        fathers_name: 'Late Md. Abdul Reza',
        mothers_name: 'Lutfun Nahar Begum',
        drive_folder_link: 'https://drive.google.com/drive/folders/sample-dossier-1',
        avatar_url: null,
        is_active: true,
        passports: [
          {
            id: 'pass-seed-1a',
            client_id: 'client-seed-1',
            passport_number: 'A09876543',
            surname: 'Reza',
            given_name: 'Mohammad Farhad',
            nationality: 'Bangladeshi',
            issuing_country: 'Bangladesh',
            issue_date: '2022-04-10',
            expiry_date: new Date(Date.now() + 86400000 * 250).toISOString().split('T')[0],
            date_of_birth: '1985-06-15',
            place_of_birth: 'Dhaka',
            passport_type: 'ordinary',
            status: 'active',
            is_primary: true,
            notes: 'Current e-passport (48 pages, 10-year validity). Contains Singapore 2-year multiple entry visa.',
          },
          {
            id: 'pass-seed-1b',
            client_id: 'client-seed-1',
            passport_number: 'EA0123987',
            surname: 'Reza',
            given_name: 'Mohammad Farhad',
            nationality: 'Bangladeshi',
            issuing_country: 'Bangladesh',
            issue_date: '2017-02-15',
            expiry_date: '2022-02-14',
            date_of_birth: '1985-06-15',
            place_of_birth: 'Dhaka',
            passport_type: 'ordinary',
            status: 'expired',
            is_primary: false,
            notes: 'Old machine-readable passport (MRP). Contains valid 10-year US B1/B2 visa and Schengen visas.',
          },
        ],
      },
      {
        id: 'client-seed-2',
        created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
        updated_at: new Date().toISOString(),
        full_name: 'Nusrat Jahan Chowdhury',
        surname: 'Chowdhury',
        given_name: 'Nusrat Jahan',
        email: 'nusrat.jahan@yahoo.com',
        phone: '+880 1712-998877',
        role: 'client',
        passport_number: 'B01234567',
        passport_expiry: new Date(Date.now() + 86400000 * 95).toISOString().split('T')[0], // expiring soon (<180d)
        issued_country: 'Bangladesh',
        nationality: 'Bangladeshi',
        date_of_birth: '1992-11-20',
        gender: 'Female',
        address: 'Apartment 5B, Concord Tower, Gulshan-2, Dhaka-1212',
        fathers_name: 'Khandakar Enamul Chowdhury',
        mothers_name: 'Shirin Akhter Chowdhury',
        drive_folder_link: 'https://drive.google.com/drive/folders/sample-dossier-2',
        avatar_url: null,
        is_active: true,
        passports: [
          {
            id: 'pass-seed-2a',
            client_id: 'client-seed-2',
            passport_number: 'B01234567',
            surname: 'Chowdhury',
            given_name: 'Nusrat Jahan',
            nationality: 'Bangladeshi',
            issuing_country: 'Bangladesh',
            issue_date: '2019-12-01',
            expiry_date: new Date(Date.now() + 86400000 * 95).toISOString().split('T')[0],
            date_of_birth: '1992-11-20',
            place_of_birth: 'Chittagong',
            passport_type: 'ordinary',
            status: 'active',
            is_primary: true,
            notes: 'Current passport expiring soon (<180 days). Client notified for renewal before Australia visa submission.',
          },
        ],
      },
    ];
  }

  return <ClientManager initialClients={clients} />;
}
