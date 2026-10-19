'use client';

import { useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency, formatDate, getStatusColor, cn } from '@/lib/utils';
import type { Payment } from '@/lib/supabase/types';
import {
  Search, Filter, Download, Plus, TrendingUp, TrendingDown,
  DollarSign, AlertCircle, ChevronDown, ChevronUp, Edit3,
  ExternalLink, RefreshCw, CheckCircle
} from 'lucide-react';

interface PaymentWithClient extends Payment {
  profiles?: { full_name: string; email: string; phone: string } | null;
}

interface FinancialTrackerProps {
  payments: PaymentWithClient[];
  clients: { id: string; full_name: string | null; email: string | null }[];
}

type SortKey = 'created_at' | 'total_client_price' | 'amount_due' | 'profit_margin' | 'payment_status';

export function FinancialTracker({ payments: initialPayments, clients }: FinancialTrackerProps) {
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentWithClient | null>(null);

  // ── Filter & Sort ──────────────────────────────────────────
  const filtered = useMemo(() => {
    let data = payments;

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (p) =>
          p.service_description?.toLowerCase().includes(q) ||
          p.profiles?.full_name?.toLowerCase().includes(q) ||
          p.profiles?.email?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      data = data.filter((p) => p.payment_status === statusFilter);
    }

    if (typeFilter !== 'all') {
      data = data.filter((p) => p.service_type === typeFilter);
    }

    data = [...data].sort((a, b) => {
      let aVal = a[sortKey] ?? 0;
      let bVal = b[sortKey] ?? 0;
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }, [payments, search, statusFilter, typeFilter, sortKey, sortDir]);

  // ── Summary Totals ─────────────────────────────────────────
  const totals = useMemo(() => ({
    billed: filtered.reduce((s, p) => s + (p.total_client_price || 0), 0),
    collected: filtered.reduce((s, p) => s + (p.amount_paid_by_client || 0), 0),
    due: filtered.reduce((s, p) => s + (p.amount_due || 0), 0),
    vendorCost: filtered.reduce((s, p) => s + (p.total_vendor_cost || 0), 0),
    profit: filtered.reduce((s, p) => s + (p.profit_margin || 0), 0),
  }), [filtered]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ column }: { column: SortKey }) =>
    sortKey === column
      ? sortDir === 'asc' ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
      : <ChevronDown className="h-3.5 w-3.5 opacity-30" />;

  // ── Mark as Paid ───────────────────────────────────────────
  const handleMarkPaid = async (payment: PaymentWithClient) => {
    const supabase = createClient();
    setLoading(true);
    const { error } = await supabase
      .from('payments')
      .update({
        amount_paid_by_client: payment.total_client_price,
        payment_status: 'paid',
      })
      .eq('id', payment.id);

    if (!error) {
      setPayments((prev) =>
        prev.map((p) =>
          p.id === payment.id
            ? { ...p, amount_paid_by_client: p.total_client_price, payment_status: 'paid', amount_due: 0 }
            : p
        )
      );
    }
    setLoading(false);
  };

  // ── Export CSV ─────────────────────────────────────────────
  const exportCSV = () => {
    const headers = [
      'Client', 'Email', 'Service', 'Type',
      'Client Price', 'Vendor Cost', 'Profit',
      'Paid', 'Due', 'Status', 'Date'
    ];
    const rows = filtered.map((p) => [
      p.profiles?.full_name || '',
      p.profiles?.email || '',
      p.service_description,
      p.service_type || '',
      p.total_client_price,
      p.total_vendor_cost,
      p.profit_margin,
      p.amount_paid_by_client,
      p.amount_due,
      p.payment_status,
      p.payment_date || '',
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `geo-trips-payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Billed', value: totals.billed, color: 'text-blue-600', bg: 'bg-blue-50', icon: DollarSign },
          { label: 'Collected', value: totals.collected, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: TrendingUp },
          { label: 'Outstanding', value: totals.due, color: 'text-red-600', bg: 'bg-red-50', icon: AlertCircle },
          { label: 'Vendor Cost', value: totals.vendorCost, color: 'text-amber-600', bg: 'bg-amber-50', icon: TrendingDown },
          { label: 'Net Profit', value: totals.profit, color: 'text-violet-600', bg: 'bg-violet-50', icon: TrendingUp },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className={`inline-flex p-2 rounded-lg ${card.bg} ${card.color} mb-2`}>
                <Icon className="h-4 w-4" />
              </div>
              <p className={`font-display font-black text-lg ${card.color}`}>
                {formatCurrency(card.value)}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* ── Filters & Actions ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by client, email, or service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-500 transition"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-500 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-500 bg-white"
          >
            <option value="all">All Types</option>
            <option value="flight">Flight</option>
            <option value="visa">Visa</option>
            <option value="hotel">Hotel</option>
            <option value="tour_package">Tour Package</option>
            <option value="hajj_umrah">Hajj & Umrah</option>
          </select>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-brand-blue-600 hover:bg-brand-blue-700 text-white rounded-xl text-sm font-bold transition flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Payment
            </button>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-3">
          Showing {filtered.length} of {payments.length} payments
        </p>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-100">
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Service</th>
                <th
                  className="px-5 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
                  onClick={() => handleSort('total_client_price')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Client Price <SortIcon column="total_client_price" />
                  </div>
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Vendor Cost</th>
                <th
                  className="px-5 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
                  onClick={() => handleSort('profit_margin')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Profit <SortIcon column="profit_margin" />
                  </div>
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Paid</th>
                <th
                  className="px-5 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
                  onClick={() => handleSort('amount_due')}
                >
                  <div className="flex items-center justify-end gap-1">
                    Due <SortIcon column="amount_due" />
                  </div>
                </th>
                <th
                  className="px-5 py-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none"
                  onClick={() => handleSort('payment_status')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Status <SortIcon column="payment_status" />
                  </div>
                </th>
                <th className="px-5 py-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-16 text-center text-gray-400">
                    <DollarSign className="h-10 w-10 mx-auto mb-3 opacity-20" />
                    <p className="font-semibold">No payments found</p>
                    <p className="text-xs mt-1">Add a payment or adjust filters</p>
                  </td>
                </tr>
              ) : (
                filtered.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50/50 transition">
                    {/* Client */}
                    <td className="px-5 py-4">
                      <p className="font-semibold text-brand-dark text-sm">
                        {payment.profiles?.full_name || '—'}
                      </p>
                      <p className="text-xs text-gray-400">{payment.profiles?.email}</p>
                    </td>

                    {/* Service */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-700 max-w-[160px] truncate" title={payment.service_description}>
                        {payment.service_description}
                      </p>
                      <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                        {payment.service_type?.replace('_', ' ')}
                      </span>
                    </td>

                    {/* Client Price */}
                    <td className="px-5 py-4 text-right">
                      <span className="font-bold text-brand-dark">
                        {formatCurrency(payment.total_client_price)}
                      </span>
                    </td>

                    {/* Vendor Cost */}
                    <td className="px-5 py-4 text-right">
                      <span className="text-amber-600 font-medium">
                        {formatCurrency(payment.total_vendor_cost)}
                      </span>
                    </td>

                    {/* Profit */}
                    <td className="px-5 py-4 text-right">
                      <span className={cn(
                        'font-bold',
                        (payment.profit_margin || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'
                      )}>
                        {formatCurrency(payment.profit_margin || 0)}
                      </span>
                    </td>

                    {/* Paid */}
                    <td className="px-5 py-4 text-right">
                      <span className="text-emerald-600 font-medium">
                        {formatCurrency(payment.amount_paid_by_client)}
                      </span>
                    </td>

                    {/* Due */}
                    <td className="px-5 py-4 text-right">
                      <span className={cn(
                        'font-bold',
                        (payment.amount_due || 0) > 0 ? 'text-red-600' : 'text-gray-400'
                      )}>
                        {formatCurrency(payment.amount_due || 0)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 text-center">
                      <span className={cn(
                        'px-3 py-1 rounded-full text-xs font-bold border',
                        getStatusColor(payment.payment_status)
                      )}>
                        {payment.payment_status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {payment.payment_status !== 'paid' && (
                          <button
                            onClick={() => handleMarkPaid(payment)}
                            disabled={loading}
                            title="Mark as Paid"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setEditingPayment(payment)}
                          title="Edit"
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {/* Totals Footer */}
            {filtered.length > 0 && (
              <tfoot>
                <tr className="bg-slate-50 border-t-2 border-gray-200 font-bold">
                  <td colSpan={2} className="px-5 py-4 text-sm text-gray-600 font-bold">
                    TOTALS ({filtered.length} records)
                  </td>
                  <td className="px-5 py-4 text-right text-brand-dark font-black">
                    {formatCurrency(totals.billed)}
                  </td>
                  <td className="px-5 py-4 text-right text-amber-600 font-black">
                    {formatCurrency(totals.vendorCost)}
                  </td>
                  <td className="px-5 py-4 text-right text-emerald-600 font-black">
                    {formatCurrency(totals.profit)}
                  </td>
                  <td className="px-5 py-4 text-right text-emerald-600 font-black">
                    {formatCurrency(totals.collected)}
                  </td>
                  <td className="px-5 py-4 text-right text-red-600 font-black">
                    {formatCurrency(totals.due)}
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* ── Add Payment Modal ── */}
      {showAddModal && (
        <AddPaymentModal
          clients={clients}
          onClose={() => setShowAddModal(false)}
          onSave={(newPayment) => {
            setPayments((prev) => [newPayment as PaymentWithClient, ...prev]);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Add Payment Modal
// ─────────────────────────────────────────────────────────────
function AddPaymentModal({
  clients,
  onClose,
  onSave,
}: {
  clients: { id: string; full_name: string | null; email: string | null }[];
  onClose: () => void;
  onSave: (p: Partial<Payment>) => void;
}) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    client_id: '',
    service_description: '',
    service_type: 'flight',
    total_client_price: '',
    total_vendor_cost: '',
    amount_paid_by_client: '',
    vendor_amount_paid: '',
    payment_status: 'pending',
    vendor_payment_status: 'pending',
    payment_date: '',
    due_date: '',
    admin_notes: '',
  });

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      client_id: form.client_id,
      service_description: form.service_description,
      service_type: form.service_type as Payment['service_type'],
      total_client_price: parseFloat(form.total_client_price) || 0,
      total_vendor_cost: parseFloat(form.total_vendor_cost) || 0,
      amount_paid_by_client: parseFloat(form.amount_paid_by_client) || 0,
      vendor_amount_paid: parseFloat(form.vendor_amount_paid) || 0,
      payment_status: form.payment_status as Payment['payment_status'],
      vendor_payment_status: form.vendor_payment_status as Payment['vendor_payment_status'],
      payment_date: form.payment_date || null,
      due_date: form.due_date || null,
      admin_notes: form.admin_notes || null,
    };

    const { data, error: dbError } = await supabase
      .from('payments')
      .insert(payload)
      .select()
      .single();

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    onSave(data);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-brand-dark">Add New Payment Record</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {error && (
            <div className="col-span-2 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>
          )}

          {/* Client */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Client *</label>
            <select
              required
              value={form.client_id}
              onChange={(e) => set('client_id', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-500"
            >
              <option value="">Select a client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name || c.email}
                </option>
              ))}
            </select>
          </div>

          {/* Service Description */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Service Description *</label>
            <input
              required
              type="text"
              value={form.service_description}
              onChange={(e) => set('service_description', e.target.value)}
              placeholder="e.g. Singapore Tourist Visa - 2 persons"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-500"
            />
          </div>

          {/* Service Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Service Type</label>
            <select
              value={form.service_type}
              onChange={(e) => set('service_type', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-500 bg-white"
            >
              <option value="flight">Flight</option>
              <option value="visa">Visa</option>
              <option value="hotel">Hotel</option>
              <option value="tour_package">Tour Package</option>
              <option value="hajj_umrah">Hajj & Umrah</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Payment Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Payment Status</label>
            <select
              value={form.payment_status}
              onChange={(e) => set('payment_status', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-500 bg-white"
            >
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Financial Fields */}
          {[
            { field: 'total_client_price', label: 'Total Client Price (BDT) *', required: true },
            { field: 'total_vendor_cost', label: 'Total Vendor Cost (BDT)' },
            { field: 'amount_paid_by_client', label: 'Amount Paid by Client (BDT)' },
            { field: 'vendor_amount_paid', label: 'Amount Paid to Vendor (BDT)' },
          ].map(({ field, label, required }) => (
            <div key={field}>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required={required}
                value={form[field as keyof typeof form]}
                onChange={(e) => set(field, e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-500"
              />
            </div>
          ))}

          {/* Dates */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Payment Date</label>
            <input
              type="date"
              value={form.payment_date}
              onChange={(e) => set('payment_date', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Due Date</label>
            <input
              type="date"
              value={form.due_date}
              onChange={(e) => set('due_date', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-500"
            />
          </div>

          {/* Admin Notes */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Admin Notes</label>
            <textarea
              rows={3}
              value={form.admin_notes}
              onChange={(e) => set('admin_notes', e.target.value)}
              placeholder="Internal notes (not visible to client)"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-500 resize-none"
            />
          </div>

          {/* Computed Preview */}
          {form.total_client_price && (
            <div className="col-span-2 p-4 bg-slate-50 rounded-xl border border-gray-100 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-gray-500 font-semibold">Profit Margin</p>
                <p className="font-black text-lg text-emerald-600">
                  {formatCurrency(
                    (parseFloat(form.total_client_price) || 0) - (parseFloat(form.total_vendor_cost) || 0)
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">Client Balance Due</p>
                <p className="font-black text-lg text-red-600">
                  {formatCurrency(
                    (parseFloat(form.total_client_price) || 0) - (parseFloat(form.amount_paid_by_client) || 0)
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold">Vendor Balance Due</p>
                <p className="font-black text-lg text-amber-600">
                  {formatCurrency(
                    (parseFloat(form.total_vendor_cost) || 0) - (parseFloat(form.vendor_amount_paid) || 0)
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="col-span-2 flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                'Save Payment Record'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
