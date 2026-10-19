import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { formatDate, getStatusColor } from '@/lib/utils';
import { Plane, FileText, Calendar, Compass, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default async function ClientTripsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false });

  // Separate bookings into categories
  const visaApplications = bookings?.filter((b) => b.booking_type === 'visa') || [];
  const flightBookings = bookings?.filter((b) => b.booking_type === 'flight') || [];
  const packageTours = bookings?.filter((b) => ['tour_package', 'hajj_umrah', 'hotel'].includes(b.booking_type || '')) || [];

  return (
    <div className="space-y-10 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-brand-dark">
            My Trips & Services
          </h1>
          <p className="text-gray-500 mt-1">
            Real-time status updates on your air tickets, visa submissions, and tour dossiers.
          </p>
        </div>

        <Link
          href="/trip-planner"
          className="px-5 py-2.5 bg-brand-green-500 hover:bg-brand-green-600 text-brand-dark font-extrabold text-xs sm:text-sm rounded-xl transition shadow-md flex items-center gap-2 self-start"
        >
          <Compass className="h-4 w-4" />
          <span>Plan New Trip</span>
        </Link>
      </div>

      {/* 1. Live Visa Applications */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-brand-blue-600" />
          <h2 className="font-display font-bold text-xl text-brand-dark">Visa Applications</h2>
        </div>

        {visaApplications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visaApplications.map((visa) => (
              <div key={visa.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-wider text-brand-blue-600">
                      Consular Dossier
                    </span>
                    <h3 className="font-display font-black text-xl text-brand-dark mt-0.5">
                      {visa.visa_country || 'Visa Application'}
                    </h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(visa.status)}`}>
                    {visa.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl text-gray-600">
                  <div>
                    <span className="text-gray-400 block">Tracking Code:</span>
                    <span className="font-mono font-bold text-brand-dark">{visa.reference_code}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Submitted:</span>
                    <span className="font-semibold text-gray-700">{formatDate(visa.visa_application_date || visa.created_at)}</span>
                  </div>
                  {visa.visa_approval_date && (
                    <div className="col-span-2">
                      <span className="text-gray-400 block">Approved On:</span>
                      <span className="font-semibold text-emerald-600">{formatDate(visa.visa_approval_date)}</span>
                    </div>
                  )}
                </div>

                {visa.admin_notes && (
                  <p className="text-xs text-gray-500 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                    <strong>Notice:</strong> {visa.admin_notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
            <p className="text-sm">No active visa submissions. Need a visa for Singapore, Thailand, or Malaysia?</p>
            <Link href="/visa" className="text-brand-blue-600 text-xs font-bold mt-2 inline-block hover:underline">
              Check Document Checklists →
            </Link>
          </div>
        )}
      </section>

      {/* 2. Air Tickets */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Plane className="h-5 w-5 text-brand-green-600" />
          <h2 className="font-display font-bold text-xl text-brand-dark">Air Tickets & Flights</h2>
        </div>

        {flightBookings.length > 0 ? (
          <div className="space-y-4">
            {flightBookings.map((flight) => (
              <div key={flight.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-display font-black text-lg text-brand-dark">
                      {flight.flight_route || 'Flight Route Pending'}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(flight.status)}`}>
                      {flight.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNR: <strong className="font-mono text-brand-blue-600">{flight.flight_pnr || 'Being Issued'}</strong> · Travelers: {flight.num_travelers}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-600 pt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      Departure: {formatDate(flight.flight_departure)}
                    </span>
                    {flight.flight_return && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        Return: {formatDate(flight.flight_return)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="block text-xs text-gray-400">Reference</span>
                  <span className="font-mono text-sm font-bold text-brand-dark">{flight.reference_code}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
            <p className="text-sm">No airline ticket bookings logged yet.</p>
          </div>
        )}
      </section>

      {/* 3. Tour & Hajj Packages */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-amber-600" />
          <h2 className="font-display font-bold text-xl text-brand-dark">Tour Packages & Accommodations</h2>
        </div>

        {packageTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packageTours.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-display font-bold text-lg text-brand-dark">
                    {pkg.booking_type === 'hajj_umrah' ? 'Hajj & Umrah Pilgrimage' : 'Curated Tour Package'}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(pkg.status)}`}>
                    {pkg.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Ref: <span className="font-mono">{pkg.reference_code}</span> · {pkg.num_travelers} Travelers
                </p>
                <div className="text-xs text-gray-600 pt-1">
                  Check-in / Start: {formatDate(pkg.check_in)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
            <p className="text-sm">No tour packages booked yet. Contact us for custom domestic or international itineraries.</p>
          </div>
        )}
      </section>
    </div>
  );
}
