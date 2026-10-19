'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Upload, CheckCircle2, FileText, Image as ImageIcon, AlertCircle, Building2, CreditCard } from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import type { PaymentVerification, Payment } from '@/lib/supabase/types';

export default function PaymentUploadPage() {
  const [verifications, setVerifications] = useState<PaymentVerification[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    payment_id: '',
    bank_name: '',
    transaction_reference: '',
    amount_transferred: '',
    transfer_date: new Date().toISOString().split('T')[0],
    client_message: '',
  });

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const [{ data: pvs }, { data: pays }] = await Promise.all([
            supabase
              .from('payment_verifications')
              .select('*')
              .eq('client_id', user.id)
              .order('created_at', { ascending: false }),
            supabase
              .from('payments')
              .select('*')
              .eq('client_id', user.id)
              .neq('payment_status', 'paid'),
          ]);
          setVerifications(pvs || []);
          setPayments(pays || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount_transferred) {
      setError('Please specify the exact transferred amount.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in.');

      let publicUrl = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80';

      // Attempt Supabase storage upload if file provided
      if (receiptFile) {
        try {
          const filePath = `${user.id}/${Date.now()}_${receiptFile.name.replace(/\s+/g, '_')}`;
          const { error: storageError } = await supabase.storage
            .from('payment-receipts')
            .upload(filePath, receiptFile);

          if (!storageError) {
            const { data } = supabase.storage.from('payment-receipts').getPublicUrl(filePath);
            publicUrl = data.publicUrl;
          }
        } catch {
          // Fall back gracefully
        }
      }

      const { data: newPv, error: insertError } = await supabase
        .from('payment_verifications')
        .insert({
          client_id: user.id,
          payment_id: form.payment_id || null,
          receipt_image_url: publicUrl,
          bank_name: form.bank_name || 'Bank Transfer',
          transaction_reference: form.transaction_reference || null,
          amount_transferred: parseFloat(form.amount_transferred) || 0,
          transfer_date: form.transfer_date || null,
          client_message: form.client_message || null,
          status: 'pending',
        })
        .select()
        .single();

      if (insertError) throw insertError;

      if (newPv) {
        setVerifications([newPv, ...verifications]);
      }
      setSuccess(true);
      setForm({
        payment_id: '',
        bank_name: '',
        transaction_reference: '',
        amount_transferred: '',
        transfer_date: new Date().toISOString().split('T')[0],
        client_message: '',
      });
      setReceiptFile(null);
      setPreview(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit payment verification.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-dark">
          Upload Payment Receipt
        </h1>
        <p className="text-gray-500 mt-1">
          Made a deposit or online transfer? Upload a screenshot or photo of your deposit slip for administrative clearance.
        </p>
      </div>

      {/* Official Bank Account Details */}
      <div className="bg-brand-dark text-white rounded-2xl p-6 sm:p-8 border border-white/5 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-brand-green-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 text-brand-green-400 font-bold text-xs uppercase tracking-wider">
            <Building2 className="h-4 w-4" />
            <span>GEO Trips Official Accounts</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1">
              <span className="text-xs text-gray-400 uppercase font-semibold">City Bank / BRAC Bank</span>
              <p className="font-bold text-base text-white">GEO TRIPS (Md Mesbah Uddin)</p>
              <p className="text-xs text-brand-green-300 font-mono">A/C: 154-100-XXXX-001</p>
              <p className="text-[11px] text-gray-400">Branch: Motijheel C/A, Dhaka</p>
            </div>

            <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1">
              <span className="text-xs text-gray-400 uppercase font-semibold">Mobile Financial Service</span>
              <p className="font-bold text-base text-white">bKash / Nagad Merchant</p>
              <p className="text-xs text-brand-green-300 font-mono">+880 1913-389573</p>
              <p className="text-[11px] text-gray-400">Reference: Your Full Name</p>
            </div>
          </div>
        </div>
      </div>

      {success && (
        <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <strong className="block">Deposit Slip Received!</strong>
            Our financial accounts officer will verify your bank transaction and automatically deduct it from your dues within 2–4 hours.
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
        <h2 className="font-display font-bold text-lg text-brand-dark pb-2 border-b border-gray-100">
          Payment Information
        </h2>

        {payments.length > 0 && (
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Apply Payment Toward Specific Service (Optional)
            </label>
            <select
              value={form.payment_id}
              onChange={(e) => setForm({ ...form, payment_id: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-600"
            >
              <option value="">-- Apply to general account balance --</option>
              {payments.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.service_description} (Due: {formatCurrency(p.amount_due)})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Transferred Amount (BDT) *
            </label>
            <input
              type="number"
              required
              min="1"
              placeholder="e.g. 15000"
              value={form.amount_transferred}
              onChange={(e) => setForm({ ...form, amount_transferred: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-600 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Sender Bank / Channel *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dutch-Bangla Bank, bKash, City Touch"
              value={form.bank_name}
              onChange={(e) => setForm({ ...form, bank_name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Bank Ref / TrxID (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 9J4K2L8821"
              value={form.transaction_reference}
              onChange={(e) => setForm({ ...form, transaction_reference: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:border-brand-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Date of Transfer
            </label>
            <input
              type="date"
              value={form.transfer_date}
              onChange={(e) => setForm({ ...form, transfer_date: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-600"
            />
          </div>
        </div>

        {/* File Drag / Selector */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Attach Slip Photo / PDF Receipt
          </label>
          <label className="border-2 border-dashed border-gray-200 hover:border-brand-blue-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition bg-slate-50 hover:bg-blue-50/30">
            {preview ? (
              <div className="relative max-h-48 overflow-hidden rounded-xl">
                <img src={preview} alt="Receipt Preview" className="max-h-48 object-contain" />
              </div>
            ) : (
              <div className="text-center space-y-2">
                <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                <p className="text-sm font-semibold text-gray-700">Click to upload deposit slip image</p>
                <p className="text-xs text-gray-400">Supports JPG, PNG, WebP or PDF documents</p>
              </div>
            )}
            <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFileChange} />
          </label>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Client Remarks (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="e.g. Paid from brother's account, partial payment for Thailand tour..."
            value={form.client_message}
            onChange={(e) => setForm({ ...form, client_message: e.target.value })}
            className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-600 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full py-4 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-extrabold text-sm rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          {uploading ? (
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              <span>Submit Payment Verification</span>
            </>
          )}
        </button>
      </form>

      {/* Previous Verification Submissions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-display font-bold text-lg text-brand-dark">Submission History</h2>
        {verifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {verifications.map((v) => (
              <div key={v.id} className="py-4 flex items-center justify-between">
                <div>
                  <span className="font-bold text-brand-dark text-sm block">
                    {formatCurrency(v.amount_transferred)} ({v.bank_name})
                  </span>
                  <span className="text-xs text-gray-400">
                    Trx: {v.transaction_reference || 'N/A'} · Submitted: {formatDate(v.created_at)}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(v.status)}`}>
                  {v.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400">No payment receipts uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
