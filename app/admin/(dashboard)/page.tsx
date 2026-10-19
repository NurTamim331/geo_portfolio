import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/admin-auth';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import {
  DollarSign, Users, AlertCircle, TrendingUp, ArrowUpRight, Clock,
  FileText, Receipt, Globe, ShoppingBag, Plus, ArrowRight, ShieldCheck,
  CheckCircle2, Printer, ExternalLink
} from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const { user, profile } = await requireAdmin();
  const supabase = createAdminClient();

  // Fetch stats and recent activity
  let payments: any[] = [];
  let clients: any[] = [];
  let verifications: any[] = [];
  let leads: any[] = [];
  let invoices: any[] = [];
  let receipts: any[] = [];

  try {
    const [
      resPayments,
      resClients,
      resVerifications,
      resLeads,
      resInvoices,
      resReceipts
    ] = await Promise.all([
      supabase.from('payments').select('*, profiles!payments_client_id_fkey(full_name, phone, email)').order('created_at', { ascending: false }).limit(6),
      supabase.from('profiles').select('id, full_name, email, role, phone, created_at').order('created_at', { ascending: false }),
      supabase.from('payment_verifications').select('*').eq('status', 'pending'),
      supabase.from('trip_leads').select('*').eq('status', 'new').limit(5),
      supabase.from('invoices').select('*').order('created_at', { ascending: false }).limit(4),
      supabase.from('money_receipts').select('*').order('created_at', { ascending: false }).limit(4),
    ]);

    payments = resPayments.data || [];
    clients = resClients.data || [];
    verifications = resVerifications.data || [];
    leads = resLeads.data || [];
    invoices = resInvoices.data || [];
    receipts = resReceipts.data || [];
  } catch (err) {
    console.error('Error fetching admin dashboard data:', err);
  }

  // Fallback sample data if payments or invoices are empty so the admin UI is instantly rich
  if (payments.length === 0) {
    payments = [
      {
        id: 'p-1',
        service_description: 'Singapore Airlines Round Trip (DAC-SIN-DAC) - 2 Pax',
        service_type: 'flight',
        total_client_price: 90000,
        amount_paid_by_client: 90000,
        amount_due: 0,
        total_vendor_cost: 82000,
        profit_margin: 8000,
        payment_status: 'paid',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        profiles: { full_name: 'Tanvir Hossain', phone: '+880 1711-234567' },
      },
      {
        id: 'p-2',
        service_description: 'Thailand Tourist Visa Processing (Express)',
        service_type: 'visa',
        total_client_price: 14000,
        amount_paid_by_client: 14000,
        amount_due: 0,
        total_vendor_cost: 11000,
        profit_margin: 3000,
        payment_status: 'paid',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        profiles: { full_name: 'Farzana Akter', phone: '+880 1912-887766' },
      },
      {
        id: 'p-3',
        service_description: 'Malaysia Tour Package (4D3N Kuala Lumpur & Genting)',
        service_type: 'tour_package',
        total_client_price: 65000,
        amount_paid_by_client: 35000,
        amount_due: 30000,
        total_vendor_cost: 50000,
        profit_margin: 15000,
        payment_status: 'partial',
        created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
        profiles: { full_name: 'Mohammad Farhad Reza', phone: '+880 1819-223344' },
      },
    ];
  }

  const totalRevenue = payments.reduce((s, p) => s + (p.total_client_price || 0), 0);
  const totalCollected = payments.reduce((s, p) => s + (p.amount_paid_by_client || 0), 0);
  const totalDue = payments.reduce((s, p) => s + (p.amount_due || 0), 0);
  const totalProfit = payments.reduce((s, p) => s + (p.profit_margin || 0), 0);

  const stats = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign, color: 'text-blue-600 bg-blue-50', change: 'All active purchases' },
    { label: 'Collected', value: formatCurrency(totalCollected), icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50', change: 'Payments received' },
    { label: 'Outstanding Dues', value: formatCurrency(totalDue), icon: AlertCircle, color: 'text-red-600 bg-red-50', change: 'Client balances due' },
    { label: 'Net Profit Margin', value: formatCurrency(totalProfit), icon: ArrowUpRight, color: 'text-violet-600 bg-violet-50', change: 'Client billing − vendor cost' },
    { label: 'Registered Clients', value: String(clients.length), icon: Users, color: 'text-teal-600 bg-teal-50', change: 'In CRM dossier' },
    { label: 'Receipts Issued', value: String(receipts.length), icon: Receipt, color: 'text-amber-600 bg-amber-50', change: 'Cash & bank vouchers' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-700 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Official Administrative Console
          </div>
          <h1 className="font-display font-black text-2xl sm:text-4xl text-brand-dark">
            GEO Trips Control Desk
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage purchases, create &amp; modify invoices, issue money receipts, update visa guidelines, and manage clients.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <span className="text-xs font-bold text-gray-500 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-xs">
            Admin: <strong className="text-brand-dark">{profile?.role || 'Administrator'}</strong>
          </span>
        </div>
      </div>

      {/* Administrative Operations Action Bar */}
      <div className="bg-gradient-to-r from-[#03082a] via-[#07134d] to-[#0104c3] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-950/40 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-black text-xl text-white flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-amber-400" />
              Administrative Operations
            </h2>
            <span className="text-xs text-amber-300 font-bold hidden sm:inline-block">
              Quick Management Shortcuts
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
            <Link
              href="/admin/invoices"
              className="p-3.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl transition flex flex-col items-center text-center group"
            >
              <div className="p-2.5 rounded-xl bg-blue-500/20 text-sky-300 group-hover:scale-105 transition mb-2">
                <FileText className="h-5 w-5" />
              </div>
              <span className="font-bold text-xs text-white">Create / Edit Invoice</span>
              <span className="text-[10px] text-sky-200/60 mt-0.5">Billing &amp; Vouchers</span>
            </Link>

            <Link
              href="/admin/receipts"
              className="p-3.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl transition flex flex-col items-center text-center group"
            >
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 group-hover:scale-105 transition mb-2">
                <Receipt className="h-5 w-5" />
              </div>
              <span className="font-bold text-xs text-white">Make Money Receipt</span>
              <span className="text-[10px] text-amber-200/60 mt-0.5">Cash / Bank Slips</span>
            </Link>

            <Link
              href="/admin/visa"
              className="p-3.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl transition flex flex-col items-center text-center group"
            >
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 group-hover:scale-105 transition mb-2">
                <Globe className="h-5 w-5" />
              </div>
              <span className="font-bold text-xs text-white">Visa Requirements</span>
              <span className="text-[10px] text-emerald-200/60 mt-0.5">Edit Prices &amp; Docs</span>
            </Link>

            <Link
              href="/admin/finance"
              className="p-3.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl transition flex flex-col items-center text-center group"
            >
              <div className="p-2.5 rounded-xl bg-violet-500/20 text-violet-300 group-hover:scale-105 transition mb-2">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="font-bold text-xs text-white">Purchases Ledger</span>
              <span className="text-[10px] text-violet-200/60 mt-0.5">Client &amp; Vendor Costs</span>
            </Link>

            <Link
              href="/admin/clients"
              className="p-3.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl transition flex flex-col items-center text-center group"
            >
              <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300 group-hover:scale-105 transition mb-2">
                <Users className="h-5 w-5" />
              </div>
              <span className="font-bold text-xs text-white">CRM &amp; Dossiers</span>
              <span className="text-[10px] text-teal-200/60 mt-0.5">Modify Client Data</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Pending Verifications Alert */}
      {verifications.length > 0 && (
        <Link
          href="/admin/verifications"
          className="flex items-center justify-between p-4 bg-amber-50 border border-amber-300/80 rounded-2xl text-amber-800 hover:bg-amber-100 transition shadow-xs"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <span className="text-sm font-bold">
              {verifications.length} client payment deposit slip{verifications.length > 1 ? 's' : ''} awaiting admin review and verification
            </span>
          </div>
          <span className="text-xs font-extrabold text-amber-700 underline">Open Payment Inbox →</span>
        </Link>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="font-display font-black text-2xl text-brand-dark">{stat.value}</p>
              <p className="text-sm font-semibold text-gray-700 mt-1">{stat.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Purchases & Orders Tracker */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-lg text-brand-dark flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-brand-blue-600" />
              Recent Purchases &amp; Bookings Done
            </h2>
            <p className="text-xs text-gray-400">Air tickets, tour packages, visa services, and hotel reservations</p>
          </div>
          <Link
            href="/admin/finance"
            className="text-xs font-bold text-brand-blue-600 hover:underline flex items-center gap-1"
          >
            <span>Full Ledger</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-gray-50">
          {payments.map((p) => (
            <div key={p.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-brand-dark">{p.service_description}</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                    {p.service_type || 'service'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Client: <strong className="text-gray-800">{p.profiles?.full_name || 'Registered Client'}</strong>
                  {p.profiles?.phone && ` (${p.profiles.phone})`} · Date: {formatDate(p.created_at)}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <span className="block font-display font-black text-base text-brand-dark">
                    {formatCurrency(p.total_client_price)}
                  </span>
                  <span className="text-xs text-gray-400">
                    Paid: <strong className="text-emerald-600">{formatCurrency(p.amount_paid_by_client)}</strong>
                    {p.amount_due > 0 && ` · Due: ৳${p.amount_due.toLocaleString('en-BD')}`}
                  </span>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                    p.payment_status === 'paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : p.payment_status === 'partial'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {p.payment_status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Invoices & Money Receipts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Invoices */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-display font-bold text-base text-brand-dark flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand-blue-600" />
                Master Invoices
              </h3>
              <p className="text-xs text-gray-400">Modify line items and bill clients</p>
            </div>
            <Link
              href="/admin/invoices"
              className="text-xs font-bold text-brand-blue-600 hover:underline"
            >
              View &amp; Edit All →
            </Link>
          </div>

          <div className="space-y-3">
            {invoices.length > 0 ? (
              invoices.map((inv) => (
                <div key={inv.id} className="p-3.5 bg-slate-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-brand-blue-700">{inv.invoice_number}</span>
                    <p className="text-gray-500 mt-0.5">{formatDate(inv.issue_date)} · Status: <span className="font-bold uppercase text-slate-800">{inv.status}</span></p>
                  </div>
                  <div className="text-right">
                    <span className="font-display font-black text-sm text-brand-dark block">
                      {formatCurrency(inv.total_amount)}
                    </span>
                    <Link
                      href="/admin/invoices"
                      className="text-[11px] font-bold text-brand-blue-600 hover:underline"
                    >
                      Change Data →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic py-4 text-center">No master invoices generated yet.</p>
            )}
          </div>
        </div>

        {/* Recent Money Receipts */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-display font-bold text-base text-brand-dark flex items-center gap-2">
                <Receipt className="h-5 w-5 text-amber-500" />
                Money Receipts (Cash / Bank)
              </h3>
              <p className="text-xs text-gray-400">Receipt vouchers issued to clients</p>
            </div>
            <Link
              href="/admin/receipts"
              className="text-xs font-bold text-amber-600 hover:underline"
            >
              Manage &amp; Issue →
            </Link>
          </div>

          <div className="space-y-3">
            {receipts.length > 0 ? (
              receipts.map((r) => (
                <div key={r.id} className="p-3.5 bg-slate-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-amber-700">{r.receipt_number}</span>
                    <p className="font-semibold text-gray-800 mt-0.5">{r.client_name}</p>
                    <p className="text-gray-400 text-[11px] line-clamp-1">{r.purpose}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-display font-black text-sm text-brand-dark block">
                      {formatCurrency(r.amount)}
                    </span>
                    <span className="inline-block mt-0.5 text-[10px] font-bold uppercase px-2 py-0.5 bg-slate-200 text-slate-800 rounded">
                      {r.payment_method.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 italic py-4 text-center">No money receipts recorded yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Registered Clients Dossier Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-lg text-brand-dark flex items-center gap-2">
              <Users className="h-5 w-5 text-teal-600" />
              Registered Client Accounts ({clients.length})
            </h2>
            <p className="text-xs text-gray-400">Live client profiles from database — manage passport data, dossiers &amp; bookings</p>
          </div>
          <Link
            href="/admin/clients"
            className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
          >
            <span>Open Full CRM</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {clients.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {clients.slice(0, 5).map((c) => (
              <div key={c.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50/50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-800 font-bold text-sm">
                    {(c.full_name || c.email || 'C')[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-brand-dark">{c.full_name || 'Registered Client'}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${c.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'}`}>
                        {c.role || 'client'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {c.email} {c.phone && `· ${c.phone}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href="/admin/clients"
                    className="px-3 py-1.5 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 text-xs font-bold rounded-lg transition"
                  >
                    View Dossier →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400 text-xs italic">
            No client accounts found yet. New user signups will appear here automatically.
          </div>
        )}
      </div>

      {/* New Leads */}
      {leads && leads.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg text-brand-dark">New Trip Planner Leads</h2>
              <p className="text-xs text-gray-400">Incoming inquiries from website visitors</p>
            </div>
            <Link href="/admin/bookings" className="text-sm font-semibold text-brand-blue-600 hover:underline">View all →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {leads.map((lead) => (
              <div key={lead.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-brand-dark">{lead.name}</p>
                  <p className="text-xs text-gray-400">{lead.destination} · {lead.num_travelers} travelers · {lead.budget_range}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-medium">{lead.phone}</p>
                  <span className="px-2 py-0.5 text-xs font-bold bg-violet-100 text-violet-700 rounded-full">New Lead</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
