import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { Briefcase, Receipt, AlertCircle, CheckCircle, Clock, TrendingUp } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const [{ data: profile }, { data: bookings }, { data: payments }, { data: invoices }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('bookings').select('*').eq('client_id', user.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('payments').select('*').eq('client_id', user.id),
    supabase.from('invoices').select('*').eq('client_id', user.id).order('created_at', { ascending: false }).limit(5),
  ]);

  const totalDue = payments?.reduce((sum, p) => sum + (p.amount_due || 0), 0) || 0;
  const totalPaid = payments?.reduce((sum, p) => sum + (p.amount_paid_by_client || 0), 0) || 0;
  const activeBookings = bookings?.filter(b => ['pending', 'confirmed', 'in_progress'].includes(b.status)).length || 0;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-dark">
          Welcome back, {profile?.full_name?.split(' ')[0] || 'Client'}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Here&apos;s an overview of your travel portfolio with GEO Trips.</p>
      </div>

      {/* Passport Warning */}
      {profile?.passport_expiry && (() => {
        const days = Math.ceil((new Date(profile.passport_expiry).getTime() - Date.now()) / 86400000);
        return days < 180 ? (
          <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700">
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold text-sm">Passport expiring soon!</p>
              <p className="text-sm mt-0.5">Your passport expires in {days} days ({formatDate(profile.passport_expiry)}). Many visas require 6+ months validity.</p>
            </div>
          </div>
        ) : null;
      })()}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-50 rounded-lg"><Briefcase className="h-5 w-5 text-blue-600" /></div>
            <span className="text-sm font-semibold text-gray-500">Active Services</span>
          </div>
          <p className="font-display font-black text-3xl text-brand-dark">{activeBookings}</p>
          <p className="text-xs text-gray-400 mt-1">Pending / In Progress</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-50 rounded-lg"><AlertCircle className="h-5 w-5 text-red-500" /></div>
            <span className="text-sm font-semibold text-gray-500">Amount Due</span>
          </div>
          <p className="font-display font-black text-3xl text-red-600">{formatCurrency(totalDue)}</p>
          <p className="text-xs text-gray-400 mt-1">Outstanding balance</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-50 rounded-lg"><TrendingUp className="h-5 w-5 text-emerald-600" /></div>
            <span className="text-sm font-semibold text-gray-500">Total Paid</span>
          </div>
          <p className="font-display font-black text-3xl text-emerald-600">{formatCurrency(totalPaid)}</p>
          <p className="text-xs text-gray-400 mt-1">All-time payments</p>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-brand-dark">Recent Services</h2>
          <a href="/dashboard/trips" className="text-sm font-semibold text-brand-blue-600 hover:underline">View all →</a>
        </div>
        <div className="divide-y divide-gray-50">
          {bookings && bookings.length > 0 ? bookings.map((booking) => (
            <div key={booking.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-brand-dark">
                  {booking.booking_type?.replace('_', ' ').toUpperCase() || 'Service'}
                  {booking.visa_country && ` – ${booking.visa_country}`}
                  {booking.flight_route && ` – ${booking.flight_route}`}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Ref: {booking.reference_code} · {formatDate(booking.created_at)}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(booking.status)}`}>
                {booking.status.replace('_', ' ')}
              </span>
            </div>
          )) : (
            <div className="px-6 py-10 text-center text-gray-400">
              <Briefcase className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No bookings yet. Contact us to get started!</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-brand-dark">Recent Invoices</h2>
          <a href="/dashboard/financials" className="text-sm font-semibold text-brand-blue-600 hover:underline">View all →</a>
        </div>
        <div className="divide-y divide-gray-50">
          {invoices && invoices.length > 0 ? invoices.map((invoice) => (
            <div key={invoice.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-brand-dark">{invoice.invoice_number}</p>
                <p className="text-xs text-gray-400 mt-0.5">Issued: {formatDate(invoice.issue_date)} · Due: {formatDate(invoice.due_date)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-brand-dark">{formatCurrency(invoice.total_amount)}</p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(invoice.status)}`}>
                  {invoice.status}
                </span>
              </div>
            </div>
          )) : (
            <div className="px-6 py-10 text-center text-gray-400">
              <Receipt className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No invoices yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
