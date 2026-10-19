import Link from 'next/link';
import { CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { CountryFlag } from '@/components/ui/CountryFlag';

const visas = [
  { code: 'singapore', country: 'Singapore', fee: '7,000 BDT', time: '10 days', tag: 'Popular' },
  { code: 'thailand', country: 'Thailand', fee: '7,000 BDT', time: '7 days', tag: 'Fast' },
  { code: 'malaysia', country: 'Malaysia', fee: '5,500 BDT', time: '4 days', tag: 'Affordable' },
  { code: 'china', country: 'China', fee: 'Dynamic', time: '12–20 days', tag: 'Contact Us' },
  { code: 'canada', country: 'Canada', fee: '10,000 BDT', time: 'Embassy timeline', tag: 'Premium' },
  { code: 'australia', country: 'Australia', fee: '10,000 BDT', time: 'Embassy timeline', tag: 'Premium' },
];

export function VisaQuickView() {
  return (
    <section className="bg-gradient-to-b from-slate-50 to-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16 reveal-fade">
          <span className="text-xs font-bold text-brand-blue-600 tracking-widest uppercase bg-brand-blue-50 px-3.5 py-1.5 rounded-full">
            Visa Services
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900">
            Visa Processing at a Glance
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto text-base">
            Expert documentation support for multiple countries. Check requirements and apply through GEO Trips.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visas.map((visa) => (
            <div
              key={visa.country}
              className="reveal-up bg-white rounded-3xl p-6 border border-gray-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group flex flex-col justify-between"
            >
              <div>
                <span className="absolute top-5 right-5 text-[11px] font-bold bg-brand-blue-50 text-brand-blue-700 px-2.5 py-1 rounded-full border border-brand-blue-100">
                  {visa.tag}
                </span>

                <div className="mb-4">
                  <CountryFlag country={visa.code} size="lg" className="rounded-md shadow-xs" />
                </div>

                <h3 className="font-display font-black text-xl text-slate-900 group-hover:text-brand-blue-600 transition">
                  {visa.country}
                </h3>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Fee: <strong className="text-slate-900">{visa.fee}</strong></span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="h-4 w-4 text-brand-blue-600 shrink-0" />
                    <span>Processing: <strong className="text-slate-900">{visa.time}</strong></span>
                  </div>
                </div>
              </div>

              <Link
                href="/visa"
                className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#0104c3] hover:text-amber-600 transition"
              >
                <span>View Full Requirements</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition text-amber-500" />
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/visa"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:brightness-110 text-slate-950 font-black rounded-xl shadow-xl shadow-amber-500/20 transition"
          >
            <span>Explore All Embassy Requirements</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
