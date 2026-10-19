import type { Metadata } from 'next';
import { Award, Shield, Users, Clock, Compass, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us – 25+ Years of Corporate Travel Trust | GEO Trips',
  description: 'Learn about GEO Trips and its founder Md Mesbah Uddin. Certified travel agent for Singapore Airlines and Bangladesh Biman with over 25 years of service in Dhaka.',
};

export default function AboutPage() {
  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero / Overview */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-amber-700 tracking-widest uppercase bg-amber-500/10 border border-amber-400/30 px-3.5 py-1.5 rounded-full">
          Our Heritage &amp; Mission
        </span>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-brand-dark tracking-tight">
          A Quarter Century of <span className="text-gradient-logo">Dependable Travel</span>
        </h1>
        <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
          GEO Trips was founded on a simple principle: global logistics should be transparent, accurate, and personally managed by experienced human specialists.
        </p>
      </div>

      {/* Main Profile Story */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-14 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-brand-royal uppercase tracking-widest">Leadership Profile</span>
            <h2 className="font-display font-black text-3xl text-brand-dark">
              Md Mesbah Uddin
            </h2>
            <p className="text-sm font-bold text-amber-600">
              Proprietor &amp; Chief Travel Consultant, GEO Trips
            </p>
          </div>

          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
            With over <strong>25 years</strong> of dedicated experience in Bangladesh’s commercial aviation and consular consulting sector, Md Mesbah Uddin has guided thousands of corporate executives, pilgrim families, and students across international borders.
          </p>

          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
            Under his leadership, GEO Trips has developed official accreditations and active agency relationships with premier global carriers, including <strong>Singapore Airlines</strong> and <strong>Biman Bangladesh Airlines</strong>.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="space-y-1">
              <span className="font-display font-black text-2xl text-brand-dark">2001</span>
              <p className="text-xs text-gray-500 font-semibold">Established in Dhaka</p>
            </div>
            <div className="space-y-1">
              <span className="font-display font-black text-2xl text-brand-royal">500+</span>
              <p className="text-xs text-gray-500 font-semibold">Satisfied Clients</p>
            </div>
            <div className="space-y-1">
              <span className="font-display font-black text-2xl text-amber-600">99.2%</span>
              <p className="text-xs text-gray-500 font-semibold">Visa Success Rate</p>
            </div>
          </div>
        </div>

        {/* Credentials Card */}
        <div className="lg:col-span-5 bg-royal-gradient text-white rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-300 rounded-xl">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">Accreditations</h3>
              <p className="text-xs text-gray-300">Certified Agency Credentials</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-bold">Singapore Airlines</strong>
                <span className="text-gray-300 text-xs">Certified ticketing agent &amp; corporate booking desk</span>
              </div>
            </div>

            <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-bold">Bangladesh Biman Airlines</strong>
                <span className="text-gray-300 text-xs">Accredited international &amp; domestic reservation partner</span>
              </div>
            </div>

            <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-bold">Motijheel Commercial Area</strong>
                <span className="text-gray-300 text-xs">Headquarters at 154 C/A, Motijheel, Dhaka-1000</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/contact"
              className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-brand-dark font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md hover:shadow-amber-400/20"
            >
              <span>Visit Our Motijheel Office</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-3">
          <div className="p-3 bg-blue-50 text-brand-royal rounded-xl w-fit">
            <Shield className="h-6 w-6" />
          </div>
          <h3 className="font-display font-bold text-xl text-brand-dark">Legitimacy &amp; Integrity</h3>
          <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
            Every booking is backed by genuine GDS airline records and stamped embassy vouchers. We never compromise on document authenticity.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-3">
          <div className="p-3 bg-sky-50 text-sky-600 rounded-xl w-fit">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="font-display font-bold text-xl text-brand-dark">Human Expertise</h3>
          <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
            Automated portals often overlook consular nuances like housewife exemptions or salary slip variances. We personally pre-screen each dossier.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit">
            <Clock className="h-6 w-6" />
          </div>
          <h3 className="font-display font-bold text-xl text-brand-dark">Speed &amp; Punctuality</h3>
          <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
            Flight price fluctuations can cost clients thousands. We lock in seat reservations promptly and submit visa files on the same working day.
          </p>
        </div>
      </div>
    </div>
  );
}
