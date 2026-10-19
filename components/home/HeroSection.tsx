import Link from 'next/link';
import { ArrowRight, Award, PhoneCall, Star, Play } from 'lucide-react';
import { CountryFlag } from '@/components/ui/CountryFlag';

const VISA_RATES = [
  { code: 'singapore', country: 'Singapore', fee: '7,000', time: '10 days' },
  { code: 'thailand', country: 'Thailand', fee: '7,000', time: '7 days' },
  { code: 'malaysia', country: 'Malaysia', fee: '5,500', time: '4 days' },
  { code: 'china', country: 'China', fee: 'Call for Quote', time: '12–20 days' },
  { code: 'canada', country: 'Canada', fee: '10,000', time: 'Embassy timeline' },
  { code: 'australia', country: 'Australia', fee: '10,000', time: 'Embassy timeline' },
];

export function HeroSection() {
  return (
    <section className="relative bg-[#03082a] overflow-hidden py-24 sm:py-36">
      {/* Background elements matched to official royal blue logo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,_#0104c3_0%,_#03082a_70%,_#02051c_100%)] pointer-events-none" />
      <div className="absolute top-1/4 right-5 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Official Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold tracking-wide uppercase shadow-sm">
              <Award className="h-4 w-4 text-amber-400 animate-pulse" />
              <span>1 Stop Multiple Service Travel Agent · 25+ Years Experience</span>
            </div>

            {/* Title */}
            <h1 className="font-display font-black text-4xl sm:text-5xl xl:text-6xl text-white leading-tight tracking-tight">
              Premium Worldwide
              <br />
              Travel &{' '}
              <span className="text-gradient-logo">Expert Visa</span>
              <br />
              Consultation
            </h1>

            {/* Description */}
            <p className="text-base sm:text-xl text-sky-100/90 font-medium leading-relaxed max-w-xl">
              GEO Trips provides high-end business travel logistics, family vacation tours, and dependable visa services with unmatched speed and accuracy. Real expert consultants, certified airline ticketing, and zero guesswork.
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8">
              {[
                { value: '25+', label: 'Years Experience' },
                { value: '500+', label: 'Happy Clients' },
                { value: '99.2%', label: 'Approval Rate' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display font-black text-3xl text-amber-400">{stat.value}</div>
                  <div className="text-xs text-sky-200 font-semibold uppercase tracking-wider mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/visa"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:brightness-110 text-slate-950 font-black text-base rounded-xl transition duration-200 shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Check Visa Requirements</span>
                <ArrowRight className="h-5 w-5" />
              </Link>

              <a
                href="tel:+8801913389573"
                className="w-full sm:w-auto px-8 py-4 bg-sky-500/15 hover:bg-sky-500/25 text-sky-100 font-bold text-base rounded-xl border border-sky-400/30 hover:border-sky-400/50 transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <PhoneCall className="h-5 w-5 text-amber-400" />
                <span>Call +880 1913-389573</span>
              </a>
            </div>
          </div>

          {/* Right: Info Card */}
          <div className="relative">
            <div className="animate-float">
              <div className="bg-[#07134d]/95 backdrop-blur-md border border-sky-400/25 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl shadow-blue-950/80">

                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="font-display font-bold text-lg text-white">Visa Processing Fees</h3>
                  <span className="text-xs bg-sky-500/20 text-sky-300 border border-sky-400/30 px-3 py-1 rounded-full font-bold">
                    Official BDT Rates
                  </span>
                </div>

                {/* Visa List */}
                <div className="space-y-3">
                  {VISA_RATES.map((visa) => (
                    <div
                      key={visa.country}
                      className="flex items-center justify-between p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition"
                    >
                      <div className="flex items-center gap-3">
                        <CountryFlag country={visa.code} size="md" />
                        <div>
                          <span className="block text-sm font-bold text-white">{visa.country}</span>
                          <span className="text-xs text-sky-200/80">Processing: {visa.time}</span>
                        </div>
                      </div>
                      <span className="text-sm font-display font-extrabold text-amber-400">
                        {visa.fee === 'Call for Quote' ? visa.fee : `৳${visa.fee}`}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href="/trip-planner"
                  className="block w-full text-center py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:brightness-110 text-slate-950 font-black text-sm rounded-xl transition shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  ✈️ Plan My Trip – Get a Free Estimate
                </Link>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 rounded-2xl px-4 py-3 shadow-xl">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs font-black mt-1">1 Stop Multiple Service</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
