'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency, formatDate, numberToWords, cn } from '@/lib/utils';
import type { Invoice, Payment, Profile, MoneyReceipt } from '@/lib/supabase/types';
import {
  FileText, Plus, Check, Trash2, Printer, Edit3, X,
  CheckCircle2, AlertCircle, Calendar, DollarSign, User,
  ListPlus, Receipt
} from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';

interface InvoiceGeneratorProps {
  clients: Profile[];
  unpaidPayments: (Payment & { profiles?: { full_name: string; email: string } | null })[];
  existingInvoices: Invoice[];
}

interface CustomItem {
  description: string;
  quantity: number;
  unit_price: number;
}

export function InvoiceGenerator({
  clients,
  unpaidPayments: initialPayments,
  existingInvoices: initialInvoices,
}: InvoiceGeneratorProps) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [creationMode, setCreationMode] = useState<'from_payments' | 'custom'>('custom');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedPaymentIds, setSelectedPaymentIds] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [discount, setDiscount] = useState('0');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Custom Items
  const [customItems, setCustomItems] = useState<CustomItem[]>([
    { description: 'International Air Ticket (DAC - SIN - DAC)', quantity: 1, unit_price: 45000 },
  ]);

  // Modals
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [activeInvoiceForPrint, setActiveInvoiceForPrint] = useState<Invoice | null>(null);
  const [editItems, setEditItems] = useState<CustomItem[]>([]);

  const supabase = createClient();

  // Filter payments belonging to selected client
  const clientPayments = initialPayments.filter((p) => p.client_id === selectedClientId);

  const togglePayment = (id: string) => {
    setSelectedPaymentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedPaymentsList = clientPayments.filter((p) => selectedPaymentIds.includes(p.id));

  const subtotal =
    creationMode === 'from_payments'
      ? selectedPaymentsList.reduce((acc, p) => acc + (p.total_client_price || 0), 0)
      : customItems.reduce((acc, item) => acc + (item.quantity * item.unit_price || 0), 0);

  const discountVal = parseFloat(discount) || 0;
  const totalAmount = Math.max(0, subtotal - discountVal);

  const handleCreateInvoice = async () => {
    if (!selectedClientId) {
      setError('Please select a client.');
      return;
    }
    if (creationMode === 'from_payments' && selectedPaymentIds.length === 0) {
      setError('Please select at least one service/payment to include.');
      return;
    }
    if (creationMode === 'custom' && (customItems.length === 0 || subtotal <= 0)) {
      setError('Please add at least one line item with a positive price.');
      return;
    }

    setIsGenerating(true);
    setError('');
    setSuccess('');

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const invoicePayload = {
        client_id: selectedClientId,
        generated_by: user?.id || null,
        subtotal,
        discount: discountVal,
        total_amount: totalAmount,
        amount_paid: 0,
        status: 'sent' as const,
        issue_date: issueDate,
        due_date: dueDate || null,
        notes: notes || null,
      };

      const { data: newInvoice, error: invError } = await supabase
        .from('invoices')
        .insert(invoicePayload)
        .select()
        .single();

      if (invError) {
        console.error('Invoice insert error:', invError);
        throw invError;
      }

      const invoiceId = newInvoice?.id || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
      const invoiceNumber = newInvoice?.invoice_number || `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Prepare line items
      const lineItems =
        creationMode === 'from_payments'
          ? selectedPaymentsList.map((p) => ({
              invoice_id: invoiceId,
              payment_id: p.id,
              description: p.service_description,
              quantity: 1,
              unit_price: p.total_client_price,
            }))
          : customItems.map((item) => ({
              invoice_id: invoiceId,
              payment_id: null,
              description: item.description,
              quantity: item.quantity,
              unit_price: item.unit_price,
            }));

      const { data: insertedItems, error: itemsError } = await supabase
        .from('invoice_items')
        .insert(lineItems as any)
        .select();

      if (itemsError) {
        console.error('Line items insert error:', itemsError);
      }

      const finalItems = (insertedItems && insertedItems.length > 0)
        ? insertedItems
        : lineItems.map((li, idx) => ({
            id: `item-${Date.now()}-${idx}`,
            invoice_id: invoiceId,
            payment_id: li.payment_id,
            description: li.description,
            quantity: li.quantity,
            unit_price: li.unit_price,
            total: li.quantity * li.unit_price,
          }));

      const createdInv: Invoice = {
        ...newInvoice,
        id: invoiceId,
        invoice_number: invoiceNumber,
        client_id: selectedClientId,
        generated_by: user?.id || null,
        subtotal,
        discount: discountVal,
        total_amount: totalAmount,
        amount_paid: 0,
        balance_due: totalAmount,
        status: 'sent',
        issue_date: issueDate,
        due_date: dueDate || null,
        notes: notes || null,
        currency: 'BDT',
        created_at: newInvoice?.created_at || new Date().toISOString(),
        updated_at: newInvoice?.updated_at || new Date().toISOString(),
        items: finalItems,
        money_receipts: [],
      };

      setInvoices([createdInv, ...invoices]);
      setSuccess(`Master Invoice ${createdInv.invoice_number} created successfully!`);
      // Immediately open the printable view so user can check and print the PDF!
      setActiveInvoiceForPrint(createdInv);

      setSelectedPaymentIds([]);
      setNotes('');
      setDiscount('0');
    } catch (err: any) {
      setError(err?.message || 'Failed to generate invoice.');
    } finally {
      setIsGenerating(false);
    }
  };

  const openEditModal = async (inv: Invoice) => {
    setEditingInvoice(JSON.parse(JSON.stringify(inv)));
    // Fetch items
    try {
      const { data: items } = await supabase
        .from('invoice_items')
        .select('*')
        .eq('invoice_id', inv.id);
      if (items && items.length > 0) {
        setEditItems(
          items.map((it) => ({
            description: it.description,
            quantity: it.quantity,
            unit_price: it.unit_price,
          }))
        );
      } else if (inv.items && inv.items.length > 0) {
        setEditItems(
          inv.items.map((it) => ({
            description: it.description,
            quantity: it.quantity,
            unit_price: it.unit_price,
          }))
        );
      } else {
        setEditItems([
          { description: 'Travel Services Package', quantity: 1, unit_price: inv.subtotal || inv.total_amount },
        ]);
      }
    } catch {
      if (inv.items && inv.items.length > 0) {
        setEditItems(
          inv.items.map((it) => ({
            description: it.description,
            quantity: it.quantity,
            unit_price: it.unit_price,
          }))
        );
      } else {
        setEditItems([
          { description: 'Travel Services Package', quantity: 1, unit_price: inv.subtotal || inv.total_amount },
        ]);
      }
    }
  };

  const handleUpdateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvoice) return;

    const newSubtotal = editItems.reduce((acc, it) => acc + (it.quantity * it.unit_price || 0), 0);
    const newTotal = Math.max(0, newSubtotal - (editingInvoice.discount || 0));
    const newPaid = editingInvoice.amount_paid || 0;
    const computedStatus: Invoice['status'] =
      newPaid >= newTotal && newTotal > 0
        ? 'paid'
        : newPaid > 0
        ? 'partial'
        : editingInvoice.status;

    try {
      await supabase
        .from('invoices')
        .update({
          invoice_number: editingInvoice.invoice_number,
          subtotal: newSubtotal,
          discount: editingInvoice.discount,
          total_amount: newTotal,
          amount_paid: editingInvoice.amount_paid,
          status: computedStatus,
          due_date: editingInvoice.due_date,
          issue_date: editingInvoice.issue_date,
          notes: editingInvoice.notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingInvoice.id);

      // Also sync invoice_items in Supabase
      try {
        await supabase.from('invoice_items').delete().eq('invoice_id', editingInvoice.id);
        if (editItems.length > 0) {
          await supabase.from('invoice_items').insert(
            editItems.map((item) => ({
              invoice_id: editingInvoice.id,
              description: item.description,
              quantity: item.quantity,
              unit_price: item.unit_price,
            })) as any
          );
        }
      } catch (itemErr) {
        console.error('Error syncing invoice items on update:', itemErr);
      }

      const updatedInv: Invoice = {
        ...editingInvoice,
        subtotal: newSubtotal,
        total_amount: newTotal,
        status: computedStatus,
        balance_due: Math.max(0, newTotal - newPaid),
        items: editItems.map((it, idx) => ({
          id: `edit-${Date.now()}-${idx}`,
          invoice_id: editingInvoice.id,
          payment_id: null,
          description: it.description,
          quantity: it.quantity,
          unit_price: it.unit_price,
          total: it.quantity * it.unit_price,
        })),
      };

      setInvoices(invoices.map((inv) => (inv.id === editingInvoice.id ? updatedInv : inv)));
      setSuccess(`Invoice ${editingInvoice.invoice_number} updated successfully!`);
      setEditingInvoice(null);
    } catch (err: any) {
      setError(err?.message || 'Error updating invoice');
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice? This cannot be undone.')) return;
    try {
      await supabase.from('invoices').delete().eq('id', id);
      setInvoices(invoices.filter((inv) => inv.id !== id));
      setSuccess('Invoice deleted successfully.');
    } catch (err: any) {
      setError(err?.message || 'Failed to delete invoice');
    }
  };

  const getClientName = (clientId: string) => {
    const c = clients.find((client) => client.id === clientId);
    return c?.full_name || 'Client';
  };

  const getClientDetails = (clientId: string) => {
    return clients.find((client) => client.id === clientId) || null;
  };

  return (
    <div className="space-y-10 print:space-y-0 print:m-0">
      {/* Top Banner Alert */}
      {error && <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm print:hidden">{error}</div>}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
          <span>{success}</span>
          {invoices.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveInvoiceForPrint(invoices[0])}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-black transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-sm"
            >
              <Printer className="h-4 w-4" />
              <span>View &amp; Print PDF Voucher</span>
            </button>
          )}
        </div>
      )}

      {/* Generator Tool */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-black text-xl text-brand-dark flex items-center gap-2">
              <FileText className="h-6 w-6 text-brand-blue-600" />
              Generate Unified Master Invoice
            </h2>
            <p className="text-gray-500 text-sm mt-0.5">
              Create official itemized billing vouchers combining air tickets, hotel vouchers, and consular fees.
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold self-start">
            <button
              type="button"
              onClick={() => setCreationMode('custom')}
              className={cn(
                'px-3.5 py-1.5 rounded-lg transition cursor-pointer',
                creationMode === 'custom' ? 'bg-white text-brand-dark shadow-xs' : 'text-gray-500 hover:text-gray-900'
              )}
            >
              Custom Direct Items
            </button>
            <button
              type="button"
              onClick={() => setCreationMode('from_payments')}
              className={cn(
                'px-3.5 py-1.5 rounded-lg transition cursor-pointer',
                creationMode === 'from_payments' ? 'bg-white text-brand-dark shadow-xs' : 'text-gray-500 hover:text-gray-900'
              )}
            >
              From Client Ledger
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Client Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Select Client *
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => {
                setSelectedClientId(e.target.value);
                setSelectedPaymentIds([]);
              }}
              className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-600 font-medium"
            >
              <option value="">-- Choose Registered Client --</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name || 'Unnamed'} ({c.email || c.phone || 'No Contact'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Invoice Date
            </label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Payment Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-600"
            />
          </div>
        </div>

        {/* Custom Items Mode */}
        {creationMode === 'custom' && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                Itemized Line Items (Flights, Visas, Hotels, Tours)
              </label>
              <button
                type="button"
                onClick={() =>
                  setCustomItems([
                    ...customItems,
                    { description: 'Service / Tour Item', quantity: 1, unit_price: 5000 },
                  ])
                }
                className="text-xs font-bold text-brand-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Item
              </button>
            </div>

            <div className="space-y-2">
              {customItems.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-gray-200">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => {
                      const updated = [...customItems];
                      updated[idx].description = e.target.value;
                      setCustomItems(updated);
                    }}
                    placeholder="Description of flight, hotel, or visa"
                    className="flex-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium"
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const updated = [...customItems];
                        updated[idx].quantity = parseInt(e.target.value) || 1;
                        setCustomItems(updated);
                      }}
                      className="w-16 px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-xs text-center"
                      title="Quantity"
                    />
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">৳</span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.unit_price}
                        onChange={(e) => {
                          const updated = [...customItems];
                          updated[idx].unit_price = parseFloat(e.target.value) || 0;
                          setCustomItems(updated);
                        }}
                        className="w-28 pl-6 pr-2 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold"
                        title="Unit Price"
                      />
                    </div>
                    <span className="text-xs font-black text-brand-dark min-w-[70px] text-right">
                      {formatCurrency(item.quantity * item.unit_price)}
                    </span>
                    {customItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setCustomItems(customItems.filter((_, i) => i !== idx))}
                        className="text-gray-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Client's Payments checklist */}
        {creationMode === 'from_payments' && selectedClientId && (
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Select Services / Payments to Merge into this Invoice ({clientPayments.length} Available)
            </label>

            {clientPayments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {clientPayments.map((p) => {
                  const isChecked = selectedPaymentIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => togglePayment(p.id)}
                      className={`p-4 rounded-xl border text-left transition flex items-start justify-between cursor-pointer ${
                        isChecked
                          ? 'bg-blue-50/70 border-brand-blue-600 ring-1 ring-brand-blue-600'
                          : 'bg-slate-50 border-gray-200 hover:bg-slate-100'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-sm text-brand-dark block">{p.service_description}</span>
                        <span className="text-xs text-gray-500 block mt-0.5">
                          Status: <strong className="capitalize">{p.payment_status}</strong> · Due:{' '}
                          {formatCurrency(p.amount_due)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-sm text-brand-dark block">
                          {formatCurrency(p.total_client_price)}
                        </span>
                        <span
                          className={`inline-block mt-2 h-5 w-5 rounded-full border text-center leading-5 text-xs ${
                            isChecked
                              ? 'bg-brand-blue-600 text-white border-brand-blue-600'
                              : 'border-gray-300'
                          }`}
                        >
                          {isChecked && '✓'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">No recorded ledger payments found for this client.</p>
            )}
          </div>
        )}

        {/* Pricing Summary */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-gray-500 font-medium block">Subtotal</span>
            <span className="text-base font-black text-brand-dark block mt-1">{formatCurrency(subtotal)}</span>
          </div>

          <div>
            <label className="text-gray-500 font-medium block">Discount (BDT)</label>
            <input
              type="number"
              min="0"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="mt-1 w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold"
            />
          </div>

          <div>
            <span className="text-gray-500 font-medium block">Total Invoice Amount (Balance Due)</span>
            <span className="text-lg font-black text-brand-blue-700 block mt-1">
              {formatCurrency(totalAmount)}
            </span>
            <span className="text-[10px] text-gray-500 block mt-0.5">
              * Payments are linked after generation via Money Receipts
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Invoice Notes / Bank Instructions
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Please deposit to City Bank A/C: 123456789 (GEO Trips Motijheel branch) or bKash 01913389573"
            className="w-full px-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-blue-600"
          />
        </div>

        <button
          type="button"
          onClick={handleCreateInvoice}
          disabled={isGenerating}
          className="px-8 py-3.5 bg-brand-blue-600 hover:bg-brand-blue-700 disabled:opacity-40 text-white font-extrabold text-sm rounded-xl transition shadow-lg flex items-center gap-2 cursor-pointer"
        >
          {isGenerating ? (
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <>
              <FileText className="h-4 w-4" />
              <span>Generate Unified Master Invoice</span>
            </>
          )}
        </button>
      </div>

      {/* Existing Invoices List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden print:hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-lg text-brand-dark">Master Invoice History</h3>
            <p className="text-xs text-gray-400">View, modify, or print issued billing statements</p>
          </div>
          <span className="text-xs font-semibold text-gray-400">{invoices.length} Invoices</span>
        </div>

        <div className="divide-y divide-gray-100">
          {invoices.length > 0 ? (
            invoices.map((inv) => (
              <div key={inv.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-brand-blue-700">{inv.invoice_number}</span>
                    <span
                      className={cn(
                        'text-xs px-2.5 py-0.5 rounded-full font-bold uppercase',
                        inv.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : inv.status === 'partial'
                          ? 'bg-blue-100 text-blue-800'
                          : inv.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-slate-100 text-slate-700'
                      )}
                    >
                      {inv.status}
                    </span>
                    <span className="text-xs font-semibold text-gray-700">
                      Client: {getClientName(inv.client_id)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Issued: {formatDate(inv.issue_date)} {inv.due_date && `· Due: ${formatDate(inv.due_date)}`}
                  </p>
                  {inv.notes && <p className="text-xs text-gray-400 mt-1 italic">&ldquo;{inv.notes}&rdquo;</p>}
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="block font-display font-black text-lg text-brand-dark">
                      {formatCurrency(inv.total_amount)}
                    </span>
                    <span className="text-xs text-gray-400">
                      Paid: {formatCurrency(inv.amount_paid)} · Due: {formatCurrency(inv.total_amount - inv.amount_paid)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(inv)}
                      className="p-2 text-slate-700 hover:text-brand-blue-600 bg-slate-50 hover:bg-blue-50 rounded-xl border border-gray-200 transition cursor-pointer"
                      title="Edit Invoice Data"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const [{ data: items }, { data: receipts }] = await Promise.all([
                            supabase.from('invoice_items').select('*').eq('invoice_id', inv.id),
                            supabase
                              .from('money_receipts')
                              .select('*')
                              .eq('invoice_id', inv.id)
                              .eq('status', 'valid')
                              .order('created_at', { ascending: true }),
                          ]);

                          const validReceipts = (receipts as MoneyReceipt[]) || [];
                          const totalPaidFromReceipts = validReceipts.reduce(
                            (sum, r) => sum + (Number(r.amount) || 0),
                            0
                          );
                          const finalPaid = validReceipts.length > 0 ? totalPaidFromReceipts : (inv.amount_paid || 0);

                          const invoiceWithDetails: Invoice = {
                            ...inv,
                            amount_paid: finalPaid,
                            balance_due: Math.max(0, inv.total_amount - finalPaid),
                            status:
                              finalPaid >= inv.total_amount && inv.total_amount > 0
                                ? 'paid'
                                : finalPaid > 0
                                ? 'partial'
                                : inv.status,
                            money_receipts: validReceipts,
                            items:
                              items && items.length > 0
                                ? items.map((it: any) => ({
                                    id: it.id,
                                    invoice_id: it.invoice_id,
                                    payment_id: it.payment_id,
                                    description: it.description,
                                    quantity: it.quantity,
                                    unit_price: it.unit_price,
                                    total: it.total || it.quantity * it.unit_price,
                                  }))
                                : inv.items && inv.items.length > 0
                                ? inv.items
                                : [],
                          };

                          setInvoices((prev) =>
                            prev.map((item) => (item.id === inv.id ? invoiceWithDetails : item))
                          );
                          setActiveInvoiceForPrint(invoiceWithDetails);
                        } catch (err) {
                          console.error('Error fetching print invoice details:', err);
                          setActiveInvoiceForPrint(inv);
                        }
                      }}
                      className="p-2 text-slate-700 hover:text-brand-blue-600 bg-slate-50 hover:bg-blue-50 rounded-xl border border-gray-200 transition cursor-pointer"
                      title="Print / PDF Voucher"
                    >
                      <Printer className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteInvoice(inv.id)}
                      className="p-2 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition cursor-pointer"
                      title="Delete Invoice"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-gray-400 text-sm">
              No unified invoices generated yet.
            </div>
          )}
        </div>
      </div>

      {/* Edit Invoice Data Modal */}
      {editingInvoice && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 print:hidden">
          <div
            className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#03082a] via-[#07134d] to-[#0104c3] text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
                  Change Invoice Data
                </span>
                <h2 className="font-display font-black text-2xl text-white">
                  Edit Invoice {editingInvoice.invoice_number}
                </h2>
              </div>
              <button
                onClick={() => setEditingInvoice(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateInvoice} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    required
                    value={editingInvoice.invoice_number}
                    onChange={(e) => setEditingInvoice({ ...editingInvoice, invoice_number: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl font-mono font-bold text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={editingInvoice.status}
                    onChange={(e) => setEditingInvoice({ ...editingInvoice, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl font-bold text-gray-900 uppercase"
                  >
                    <option value="draft">Draft</option>
                    <option value="sent">Sent</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={editingInvoice.issue_date}
                    onChange={(e) => setEditingInvoice({ ...editingInvoice, issue_date: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={editingInvoice.due_date || ''}
                    onChange={(e) => setEditingInvoice({ ...editingInvoice, due_date: e.target.value || null })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Discount (BDT)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={editingInvoice.discount}
                    onChange={(e) => setEditingInvoice({ ...editingInvoice, discount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Amount Paid by Client (BDT)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={editingInvoice.amount_paid}
                    onChange={(e) => setEditingInvoice({ ...editingInvoice, amount_paid: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900 font-bold"
                  />
                </div>
              </div>

              {/* Line items in edit */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-700 uppercase tracking-wider">Line Items</span>
                  <button
                    type="button"
                    onClick={() => setEditItems([...editItems, { description: 'Item', quantity: 1, unit_price: 1000 }])}
                    className="text-xs font-bold text-brand-blue-600 hover:underline"
                  >
                    + Add Item
                  </button>
                </div>

                {editItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => {
                        const updated = [...editItems];
                        updated[idx].description = e.target.value;
                        setEditItems(updated);
                      }}
                      className="flex-1 px-3 py-1.5 bg-slate-50 border border-gray-300 rounded-lg text-xs"
                    />
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const updated = [...editItems];
                        updated[idx].quantity = parseInt(e.target.value) || 1;
                        setEditItems(updated);
                      }}
                      className="w-16 px-2 py-1.5 bg-slate-50 border border-gray-300 rounded-lg text-xs text-center"
                    />
                    <input
                      type="number"
                      step="any"
                      value={item.unit_price}
                      onChange={(e) => {
                        const updated = [...editItems];
                        updated[idx].unit_price = parseFloat(e.target.value) || 0;
                        setEditItems(updated);
                      }}
                      className="w-24 px-2 py-1.5 bg-slate-50 border border-gray-300 rounded-lg text-xs text-right font-bold"
                    />
                    {editItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setEditItems(editItems.filter((_, i) => i !== idx))}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Payment Notes / Terms
                </label>
                <textarea
                  rows={2}
                  value={editingInvoice.notes || ''}
                  onChange={(e) => setEditingInvoice({ ...editingInvoice, notes: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-gray-300 rounded-xl text-gray-900"
                />
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingInvoice(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-black rounded-xl transition shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Save Invoice Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {activeInvoiceForPrint && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 print:static print:inset-auto print:z-auto print:p-0 print:bg-transparent print:backdrop-blur-none print:block">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-8 sm:p-12 shadow-2xl space-y-6 max-h-[95vh] overflow-y-auto print:max-h-none print:overflow-visible print:p-0 print:m-0 print:shadow-none print:rounded-none print:w-full print:max-w-none print:space-y-3.5">
            {/* Header Buttons */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-200 print:hidden">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Printable Master Invoice
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-5 py-2 bg-brand-blue-600 text-white rounded-xl text-xs font-black transition hover:bg-brand-blue-700 flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInvoiceForPrint(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-xl"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Invoice Printable View */}
            <div className="space-y-8 print:space-y-3 print:text-[11px] print:leading-tight print:px-2">
              <div className="flex justify-between items-start pb-6 border-b-2 border-slate-900 print:pb-2.5">
                <div>
                  <BrandLogo size="md" showTagline={false} />
                  <p className="text-xs print:text-[10px] font-bold text-amber-600 tracking-wider uppercase mt-2 print:mt-1">
                    1 Stop Multiple Service · Travel Agent
                  </p>
                  <p className="text-xs print:text-[10px] text-gray-600 mt-1 print:mt-0.5 print:leading-tight">
                    154 C/A, Motijheel, Dhaka-1000, Bangladesh<br />
                    Phone: +88 01913-389573, +88 01611-204561<br />
                    Email: geotrips19@gmail.com
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-display font-black text-2xl print:text-xl text-slate-900 block">
                    INVOICE
                  </span>
                  <span className="font-mono text-sm print:text-xs font-bold text-brand-blue-600 block mt-1 print:mt-0.5">
                    {activeInvoiceForPrint.invoice_number}
                  </span>
                  <span className="text-xs print:text-[10px] text-gray-500 block">
                    Issue Date: {formatDate(activeInvoiceForPrint.issue_date)}
                  </span>
                  {activeInvoiceForPrint.due_date && (
                    <span className="text-xs print:text-[10px] text-red-600 font-bold block">
                      Due Date: {formatDate(activeInvoiceForPrint.due_date)}
                    </span>
                  )}
                </div>
              </div>

              {/* Bill To */}
              <div className="bg-slate-50 p-4 print:p-2.5 rounded-xl border border-gray-200 flex justify-between print:break-inside-avoid">
                <div>
                  <span className="text-[10px] print:text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Billed To</span>
                  <p className="font-bold text-sm print:text-xs text-slate-900 mt-0.5">
                    {getClientName(activeInvoiceForPrint.client_id)}
                  </p>
                  {getClientDetails(activeInvoiceForPrint.client_id)?.phone && (
                    <p className="text-xs print:text-[10px] text-gray-600 mt-0.5">
                      Phone: {getClientDetails(activeInvoiceForPrint.client_id)?.phone}
                    </p>
                  )}
                  {getClientDetails(activeInvoiceForPrint.client_id)?.email && (
                    <p className="text-xs print:text-[10px] text-gray-600">
                      Email: {getClientDetails(activeInvoiceForPrint.client_id)?.email}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-[10px] print:text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Payment Status</span>
                  <span
                    className={cn(
                      'inline-block mt-1 font-extrabold text-xs print:text-[10px] uppercase px-3 py-1 print:px-2 print:py-0.5 rounded-md tracking-wider',
                      (activeInvoiceForPrint.amount_paid >= activeInvoiceForPrint.total_amount && activeInvoiceForPrint.total_amount > 0) || activeInvoiceForPrint.status === 'paid'
                        ? 'bg-emerald-600 text-white'
                        : activeInvoiceForPrint.amount_paid > 0 || activeInvoiceForPrint.status === 'partial'
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-900 text-amber-400'
                    )}
                  >
                    {(activeInvoiceForPrint.amount_paid >= activeInvoiceForPrint.total_amount && activeInvoiceForPrint.total_amount > 0) || activeInvoiceForPrint.status === 'paid'
                      ? 'PAID IN FULL'
                      : activeInvoiceForPrint.amount_paid > 0 || activeInvoiceForPrint.status === 'partial'
                      ? 'PARTIALLY PAID'
                      : 'UNPAID / DUE'}
                  </span>
                </div>
              </div>

              {/* Items summary */}
              <div className="space-y-2 print:space-y-1 print:break-inside-avoid">
                <table className="w-full text-xs print:text-[11px] text-left">
                  <thead>
                    <tr className="border-b-2 border-slate-900 text-slate-700 font-bold uppercase text-[11px] print:text-[10px]">
                      <th className="py-2.5 print:py-1">Description</th>
                      <th className="py-2.5 print:py-1 text-center w-16">Qty</th>
                      <th className="py-2.5 print:py-1 text-right w-28">Unit Price</th>
                      <th className="py-2.5 print:py-1 text-right w-32">Total (BDT)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {activeInvoiceForPrint.items && activeInvoiceForPrint.items.length > 0 ? (
                      activeInvoiceForPrint.items.map((it, i) => (
                        <tr key={i}>
                          <td className="py-2.5 print:py-1 font-medium text-slate-900">{it.description}</td>
                          <td className="py-2.5 print:py-1 text-center text-gray-600">{it.quantity}</td>
                          <td className="py-2.5 print:py-1 text-right text-gray-600">{formatCurrency(it.unit_price)}</td>
                          <td className="py-2.5 print:py-1 text-right font-bold text-slate-900">{formatCurrency(it.total || (it.quantity * it.unit_price))}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-2.5 print:py-1 font-medium text-slate-900">Travel Booking Services &amp; Air Ticketing Dossier</td>
                        <td className="py-2.5 print:py-1 text-center text-gray-600">1</td>
                        <td className="py-2.5 print:py-1 text-right text-gray-600">{formatCurrency(activeInvoiceForPrint.subtotal)}</td>
                        <td className="py-2.5 print:py-1 text-right font-bold text-slate-900">{formatCurrency(activeInvoiceForPrint.subtotal)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Linked Money Receipts / Payment History Breakdown */}
              {activeInvoiceForPrint.money_receipts && activeInvoiceForPrint.money_receipts.length > 0 && (
                <div className="space-y-1.5 print:space-y-1 pt-1 print:pt-0 print:break-inside-avoid">
                  <div className="flex items-center gap-1.5 text-xs print:text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                    <Receipt className="h-3.5 w-3.5 text-emerald-600 print:h-3 print:w-3" />
                    <span>Payment History &amp; Linked Money Receipts</span>
                  </div>
                  <table className="w-full text-xs print:text-[10px] text-left bg-slate-50/70 rounded-xl overflow-hidden border border-gray-200">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-gray-200 text-[11px] print:text-[9px] uppercase">
                        <th className="py-2 px-3 print:py-1 print:px-2">Payment Date</th>
                        <th className="py-2 px-3 print:py-1 print:px-2">Receipt No.</th>
                        <th className="py-2 px-3 print:py-1 print:px-2">Method &amp; Reference</th>
                        <th className="py-2 px-3 print:py-1 print:px-2 text-right">Amount Paid</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {activeInvoiceForPrint.money_receipts.map((rc, idx) => (
                        <tr key={rc.id || idx}>
                          <td className="py-2 px-3 print:py-1 print:px-2 font-medium text-slate-800">
                            {formatDate(rc.created_at || (rc as any).issue_date)}
                          </td>
                          <td className="py-2 px-3 print:py-1 print:px-2 font-mono font-bold text-brand-blue-700">
                            {rc.receipt_number}
                          </td>
                          <td className="py-2 px-3 print:py-1 print:px-2 text-gray-600">
                            <span className="capitalize font-semibold">{rc.payment_method.replace('_', ' ')}</span>
                            {rc.reference_number && (
                              <span className="text-gray-400 font-mono text-[11px] print:text-[9px] ml-1">
                                (Ref: {rc.reference_number})
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 print:py-1 print:px-2 text-right font-black text-emerald-700">
                            +{formatCurrency(rc.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Totals */}
              <div className="pt-4 print:pt-2 border-t border-gray-200 flex justify-end print:break-inside-avoid">
                <div className="w-72 print:w-64 space-y-2 print:space-y-1 text-xs print:text-[10px]">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-bold">{formatCurrency(activeInvoiceForPrint.subtotal)}</span>
                  </div>
                  {activeInvoiceForPrint.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount:</span>
                      <span>−{formatCurrency(activeInvoiceForPrint.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-900 font-black text-sm print:text-xs border-t border-slate-200 pt-1.5 print:pt-0.5">
                    <span>Total Invoice Amount:</span>
                    <span>{formatCurrency(activeInvoiceForPrint.total_amount)}</span>
                  </div>
                  {activeInvoiceForPrint.amount_paid > 0 ? (
                    <div className="flex justify-between text-emerald-700 bg-emerald-50 px-2.5 py-1 print:py-0.5 rounded-lg font-bold">
                      <span>Total Paid (via Receipts):</span>
                      <span>−{formatCurrency(activeInvoiceForPrint.amount_paid)}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-gray-500">
                      <span>Total Paid (via Receipts):</span>
                      <span className="font-bold">{formatCurrency(0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-brand-blue-700 font-black text-base print:text-xs border-t-2 border-slate-900 pt-1.5 print:pt-0.5">
                    <span>Net Balance Due:</span>
                    <span>
                      {formatCurrency(Math.max(0, activeInvoiceForPrint.total_amount - (activeInvoiceForPrint.amount_paid || 0)))}
                    </span>
                  </div>
                </div>
              </div>

              {/* In Words */}
              <div className="p-3 print:p-2 bg-slate-50 rounded-xl text-xs print:text-[10px] space-y-1 print:break-inside-avoid">
                <div>
                  <span className="font-bold text-gray-500 block uppercase text-[10px] print:text-[9px]">Total In Words</span>
                  <span className="font-bold text-slate-900 italic mt-0.5 block">
                    {numberToWords(activeInvoiceForPrint.total_amount)}
                  </span>
                </div>
                {activeInvoiceForPrint.amount_paid > 0 && (activeInvoiceForPrint.total_amount - (activeInvoiceForPrint.amount_paid || 0)) > 0 && (
                  <div className="pt-1 border-t border-gray-200">
                    <span className="font-bold text-gray-500 block uppercase text-[10px] print:text-[9px]">Net Balance Due In Words</span>
                    <span className="font-bold text-brand-blue-700 italic mt-0.5 block">
                      {numberToWords(activeInvoiceForPrint.total_amount - (activeInvoiceForPrint.amount_paid || 0))}
                    </span>
                  </div>
                )}
              </div>

              {activeInvoiceForPrint.notes && (
                <p className="text-xs print:text-[10px] text-gray-500 italic p-3 print:p-2 bg-blue-50/50 rounded-xl border border-blue-100 print:break-inside-avoid">
                  <strong>Payment Notes:</strong> {activeInvoiceForPrint.notes}
                </p>
              )}

              {/* Signatures */}
              <div className="pt-8 print:pt-4 flex justify-between items-end text-xs print:text-[10px] text-gray-500 print:break-inside-avoid">
                <div className="text-center">
                  <div className="w-40 print:w-32 border-b border-gray-300 pb-1" />
                  <p className="mt-1">Client Signature</p>
                </div>
                <div className="text-center">
                  <div className="w-44 print:w-36 border-b-2 border-slate-900 pb-1 font-bold text-slate-900">
                    Md Mesbah Uddin
                  </div>
                  <p className="mt-1 font-bold text-slate-900">For GEO Trips</p>
                  <p className="text-[10px] print:text-[8px] text-gray-400">Authorized Signature</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
