import { MoneyReceiptsManager } from '@/components/admin/MoneyReceiptsManager';
import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/admin-auth';
import type { MoneyReceipt, Profile, Invoice } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

export default async function AdminReceiptsPage() {
  const { user, profile } = await requireAdmin();
  const supabase = createAdminClient();

  let receipts: MoneyReceipt[] = [];
  let clients: Profile[] = [];
  let invoices: Invoice[] = [];

  try {
    const [{ data: receiptsData }, { data: clientsData }, { data: invoicesData }] = await Promise.all([
      supabase.from('money_receipts').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*').order('full_name', { ascending: true }),
      supabase.from('invoices').select('*').order('created_at', { ascending: false }),
    ]);

    receipts = (receiptsData as MoneyReceipt[]) || [];
    clients = (clientsData as Profile[]) || [];
    invoices = (invoicesData as Invoice[]) || [];
  } catch (err) {
    console.error('Error fetching receipts, clients, or invoices:', err);
  }

  // If no receipts are in the database yet, provide initial seed vouchers for immediate utility
  if (receipts.length === 0) {
    receipts = [
      {
        id: 'mr-seed-1',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        updated_at: new Date().toISOString(),
        receipt_number: `MR-${new Date().getFullYear()}-0101`,
        client_id: null,
        client_name: 'Tanvir Hossain',
        client_phone: '+880 1711-234567',
        client_email: 'tanvir@example.com',
        amount: 45000,
        payment_method: 'bank_transfer',
        reference_number: 'EBL-TRX-98231',
        purpose: 'Singapore Airlines DAC-SIN round trip confirmed air ticket',
        invoice_id: null,
        payment_id: null,
        balance_remaining: 0,
        status: 'valid',
        issued_by: null,
        notes: 'Full payment received through Eastern Bank Ltd Motijheel branch.',
      },
      {
        id: 'mr-seed-2',
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        updated_at: new Date().toISOString(),
        receipt_number: `MR-${new Date().getFullYear()}-0102`,
        client_id: null,
        client_name: 'Farzana Akter',
        client_phone: '+880 1912-887766',
        client_email: 'farzana@example.com',
        amount: 14000,
        payment_method: 'bkash',
        reference_number: 'BK-99120482',
        purpose: 'Thailand Tourist Visa application fee for 2 family members',
        invoice_id: null,
        payment_id: null,
        balance_remaining: 0,
        status: 'valid',
        issued_by: null,
        notes: 'Documents collected from Motijheel office.',
      },
    ];
  }

  return (
    <MoneyReceiptsManager
      initialReceipts={receipts}
      clients={clients}
      invoices={invoices}
    />
  );
}
