import { createAdminClient } from '@/lib/supabase/admin';
import { requireAdmin } from '@/lib/auth/admin-auth';
import { formatDate, getStatusColor } from '@/lib/utils';
import { Briefcase, Calendar, Phone, Mail, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

export default async function AdminBookingsPage() {
  await requireAdmin();
  const supabase = createAdminClient();

  const [{ data: bookings }, { data: leads }] = await Promise.all([
    supabase
      .from('bookings')
      .select('*, profiles!bookings_client_id_fkey(full_name, email, phone)')
      .order('created_at', { ascending: false }),
    supabase
      .from('trip_leads')
      .select('*')
      .order('created_at', { ascending: false }),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-dark">
          Inquiry & Booking Manager
        </h1>
        <p className="text-gray-500 mt-1">
          Review incoming flight requests, visa files, and inbound website leads from the Interactive Trip Planner.
        </p>
      </div>

      {/* 1. Inbound Leads from Trip Planner Wizard */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-green-600" />
            <h2 className="font-display font-bold text-xl text-brand-dark">
              Trip Planner Inbound Leads ({leads?.length || 0})
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {leads && leads.length > 0 ? (
            leads.map((lead) => (
              <div key={lead.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4 hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display font-black text-lg text-brand-dark">{lead.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <a href={`tel:${lead.phone}`} className="hover:text-brand-blue-600 font-semibold text-brand-blue-600">
                        {lead.phone}
                      </a>
                      {lead.email && <span>· {lead.email}</span>}
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-3.5 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Destination:</span>
                    <strong className="text-brand-dark font-bold">{lead.destination}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Travelers:</span>
                    <span className="font-semibold text-gray-700">{lead.num_travelers} Person(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Budget:</span>
                    <span className="font-semibold text-gray-700">{lead.budget_range || 'Flexible'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Style:</span>
                    <span className="font-semibold text-gray-700 capitalize">{lead.trip_type?.replace('_', ' ') || 'General'}</span>
                  </div>
                </div>

                {lead.rough_estimate && (
                  <div className="text-xs p-2.5 bg-brand-green-50 rounded-lg text-brand-green-800 border border-brand-green-100">
                    <span className="font-bold block">Quoted Estimate:</span>
                    {lead.rough_estimate}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-400">
                  <span>Received: {formatDate(lead.created_at)}</span>
                  <a
                    href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-600 hover:underline"
                  >
                    Reply on WhatsApp →
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
              No new web leads received yet.
            </div>
          )}
        </div>
      </section>

      {/* 2. Formal Client Service Bookings */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-brand-blue-600" />
          <h2 className="font-display font-bold text-xl text-brand-dark">Active Client Orders & Bookings</h2>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase">Ref Code</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase">Client</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase">Category</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase">Details / Route</th>
                  <th className="px-5 py-3.5 text-center text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-gray-500 uppercase">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings && bookings.length > 0 ? (
                  bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-4 font-mono font-bold text-brand-blue-700 text-xs">
                        {b.reference_code}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-bold text-brand-dark text-sm">{b.profiles?.full_name || 'Client'}</p>
                        <p className="text-xs text-gray-400">{b.profiles?.phone || b.profiles?.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg uppercase">
                          {b.booking_type?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-600">
                        {b.visa_country && <span>Country: {b.visa_country}</span>}
                        {b.flight_route && <span>Route: {b.flight_route}</span>}
                        {b.flight_pnr && <span className="block text-brand-blue-600 font-mono">PNR: {b.flight_pnr}</span>}
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(b.status)}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-400">
                        {formatDate(b.created_at)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-400 text-sm">
                      No active bookings registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
