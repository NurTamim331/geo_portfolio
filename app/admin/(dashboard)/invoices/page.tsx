import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/admin-auth';
import { InvoiceGenerator } from '@/components/admin/InvoiceGenerator';

export const dynamic = 'force-dynamic';

export default async function AdminInvoicesPage() {
  const { user, profile } = await requireAdmin();
  const supabase = createAdminClient();

  let clients: any[] = [];
  let unpaidPayments: any[] = [];
  let existingInvoices: any[] = [];

  try {
    const [resClients, resPayments, resInvoices] = await Promise.all([
      supabase.from('profiles').select('*').order('full_name', { ascending: true }),
      supabase
        .from('payments')
        .select('*, profiles!payments_client_id_fkey(full_name, email)')
        .order('created_at', { ascending: false }),
      supabase.from('invoices').select('*, invoice_items(*), money_receipts(*)').order('created_at', { ascending: false }),
    ]);

    clients = resClients.data || [];
    unpaidPayments = resPayments.data || [];
    // Map Supabase-joined invoice_items and money_receipts to the properties the component expects
    existingInvoices = (resInvoices.data || []).map((inv: any) => {
      const validReceipts = Array.isArray(inv.money_receipts)
        ? inv.money_receipts.filter((r: any) => r.status === 'valid')
        : [];
      const receiptsTotal = validReceipts.reduce((sum: number, r: any) => sum + (Number(r.amount) || 0), 0);
      const amountPaid = validReceipts.length > 0 ? receiptsTotal : (inv.amount_paid || 0);
      const balanceDue = Math.max(0, inv.total_amount - amountPaid);
      const status = balanceDue <= 0 && inv.total_amount > 0 ? 'paid' : amountPaid > 0 ? 'partial' : inv.status;

      return {
        ...inv,
        amount_paid: amountPaid,
        balance_due: balanceDue,
        status,
        items: Array.isArray(inv.invoice_items) && inv.invoice_items.length > 0
          ? inv.invoice_items.map((it: any) => ({
              id: it.id,
              invoice_id: it.invoice_id,
              payment_id: it.payment_id,
              description: it.description,
              quantity: it.quantity,
              unit_price: it.unit_price,
              total: it.total || (it.quantity * it.unit_price),
            }))
          : undefined,
        money_receipts: validReceipts,
        invoice_items: undefined,
      };
    });
  } catch (err) {
    console.error('Error fetching invoices data:', err);
  }

  // Seed sample invoice if empty
  if (existingInvoices.length === 0) {
    existingInvoices = [
      {
        id: 'inv-seed-1',
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        updated_at: new Date().toISOString(),
        client_id: 'client-1',
        generated_by: user.id,
        invoice_number: `INV-${new Date().getFullYear()}-001`,
        subtotal: 52000,
        discount: 2000,
        total_amount: 50000,
        amount_paid: 25000,
        balance_due: 25000,
        status: 'partial',
        issue_date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
        due_date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
        notes: 'Deposit received. Balance due prior to flight ticket issuance.',
        currency: 'BDT',
      },
    ];
  }

  return (
    <div className="space-y-6 print:space-y-0 print:m-0">
      <div className="print:hidden">
        <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-dark">
          Invoice Generator & Billing Desk
        </h1>
        <p className="text-gray-500 mt-1">
          Combine multiple tour elements, flight bookings, and consular fees into a unified master invoice.
        </p>
      </div>

      <InvoiceGenerator
        clients={clients || []}
        unpaidPayments={unpaidPayments || []}
        existingInvoices={existingInvoices || []}
      />
    </div>
  );
}
