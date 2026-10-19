'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency, formatDate, numberToWords, cn } from '@/lib/utils';
import type { MoneyReceipt, Profile, PaymentMethod, Invoice } from '@/lib/supabase/types';
import {
  Receipt, Plus, Search, Edit3, Printer, CheckCircle2,
  AlertCircle, X, ShieldAlert, ArrowDownRight, CreditCard,
  Building, Phone, User, Calendar, FileText, Link as LinkIcon
} from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';

interface MoneyReceiptsManagerProps {
  initialReceipts: MoneyReceipt[];
  clients: Profile[];
  invoices?: Invoice[];
}

export function MoneyReceiptsManager({
  initialReceipts,
  clients,
  invoices = [],
}: MoneyReceiptsManagerProps) {
  const [receipts, setReceipts] = useState<MoneyReceipt[]>(initialReceipts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'valid' | 'void'>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState<MoneyReceipt | null>(null);
  const [printReceipt, setPrintReceipt] = useState<MoneyReceipt | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const supabase = createClient();

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Helper to recalculate and update invoice totals when receipts change
  const syncInvoiceFinancials = async (invId: string) => {
    if (!invId) return;
    try {
      const { data: invReceipts } = await supabase
        .from('money_receipts')
        .select('amount, status')
        .eq('invoice_id', invId)
        .eq('status', 'valid');

      const totalPaid = (invReceipts || []).reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

      const { data: invData } = await supabase
        .from('invoices')
        .select('total_amount')
        .eq('id', invId)
        .single();

      if (invData) {
        const totalAmt = invData.total_amount || 0;
        const newBal = Math.max(0, totalAmt - totalPaid);
        const newStatus: Invoice['status'] =
          newBal <= 0 && totalAmt > 0 ? 'paid' : totalPaid > 0 ? 'partial' : 'sent';

        await supabase
          .from('invoices')
          .update({
            amount_paid: totalPaid,
            balance_due: newBal,
            status: newStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('id', invId);
      }
    } catch (err) {
      console.error('Error syncing invoice financials:', err);
    }
  };

  // Form State for New Receipt
  const [formData, setFormData] = useState<{
    receiptNumber: string;
    clientId: string;
    invoiceId: string;
    clientName: string;
    clientPhone: string;
    clientEmail: string;
    amount: string;
    paymentMethod: PaymentMethod;
    referenceNumber: string;
    purpose: string;
    balanceRemaining: string;
    notes: string;
    receiptDate: string;
  }>({
    receiptNumber: `MR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    clientId: '',
    invoiceId: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    amount: '',
    paymentMethod: 'cash',
    referenceNumber: '',
    purpose: 'Travel Booking Payment',
    balanceRemaining: '0',
    notes: '',
    receiptDate: new Date().toISOString().split('T')[0],
  });

  const handleSelectClient = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      // Find invoices for this client
      const clientInvs = invoices.filter((inv) => inv.client_id === client.id);
      const defaultInv = clientInvs.find((inv) => (inv.balance_due ?? inv.total_amount) > 0);

      const remaining = defaultInv
        ? (defaultInv.balance_due ?? defaultInv.total_amount)
        : 0;

      setFormData((prev) => ({
        ...prev,
        clientId: client.id,
        invoiceId: defaultInv ? defaultInv.id : '',
        clientName: client.full_name || '',
        clientPhone: client.phone || '',
        clientEmail: client.email || '',
        purpose: defaultInv ? `Payment for Master Invoice ${defaultInv.invoice_number}` : prev.purpose,
        balanceRemaining: defaultInv ? String(remaining) : prev.balanceRemaining,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        clientId: '',
        invoiceId: '',
      }));
    }
  };

  const handleSelectInvoice = (invId: string) => {
    const inv = invoices.find((i) => i.id === invId);
    if (inv) {
      const client = clients.find((c) => c.id === inv.client_id);
      const remaining = inv.balance_due ?? Math.max(0, inv.total_amount - (inv.amount_paid || 0));
      const numAmt = parseFloat(formData.amount) || 0;
      setFormData((prev) => ({
        ...prev,
        invoiceId: inv.id,
        clientId: client?.id || prev.clientId,
        clientName: client?.full_name || prev.clientName,
        clientPhone: client?.phone || prev.clientPhone,
        clientEmail: client?.email || prev.clientEmail,
        purpose: `Payment for Master Invoice ${inv.invoice_number}`,
        balanceRemaining: String(Math.max(0, remaining - numAmt)),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        invoiceId: '',
      }));
    }
  };

  const handleCreateReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.clientName.trim()) {
      showToast('Client name is required', 'error');
      return;
    }
    const numAmount = parseFloat(formData.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('Please enter a valid positive amount', 'error');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const newReceiptPayload: Partial<MoneyReceipt> = {
        receipt_number: formData.receiptNumber,
        client_id: formData.clientId || null,
        invoice_id: formData.invoiceId || null,
        client_name: formData.clientName,
        client_phone: formData.clientPhone || null,
        client_email: formData.clientEmail || null,
        amount: numAmount,
        payment_method: formData.paymentMethod,
        reference_number: formData.referenceNumber || null,
        purpose: formData.purpose,
        balance_remaining: parseFloat(formData.balanceRemaining) || 0,
        status: 'valid',
        issued_by: user?.id || null,
        notes: formData.notes || null,
        created_at: new Date(formData.receiptDate).toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Insert into Supabase
      const { data, error } = await supabase
        .from('money_receipts')
        .insert(newReceiptPayload as any)
        .select()
        .single();

      const createdObj = (data as MoneyReceipt) || {
        ...newReceiptPayload,
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      };

      // Automatically sync invoice financials if linked!
      if (formData.invoiceId) {
        await syncInvoiceFinancials(formData.invoiceId);
      }

      setReceipts([createdObj, ...receipts]);
      showToast(`Money Receipt ${formData.receiptNumber} issued & linked successfully!`);
      setIsCreating(false);

      // Reset form
      setFormData({
        receiptNumber: `MR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        clientId: '',
        invoiceId: '',
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        amount: '',
        paymentMethod: 'cash',
        referenceNumber: '',
        purpose: 'Travel Booking Payment',
        balanceRemaining: '0',
        notes: '',
        receiptDate: new Date().toISOString().split('T')[0],
      });
    } catch (err: any) {
      showToast(err.message || 'Error creating receipt', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReceipt) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('money_receipts')
        .update({
          receipt_number: editingReceipt.receipt_number,
          client_name: editingReceipt.client_name,
          client_phone: editingReceipt.client_phone,
          client_email: editingReceipt.client_email,
          amount: editingReceipt.amount,
          payment_method: editingReceipt.payment_method,
          reference_number: editingReceipt.reference_number,
          purpose: editingReceipt.purpose,
          balance_remaining: editingReceipt.balance_remaining,
          status: editingReceipt.status,
          notes: editingReceipt.notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingReceipt.id);

      if (editingReceipt.invoice_id) {
        await syncInvoiceFinancials(editingReceipt.invoice_id);
      }

      setReceipts(
        receipts.map((r) => (r.id === editingReceipt.id ? { ...editingReceipt, updated_at: new Date().toISOString() } : r))
      );
      showToast(`Money Receipt ${editingReceipt.receipt_number} updated successfully!`);
      setEditingReceipt(null);
    } catch (err: any) {
      showToast(err.message || 'Error updating receipt', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVoid = async (receipt: MoneyReceipt) => {
    const newStatus = receipt.status === 'valid' ? 'void' : 'valid';
    if (!confirm(`Are you sure you want to mark Receipt ${receipt.receipt_number} as ${newStatus.toUpperCase()}?`)) {
      return;
    }

    try {
      await supabase
        .from('money_receipts')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', receipt.id);

      if (receipt.invoice_id) {
        await syncInvoiceFinancials(receipt.invoice_id);
      }

      setReceipts(receipts.map((r) => (r.id === receipt.id ? { ...r, status: newStatus } : r)));
      showToast(`Receipt ${receipt.receipt_number} marked as ${newStatus.toUpperCase()}`);
    } catch (err: any) {
      showToast('Status updated locally');
      setReceipts(receipts.map((r) => (r.id === receipt.id ? { ...r, status: newStatus } : r)));
    }
  };

  const filteredReceipts = receipts.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.receipt_number?.toLowerCase().includes(q) ||
        r.client_name?.toLowerCase().includes(q) ||
        r.purpose?.toLowerCase().includes(q) ||
        r.reference_number?.toLowerCase().includes(q) ||
        r.client_phone?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalCollected = filteredReceipts
    .filter((r) => r.status === 'valid')
    .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  return (
    <div className="space-y-6 print:space-y-0 print:m-0">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 border text-sm font-bold animate-in slide-in-from-bottom duration-200 print:hidden ${
            toast.type === 'success'
              ? 'bg-emerald-950 text-emerald-200 border-emerald-500/40 shadow-emerald-900/50'
              : 'bg-red-950 text-red-200 border-red-500/40 shadow-red-900/50'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-dark flex items-center gap-2.5">
            <Receipt className="h-7 w-7 text-amber-500" />
            Money Receipts &amp; Cash Desk
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Issue official GEO Trips money receipts, track payment modes, and generate printable vouchers.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-sm rounded-xl transition shadow-md shadow-amber-500/20 cursor-pointer self-start"
        >
          <Plus className="h-4 w-4" />
          <span>Issue Money Receipt</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:hidden">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Valid Receipts Issued</p>
          <p className="font-display font-black text-2xl text-brand-dark mt-1">
            {receipts.filter((r) => r.status === 'valid').length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Received (Filtered)</p>
          <p className="font-display font-black text-2xl text-emerald-600 mt-1">
            {formatCurrency(totalCollected)}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Void / Cancelled</p>
          <p className="font-display font-black text-2xl text-red-500 mt-1">
            {receipts.filter((r) => r.status === 'void').length}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between print:hidden">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by MR#, client, phone, purpose..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-gray-500">Status:</span>
          {(['all', 'valid', 'void'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold transition capitalize cursor-pointer',
                statusFilter === s
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden print:hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                <th className="px-5 py-3.5">MR Number &amp; Date</th>
                <th className="px-5 py-3.5">Received From</th>
                <th className="px-5 py-3.5">Purpose / On Account Of</th>
                <th className="px-5 py-3.5">Amount (BDT)</th>
                <th className="px-5 py-3.5">Method &amp; Ref</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReceipts.map((r) => (
                <tr key={r.id} className={cn('hover:bg-slate-50/60 transition', r.status === 'void' && 'opacity-60 bg-red-50/20')}>
                  <td className="px-5 py-4">
                    <p className="font-mono font-bold text-brand-dark">{r.receipt_number}</p>
                    <p className="text-[11px] text-gray-400">{formatDate(r.created_at)}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-gray-900">{r.client_name}</p>
                    {r.client_phone && <p className="text-[11px] text-gray-500">{r.client_phone}</p>}
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-800 line-clamp-1">{r.purpose}</p>
                    {r.invoice_id && (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-brand-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 mt-0.5">
                        <FileText className="h-3 w-3" />
                        {invoices.find((i) => i.id === r.invoice_id)?.invoice_number || 'Linked Invoice'}
                      </span>
                    )}
                    {r.balance_remaining > 0 && (
                      <p className="text-[11px] text-amber-600 font-semibold">
                        Due: {formatCurrency(r.balance_remaining)}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-display font-black text-sm text-brand-dark">
                      {formatCurrency(r.amount)}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-block px-2 py-0.5 rounded-md font-bold uppercase text-[10px] bg-slate-100 text-slate-800 border border-slate-200">
                      {r.payment_method.replace('_', ' ')}
                    </span>
                    {r.reference_number && (
                      <p className="text-[10px] font-mono text-gray-400 mt-0.5">Ref: {r.reference_number}</p>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        'px-2.5 py-1 rounded-full text-[11px] font-bold uppercase',
                        r.status === 'valid'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-red-100 text-red-700 border border-red-200'
                      )}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPrintReceipt(r)}
                        className="p-1.5 bg-sky-50 hover:bg-sky-100 text-[#0104c3] rounded-lg transition"
                        title="Print Money Receipt"
                      >
                        <Printer className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditingReceipt(JSON.parse(JSON.stringify(r)))}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                        title="Edit Receipt Details"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleVoid(r)}
                        className={cn(
                          'p-1.5 rounded-lg transition',
                          r.status === 'valid'
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                        )}
                        title={r.status === 'valid' ? 'Void Receipt' : 'Reactivate Receipt'}
                      >
                        <ShieldAlert className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredReceipts.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 font-semibold">
                    No money receipts found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Money Receipt Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150 print:hidden">
          <div
            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#03082a] via-[#07134d] to-[#0104c3] text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
                  New Cash / Payment Voucher
                </span>
                <h2 className="font-display font-black text-2xl text-white">Issue Money Receipt</h2>
              </div>
              <button
                onClick={() => setIsCreating(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReceipt} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    MR Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.receiptNumber}
                    onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl font-mono font-bold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Receipt Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.receiptDate}
                    onChange={(e) => setFormData({ ...formData, receiptDate: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                  />
                </div>
              </div>

              {/* Client Selection */}
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Select Registered Client (Optional)
                </label>
                <select
                  value={formData.clientId}
                  onChange={(e) => handleSelectClient(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900 font-medium"
                >
                  <option value="">-- Or enter custom name below --</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.full_name || 'Unnamed'} ({c.email || c.phone || 'No contact'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Link to Master Invoice */}
              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Link to Master Invoice (Optional)</span>
                  {formData.invoiceId && (
                    <span className="text-[10px] text-emerald-600 font-extrabold uppercase">
                      ✓ Auto-Syncs Invoice
                    </span>
                  )}
                </label>
                <select
                  value={formData.invoiceId}
                  onChange={(e) => handleSelectInvoice(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900 font-medium"
                >
                  <option value="">-- Standalone Voucher (No Master Invoice Linked) --</option>
                  {(formData.clientId ? invoices.filter((inv) => inv.client_id === formData.clientId) : invoices).map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.invoice_number} · Total: {formatCurrency(inv.total_amount)} · Due: {formatCurrency(inv.balance_due ?? (inv.total_amount - (inv.amount_paid || 0)))}
                    </option>
                  ))}
                </select>
                {formData.invoiceId && (
                  <p className="text-[11px] text-brand-blue-700 font-semibold mt-1">
                    ✓ Payments recorded on this receipt will automatically update and reflect on Invoice #{invoices.find(i => i.id === formData.invoiceId)?.invoice_number}.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Received With Thanks From *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    placeholder="Client or Corporate Name"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl font-semibold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.clientPhone}
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    placeholder="+880 1XXXXXXXXX"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    placeholder="client@email.com"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                  />
                </div>
              </div>

              {/* Amount and Words */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Amount Received (BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="any"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="e.g. 25000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-xl font-display font-black text-base text-brand-dark focus:border-amber-400"
                  />
                  {formData.amount && !isNaN(Number(formData.amount)) && (
                    <p className="text-[11px] text-amber-700 font-semibold mt-1">
                      In Words: {numberToWords(Number(formData.amount))}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Remaining Balance Due (BDT)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={formData.balanceRemaining}
                    onChange={(e) => setFormData({ ...formData, balanceRemaining: e.target.value })}
                    placeholder="0 if fully paid"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                  />
                </div>
              </div>

              {/* Payment Method & Reference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Payment Method *
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as PaymentMethod })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900 font-bold"
                  >
                    <option value="cash">Cash Payment</option>
                    <option value="bank_transfer">Bank Transfer / EFT / RTGS</option>
                    <option value="bkash">bKash Merchant / Personal</option>
                    <option value="nagad">Nagad</option>
                    <option value="cheque">Cheque / Pay Order</option>
                    <option value="card">Credit / Debit Card</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Cheque / Trx ID / Bank Details
                  </label>
                  <input
                    type="text"
                    value={formData.referenceNumber}
                    onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                    placeholder="Bank name, branch, cheque no or trxID"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  On Account Of / Purpose *
                </label>
                <input
                  type="text"
                  required
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="e.g. Full payment for Singapore Airlines DAC-SIN round trip ticket"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Internal Remarks / Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional remarks or instructions..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black rounded-xl transition shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{loading ? 'Creating...' : 'Issue & Save Receipt'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Money Receipt Modal */}
      {editingReceipt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150 print:hidden">
          <div
            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#03082a] via-[#07134d] to-[#0104c3] text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
                  Modify Money Receipt Data
                </span>
                <h2 className="font-display font-black text-2xl text-white">
                  Edit Receipt {editingReceipt.receipt_number}
                </h2>
              </div>
              <button
                onClick={() => setEditingReceipt(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateReceipt} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    MR Number
                  </label>
                  <input
                    type="text"
                    required
                    value={editingReceipt.receipt_number}
                    onChange={(e) => setEditingReceipt({ ...editingReceipt, receipt_number: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl font-mono font-bold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={editingReceipt.status}
                    onChange={(e) => setEditingReceipt({ ...editingReceipt, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900 font-bold"
                  >
                    <option value="valid">Valid Receipt</option>
                    <option value="void">Void / Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingReceipt.client_name}
                    onChange={(e) => setEditingReceipt({ ...editingReceipt, client_name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl font-semibold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editingReceipt.client_phone || ''}
                    onChange={(e) => setEditingReceipt({ ...editingReceipt, client_phone: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editingReceipt.client_email || ''}
                    onChange={(e) => setEditingReceipt({ ...editingReceipt, client_email: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Amount Received (BDT) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="any"
                    value={editingReceipt.amount}
                    onChange={(e) => setEditingReceipt({ ...editingReceipt, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl font-display font-black text-base text-brand-dark"
                  />
                  {editingReceipt.amount > 0 && (
                    <p className="text-[11px] text-amber-700 font-semibold mt-1">
                      In Words: {numberToWords(editingReceipt.amount)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Remaining Balance Due (BDT)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={editingReceipt.balance_remaining}
                    onChange={(e) => setEditingReceipt({ ...editingReceipt, balance_remaining: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Payment Method
                  </label>
                  <select
                    value={editingReceipt.payment_method}
                    onChange={(e) => setEditingReceipt({ ...editingReceipt, payment_method: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900 font-bold"
                  >
                    <option value="cash">Cash Payment</option>
                    <option value="bank_transfer">Bank Transfer / EFT / RTGS</option>
                    <option value="bkash">bKash Merchant / Personal</option>
                    <option value="nagad">Nagad</option>
                    <option value="cheque">Cheque / Pay Order</option>
                    <option value="card">Credit / Debit Card</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Cheque / Trx ID / Reference
                  </label>
                  <input
                    type="text"
                    value={editingReceipt.reference_number || ''}
                    onChange={(e) => setEditingReceipt({ ...editingReceipt, reference_number: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  On Account Of / Purpose
                </label>
                <input
                  type="text"
                  required
                  value={editingReceipt.purpose}
                  onChange={(e) => setEditingReceipt({ ...editingReceipt, purpose: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Internal Remarks
                </label>
                <textarea
                  rows={2}
                  value={editingReceipt.notes || ''}
                  onChange={(e) => setEditingReceipt({ ...editingReceipt, notes: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingReceipt(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black rounded-xl transition shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Voucher Modal */}
      {printReceipt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 print:static print:inset-auto print:z-auto print:p-0 print:bg-transparent print:backdrop-blur-none print:block">
          <div
            className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[95vh] print:max-h-none print:overflow-visible print:p-0 print:m-0 print:shadow-none print:rounded-none print:w-full print:max-w-none print:border-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Action Bar (Hidden in Print) */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Print Voucher Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setPrintReceipt(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Printable Voucher Document */}
            <div className="p-8 sm:p-12 text-slate-900 space-y-8 bg-white relative print:p-0 print:space-y-4 print:text-[11px] print:leading-tight print:px-2">
              {printReceipt.status === 'void' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
                  <span className="font-display font-black text-8xl text-red-600 rotate-[-25deg] uppercase border-8 border-red-600 p-8 rounded-3xl">
                    VOID
                  </span>
                </div>
              )}

              {/* Agency Letterhead Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b-2 border-slate-900 pb-6">
                <div>
                  <BrandLogo size="md" showTagline={false} />
                  <p className="text-xs font-bold text-amber-600 tracking-wider uppercase mt-2">
                    1 Stop Multiple Service · Travel Agent
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    154 C/A, Motijheel, Dhaka-1000, Bangladesh<br />
                    Phone: +88 01913-389573, +88 01611-204561<br />
                    Email: geotrips19@gmail.com
                  </p>
                </div>

                <div className="text-right">
                  <div className="inline-block px-4 py-1.5 bg-slate-900 text-amber-400 font-display font-black text-sm uppercase tracking-widest rounded-lg">
                    MONEY RECEIPT
                  </div>
                  <p className="font-mono font-bold text-sm text-slate-900 mt-2">
                    No: {printReceipt.receipt_number}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Date: {formatDate(printReceipt.created_at)}
                  </p>
                </div>
              </div>

              {/* Receipt Body */}
              <div className="space-y-4 text-sm leading-relaxed border-b border-dashed border-gray-300 pb-8">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-slate-600 shrink-0">Received with thanks from:</span>
                  <span className="border-b border-slate-400 flex-1 font-bold text-slate-900 px-2 pb-0.5">
                    {printReceipt.client_name}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-slate-600 shrink-0">Contact Number / Email:</span>
                  <span className="border-b border-slate-400 flex-1 text-slate-800 px-2 pb-0.5">
                    {printReceipt.client_phone || ''} {printReceipt.client_email ? `(${printReceipt.client_email})` : ''}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-slate-600 shrink-0">The sum of Taka (in figures):</span>
                  <span className="border-b-2 border-slate-900 font-display font-black text-base text-slate-900 px-3 pb-0.5 bg-slate-50 rounded">
                    {formatCurrency(printReceipt.amount)}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-slate-600 shrink-0">Amount in Words:</span>
                  <span className="border-b border-slate-400 flex-1 font-bold text-slate-900 italic px-2 pb-0.5">
                    {numberToWords(printReceipt.amount)}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-slate-600 shrink-0">Payment Mode &amp; Instrument:</span>
                  <span className="border-b border-slate-400 flex-1 text-slate-800 px-2 pb-0.5 uppercase font-medium">
                    {printReceipt.payment_method.replace('_', ' ')}
                    {printReceipt.reference_number ? ` (Ref / Trx: ${printReceipt.reference_number})` : ''}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-slate-600 shrink-0">On Account Of / Purpose:</span>
                  <span className="border-b border-slate-400 flex-1 font-semibold text-slate-900 px-2 pb-0.5">
                    {printReceipt.purpose}
                  </span>
                </div>

                {printReceipt.balance_remaining > 0 && (
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-amber-700 shrink-0">Balance Remaining Due:</span>
                    <span className="border-b border-amber-300 font-bold text-amber-700 px-2 pb-0.5">
                      {formatCurrency(printReceipt.balance_remaining)}
                    </span>
                  </div>
                )}
              </div>

              {/* Signatures & Footer */}
              <div className="pt-10 flex items-end justify-between text-xs text-slate-600">
                <div className="text-center space-y-1">
                  <div className="w-44 border-b border-slate-400 pb-1" />
                  <p className="font-semibold text-slate-700">Client Signature</p>
                </div>

                <div className="text-center space-y-1">
                  <div className="w-52 border-b-2 border-slate-900 pb-1 font-bold text-slate-900">
                    Md Mesbah Uddin
                  </div>
                  <p className="font-bold text-slate-900">For GEO Trips</p>
                  <p className="text-[10px] text-slate-400">Authorized Signatory &amp; Seal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
