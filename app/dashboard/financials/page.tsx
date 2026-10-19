import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { Receipt, AlertCircle, CheckCircle2, TrendingUp, Download, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default async function ClientFinancialsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const [{ data: payments }, { data: invoices }] = await Promise.all([
    supabase
      .from('payments')
      .select('*')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('invoices')
      .select('*, invoice_items(*)')
      .eq('client_id', user.id)
      .order('created_at', { ascending: false }),
  ]);

  const totalBilled = payments?.reduce((acc, p) => acc + (p.total_client_price || 0), 0) || 0;
  const totalPaid = payments?.reduce((acc, p) => acc + (p.amount_paid_by_client || 0), 0) || 0;
  const totalDue = payments?.reduce((acc, p) => acc + (p.amount_due || 0), 0) || 0;

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-dark">
            Financial Ledger & Invoices
          </h1>
          <p className="text-gray-500 mt-1">
            Complete billing breakdown, payment histories, and master digital invoices.
          </p>
        </div>

        <Link
          href="/dashboard/payments"
          className="px-5 py-2.5 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-extrabold text-xs sm:text-sm rounded-xl transition shadow-md flex items-center gap-2 self-start"
        >
          <span>Submit Payment Receipt</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Total Invoiced</span>
          <p className="font-display font-black text-3xl text-brand-dark">{formatCurrency(totalBilled)}</p>
          <p className="text-xs text-gray-400 mt-1">Across all approved travel services</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Amount Paid</span>
          <p className="font-display font-black text-3xl text-emerald-600">{formatCurrency(totalPaid)}</p>
          <p className="text-xs text-emerald-600/70 mt-1">Verified bank transfers & cash</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Outstanding Due</span>
          <p className={`font-display font-black text-3xl ${totalDue > 0 ? 'text-red-600' : 'text-gray-400'}`}>
            {formatCurrency(totalDue)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {totalDue > 0 ? 'Payment required prior to ticket issue' : 'All accounts settled'}
          </p>
        </div>
      </div>

      {/* Official Invoices */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Receipt className="h-5 w-5 text-brand-blue-600" />
            <h2 className="font-display font-bold text-lg text-brand-dark">Official Invoices</h2>
          </div>
          <span className="text-xs text-gray-400 font-semibold">{invoices?.length || 0} Invoices</span>
        </div>

        {invoices && invoices.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {invoices.map((inv) => (
              <div key={inv.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-brand-blue-700 text-sm">{inv.invoice_number}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(inv.status)}`}>
                      {inv.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Issued: {formatDate(inv.issue_date)} {inv.due_date && `· Due: ${formatDate(inv.due_date)}`}
                  </p>
                  {inv.notes && (
                    <p className="text-xs text-gray-500 italic mt-1">&ldquo;{inv.notes}&rdquo;</p>
                  )}
                </div>

                <div className="text-right">
                  <span className="block font-display font-black text-lg text-brand-dark">
                    {formatCurrency(inv.total_amount)}
                  </span>
                  {inv.balance_due > 0 ? (
                    <span className="text-xs text-red-600 font-bold">
                      Balance: {formatCurrency(inv.balance_due)}
                    </span>
                  ) : (
                    <span className="text-xs text-emerald-600 font-bold">Paid in Full</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-gray-400">
            <Receipt className="h-10 w-10 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No unified invoices created yet. Contact your travel advisor.</p>
          </div>
        )}
      </div>

      {/* Itemized Payment Records */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-display font-bold text-lg text-brand-dark">Itemized Service Ledger</h2>
          <p className="text-xs text-gray-400 mt-0.5">Individual line-item bookings and payment progress.</p>
        </div>

        {payments && payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase">Service</th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase">Agreed Price</th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase">Paid</th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase">Due</th>
                  <th className="px-5 py-3 text-center text-xs font-bold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-brand-dark">{p.service_description}</p>
                      <span className="text-[10px] text-gray-400 uppercase font-bold">{p.service_type?.replace('_', ' ')}</span>
                    </td>
                    <td className="px-5 py-4 text-right font-medium text-brand-dark">
                      {formatCurrency(p.total_client_price)}
                    </td>
                    <td className="px-5 py-4 text-right text-emerald-600 font-medium">
                      {formatCurrency(p.amount_paid_by_client)}
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-red-600">
                      {p.amount_due > 0 ? formatCurrency(p.amount_due) : '৳0'}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(p.payment_status)}`}>
                        {p.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400 text-sm">
            No payment ledger items recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}
