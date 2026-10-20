import { VisaManager } from '@/components/admin/VisaManager';
import { requireAdmin } from '@/lib/auth/admin-auth';
import { getVisas } from '@/lib/visa-storage';

export default async function AdminVisaPage() {
  await requireAdmin();
  const visas = await getVisas();
  return <VisaManager initialVisas={visas} />;
}
