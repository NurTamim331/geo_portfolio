import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/admin-auth';
import { VerificationInbox } from '@/components/admin/VerificationInbox';

export default async function AdminVerificationsPage() {
  const { user } = await requireAdmin();
  const supabase = createAdminClient();

  const { data: verifications } = await supabase
    .from('payment_verifications')
    .select('*, profiles!payment_verifications_client_id_fkey(full_name, email, phone)')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-dark">
          Payment Verification Inbox
        </h1>
        <p className="text-gray-500 mt-1">
          Review uploaded bank deposit receipts, inspect transaction references, and authorize digital invoice mark-offs.
        </p>
      </div>

      <VerificationInbox verifications={verifications || []} adminId={user.id} />
    </div>
  );
}
