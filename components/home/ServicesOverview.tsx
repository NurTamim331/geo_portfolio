import Link from 'next/link';
import { Plane, FileText, Building2, Map, Moon, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: Plane,
    title: 'Air Ticketing',
    desc: 'International & domestic flight tickets with competitive pricing. We check private systems to find you the best fares.',
    color: 'text-blue-600 bg-blue-50',
    href: '/services',
  },
  {
    icon: FileText,
    title: 'Visa Assistance',
    desc: 'Expert visa processing for Singapore, Thailand, Malaysia, China, Canada, Australia with thorough documentation support.',
    color: 'text-emerald-600 bg-emerald-50',
    href: '/visa',
  },
  {
    icon: Map,
    title: 'Tour Packages',
    desc: 'Customizable tour packages with detailed itineraries, cost breakdowns, and vendor coordination for a seamless trip.',
    color: 'text-amber-600 bg-amber-50',
    href: '/services',
  },
  {
    icon: Moon,
    title: 'Hajj & Umrah',
    desc: 'Comprehensive Hajj and Umrah packages with dedicated vendors, spiritual journey planning, and full logistics support.',
    color: 'text-violet-600 bg-violet-50',
    href: '/services',
  },
  {
    icon: Building2,
    title: 'Hotel Booking',
    desc: 'Global hotel reservations. Tell us your filters, preferences, and budget — we find the perfect match and handle bookings.',
    color: 'text-teal-600 bg-teal-50',
    href: '/services',
  },
  {
    icon: FileText,
    title: 'Notices & Info',
    desc: 'Stay updated with the latest travel advisories, visa policy changes, and important announcements from GEO Trips.',
    color: 'text-rose-600 bg-rose-50',
    href: '/contact',
  },
];

export function ServicesOverview() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-4 mb-16 reveal-fade">
        <span className="text-xs font-bold text-amber-700 tracking-widest uppercase bg-amber-500/10 border border-amber-400/30 px-4 py-1.5 rounded-full shadow-xs">
          1 Stop Multiple Service
        </span>
        <h2 className="font-display font-black text-3xl sm:text-4xl text-brand-dark">
          Comprehensive Travel & Visa Solutions
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          From international flight tickets to complex visa processing and customized tours, GEO Trips manages your complete journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.title}
              className="reveal-up group bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`inline-flex p-3 rounded-xl ${service.color} mb-5`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-brand-dark mb-3">{service.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">{service.desc}</p>
              <Link
                href={service.href}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0104c3] hover:text-amber-500 transition"
              >
                Learn More <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
