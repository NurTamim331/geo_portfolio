import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/admin-auth';
import { FinancialTracker } from '@/components/admin/FinancialTracker';

export default async function AdminFinancePage() {
  await requireAdmin();
  const supabase = createAdminClient();

  const [{ data: payments }, { data: clients }] = await Promise.all([
    supabase
      .from('payments')
      .select('*, profiles!payments_client_id_fkey(full_name, email, phone)')
      .order('created_at', { ascending: false }),
    supabase.from('profiles').select('id, full_name, email').order('full_name', { ascending: true }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-dark">Financial Tracker</h1>
        <p className="text-gray-500 mt-1">Complete payment records — client prices, vendor costs, profit margins, and dues.</p>
      </div>
      <FinancialTracker payments={payments || []} clients={clients || []} />
    </div>
  );
}
