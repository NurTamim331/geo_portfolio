import type { Metadata } from 'next';
import { Plane, FileText, Compass, Moon, Building2, CheckCircle2, ArrowRight, ShieldCheck, PhoneCall } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Our Travel Services – GEO Trips',
  description: 'Full-service corporate and leisure travel: international & domestic flight ticketing, visa assistance, customized tour packages, Hajj & Umrah, and hotel bookings.',
};

const services = [
  {
    icon: Plane,
    title: 'Online Air Ticketing',
    tagline: 'Private GDS Systems & Airline Agent Rates',
    desc: 'Both international and domestic air ticketing. We query airline reservation engines directly to secure promotional classes and optimal transit routes on Singapore Airlines, Biman Bangladesh, Emirates, Qatar Airways, and Saudia.',
    benefits: [
      'Access to exclusive offline corporate seat blocks',
      'Immediate ticket re-issue and date change assistance',
      'Instant PNR confirmation and automated e-ticket delivery',
      'Domestic Bangladesh airfare discounts (Cox’s Bazar, Sylhet, Saidpur)',
    ],
    ctaText: 'Inquire Flight Fares',
    ctaLink: '/contact?service=flights',
    badge: 'Certified Agent',
  },
  {
    icon: FileText,
    title: 'Visa Submission Assistance',
    tagline: 'Accredited Pre-Screening & Document Notarization',
    desc: 'Complete consular submission support for Singapore, Thailand, Malaysia, China, Canada, and Australia. Our 25+ years of experience ensures zero rejections due to paperwork inaccuracies.',
    benefits: [
      'Pre-submission document verification and checklist clearance',
      'Official Bengali-to-English translation & legal notary support',
      'Housewife, student, and business-owner exemption guidance',
      'Corporate pickup desk for registered business clients inside Dhaka',
    ],
    ctaText: 'View Visa Checklists',
    ctaLink: '/visa',
    badge: '99.2% Approval',
  },
  {
    icon: Compass,
    title: 'Customized Tour Packages',
    tagline: 'Bespoke Itineraries & Transparent Itemized Costing',
    desc: 'From family vacations in Southeast Asia to executive corporate retreats, we formulate day-by-day itineraries detailing every activity, transfer, meal plan, and entry pass with complete costing transparency.',
    benefits: [
      'Detailed day-by-day itinerary document with transparent pricing',
      'Airport meet-and-greet transfers in private air-conditioned vehicles',
      'Theme park passes (Universal Studios, Sunway Lagoon, Safari World)',
      'Group travel management for delegations of 10 to 200+ members',
    ],
    ctaText: 'Plan a Custom Tour',
    ctaLink: '/trip-planner',
    badge: 'Popular',
  },
  {
    icon: Moon,
    title: 'Hajj & Umrah Packages',
    tagline: 'Dedicated Religious Pilgrim Logistics',
    desc: 'Complete spiritual journeys managed through established, vetted Saudi ground vendors. We provide proximate hotel accommodations near the Holy Mosques in Makkah and Madinah.',
    benefits: [
      'Accommodations in 3-Star, 4-Star, and 5-Star hotels near Haram',
      'Direct Saudia / Biman Bangladesh pilgrim flight schedules',
      'Full Ziyarah tour excursions with experienced religious guides',
      'Executive private transport between Jeddah, Makkah, and Madinah',
    ],
    ctaText: 'Request Umrah Quote',
    ctaLink: '/contact?service=umrah',
    badge: 'Spiritual',
  },
  {
    icon: Building2,
    title: 'Global Hotel Reservations',
    tagline: 'Worldwide Accommodations Tailored to Your Budget',
    desc: 'Tell us your destination, required star rating, and budget filters. We search B2B consolidator inventories worldwide and reserve confirmed hotel rooms with zero hidden booking surcharges.',
    benefits: [
      'Direct vouchers with hotel confirmation numbers',
      'Complimentary breakfast and late check-out arrangements',
      'Family-friendly interconnecting room setups',
      'Convenient central locations close to transit hubs and attractions',
    ],
    ctaText: 'Search Hotels',
    ctaLink: '/contact?service=hotels',
    badge: 'Worldwide',
  },
];

export default function ServicesPage() {
  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-amber-700 tracking-widest uppercase bg-amber-500/10 border border-amber-400/30 px-3.5 py-1.5 rounded-full">
          Comprehensive Travel Solutions
        </span>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-brand-dark tracking-tight">
          Services Backed by <span className="text-gradient-logo">25+ Years of Trust</span>
        </h1>
        <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
          GEO Trips pairs corporate precision with personalized human attention. Review our dedicated travel divisions below.
        </p>
      </div>

      {/* Services List */}
      <div className="space-y-10">
        {services.map((service, idx) => {
          const Icon = service.icon;
          const isReversed = idx % 2 === 1;

          return (
            <div
              key={service.title}
              className={`bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12 flex flex-col ${
                isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
              } items-center justify-between gap-10 hover:shadow-xl transition-all duration-300`}
            >
              {/* Text content */}
              <div className="space-y-6 flex-1">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold uppercase px-3 py-1 bg-brand-blue-50 text-brand-blue-700 rounded-full border border-brand-blue-100">
                      {service.badge}
                    </span>
                  </div>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-brand-dark">
                    {service.title}
                  </h2>
                  <p className="text-xs sm:text-sm font-bold text-brand-royal tracking-wide">
                    {service.tagline}
                  </p>
                </div>

                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {service.desc}
                </p>

                {/* Benefits */}
                <div className="space-y-2.5 pt-2">
                  {service.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                      <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Link
                    href={service.ctaLink}
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-dark hover:bg-brand-royal text-white font-extrabold text-sm rounded-xl transition shadow-md"
                  >
                    <span>{service.ctaText}</span>
                    <ArrowRight className="h-4 w-4 text-amber-400" />
                  </Link>
                </div>
              </div>

              {/* Visual Card Side */}
              <div className="w-full lg:w-96 bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl border border-gray-100 p-8 flex flex-col items-center text-center space-y-4 shrink-0">
                <div className="w-16 h-16 bg-white shadow-md text-brand-royal rounded-2xl flex items-center justify-center">
                  <Icon className="h-8 w-8 text-brand-royal" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-dark text-lg">{service.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">Official Authorized Desk</p>
                </div>
                <div className="w-full pt-4 border-t border-gray-200/60 text-xs text-gray-600 space-y-1 text-left">
                  <div className="flex justify-between">
                    <span>Consultant:</span>
                    <strong className="text-brand-dark">Md Mesbah Uddin</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Turnaround:</span>
                    <span className="font-semibold text-emerald-600">Same-Day Processing</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="bg-royal-gradient rounded-3xl p-8 sm:p-12 text-white border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <h2 className="font-display font-black text-2xl text-white">Need a custom travel arrangement?</h2>
          <p className="text-gray-300 text-sm max-w-xl">
            We handle complex multi-city flight connections, business delegations, and urgent corporate visas.
          </p>
        </div>
        <a
          href="tel:+8801913389573"
          className="px-8 py-4 bg-amber-400 hover:bg-amber-500 text-brand-dark font-extrabold text-sm rounded-xl transition shadow-lg shrink-0 flex items-center gap-2 shadow-amber-400/20"
        >
          <PhoneCall className="h-4 w-4" />
          <span>Call Desk: +880 1913-389573</span>
        </a>
      </div>
    </div>
  );
}
