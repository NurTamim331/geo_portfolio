'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency, formatDate, getStatusColor, cn } from '@/lib/utils';
import type { PaymentVerification } from '@/lib/supabase/types';
import { CheckCircle2, XCircle, Eye, Clock, Building2, User, ExternalLink } from 'lucide-react';

interface VerificationWithClient extends PaymentVerification {
  profiles?: { full_name: string; email: string; phone: string } | null;
}

export function VerificationInbox({
  verifications: initial,
  adminId,
}: {
  verifications: VerificationWithClient[];
  adminId: string;
}) {
  const [items, setItems] = useState(initial);
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const supabase = createClient();

  const filtered = items.filter((v) => filter === 'all' || v.status === filter);

  const handleAction = async (id: string, action: 'approved' | 'rejected') => {
    let notes = '';
    if (action === 'rejected') {
      const promptRes = window.prompt('Provide rejection reason (e.g. invalid transaction ID, mismatched amount):');
      if (promptRes === null) return;
      notes = promptRes;
    }

    setLoadingId(id);
    const target = items.find((v) => v.id === id);

    try {
      const { error: updateError } = await supabase
        .from('payment_verifications')
        .update({
          status: action,
          reviewed_by: adminId,
          reviewed_at: new Date().toISOString(),
          admin_notes: notes || null,
        })
        .eq('id', id);

      if (updateError) throw updateError;

      // If approved and linked to a payment, update the payment's paid amount
      if (action === 'approved' && target?.payment_id) {
        const { data: currentPay } = await supabase
          .from('payments')
          .select('amount_paid_by_client, total_client_price')
          .eq('id', target.payment_id)
          .single();

        if (currentPay) {
          const newPaid = (currentPay.amount_paid_by_client || 0) + (target.amount_transferred || 0);
          const isFullyPaid = newPaid >= (currentPay.total_client_price || 0);

          await supabase
            .from('payments')
            .update({
              amount_paid_by_client: newPaid,
              payment_status: isFullyPaid ? 'paid' : 'partial',
            })
            .eq('id', target.payment_id);
        }
      }

      setItems((prev) =>
        prev.map((v) =>
          v.id === id ? { ...v, status: action, admin_notes: notes || v.admin_notes } : v
        )
      );
    } catch (err: any) {
      alert('Error updating verification: ' + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const pendingCount = items.filter((v) => v.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['pending', 'approved', 'rejected', 'all'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={cn(
              'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition cursor-pointer',
              filter === tab
                ? 'bg-brand-dark text-white border-brand-dark shadow-sm'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            )}
          >
            <span className="capitalize">{tab}</span>
            {tab === 'pending' && pendingCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Verification Cards */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 text-brand-blue-600 rounded-xl">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-brand-dark">
                      {v.profiles?.full_name || 'Client ID: ' + v.client_id.slice(0, 8)}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {v.profiles?.phone || v.profiles?.email || 'Registered Client'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className={cn('px-3 py-1 rounded-full text-xs font-bold border', getStatusColor(v.status))}>
                    {v.status}
                  </span>
                  <span className="font-display font-black text-xl text-brand-dark">
                    {formatCurrency(v.amount_transferred)}
                  </span>
                </div>
              </div>

              {/* Transaction details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50 p-4 rounded-xl">
                <div>
                  <span className="text-gray-400 block">Bank / Channel</span>
                  <span className="font-bold text-gray-800 text-sm">{v.bank_name || 'Bank Transfer'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Trx Reference</span>
                  <span className="font-mono font-bold text-brand-blue-700 text-sm">{v.transaction_reference || '—'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Transfer Date</span>
                  <span className="font-semibold text-gray-700 text-sm">{formatDate(v.transfer_date)}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Submission Time</span>
                  <span className="font-semibold text-gray-700 text-sm">{formatDate(v.created_at)}</span>
                </div>
              </div>

              {v.client_message && (
                <p className="text-xs text-gray-600 italic bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                  <strong>Client Note:</strong> &ldquo;{v.client_message}&rdquo;
                </p>
              )}

              {v.admin_notes && (
                <p className="text-xs text-gray-700 bg-slate-100 p-2.5 rounded-lg">
                  <strong>Admin Audit Remark:</strong> {v.admin_notes}
                </p>
              )}

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReceiptUrl(v.receipt_image_url)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-gray-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Eye className="h-4 w-4" />
                  <span>Inspect Receipt Slip</span>
                </button>

                {v.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={loadingId === v.id}
                      onClick={() => handleAction(v.id, 'rejected')}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Reject</span>
                    </button>
                    <button
                      type="button"
                      disabled={loadingId === v.id}
                      onClick={() => handleAction(v.id, 'approved')}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      {loadingId === v.id ? (
                        <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Approve & Mark Paid</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center text-gray-400">
            <Clock className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p className="font-semibold text-base text-gray-600">No {filter} receipt slips</p>
            <p className="text-xs text-gray-400 mt-1">Uploaded bank proofs from clients will appear here for review.</p>
          </div>
        )}
      </div>

      {/* Slip Modal Preview */}
      {selectedReceiptUrl && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-brand-dark">Deposit Slip Document</h3>
              <button
                type="button"
                onClick={() => setSelectedReceiptUrl(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[70vh] overflow-auto bg-slate-50 rounded-2xl p-2 border border-gray-100 flex items-center justify-center">
              <img src={selectedReceiptUrl} alt="Deposit Slip Proof" className="max-h-[65vh] object-contain rounded-xl" />
            </div>
            <div className="flex justify-between items-center pt-2">
              <a
                href={selectedReceiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-brand-blue-600 hover:underline flex items-center gap-1"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Open in full tab</span>
              </a>
              <button
                type="button"
                onClick={() => setSelectedReceiptUrl(null)}
                className="px-5 py-2 bg-brand-dark text-white rounded-xl text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
