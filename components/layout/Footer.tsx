import Link from 'next/link';
import { Compass, Phone, Mail, MapPin, MessageSquare, ExternalLink } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#03082a] text-white border-t border-sky-400/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand Column */}
          <div className="space-y-6">
            <BrandLogo size="lg" showTagline={false} />

            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                1 Stop Multiple Service
              </span>
              <p className="text-[11px] font-semibold text-sky-300 tracking-widest uppercase">
                Travel Agent
              </p>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed">
              Established in 2001, GEO Trips has been serving Bangladesh with premium corporate travel management, air ticketing, visa facilitation, and custom tour packages for over 25 years.
            </p>

            <div className="flex gap-3">
              <a
                href="https://wa.me/8801913389573"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-xl border border-emerald-500/30 transition shadow-sm"
                title="WhatsApp"
              >
                <MessageSquare className="h-5 w-5" />
              </a>
              <a
                href="tel:+8801913389573"
                className="p-3 bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-white rounded-xl border border-sky-400/30 transition shadow-sm"
                title="Phone"
              >
                <Phone className="h-5 w-5" />
              </a>
              <a
                href="mailto:geotrips19@gmail.com"
                className="p-3 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 rounded-xl border border-amber-400/30 transition shadow-sm"
                title="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-white">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', href: '/' },
                { label: 'About Us', href: '/about' },
                { label: 'Services', href: '/services' },
                { label: 'Visa Information', href: '/visa' },
                { label: 'Trip Planner', href: '/trip-planner' },
                { label: 'Gallery', href: '/gallery' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-amber-400 text-sm transition flex items-center gap-1.5"
                  >
                    <span className="text-amber-400">›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-white">Our Services</h3>
            <ul className="space-y-2.5 text-sm text-gray-300">
              {[
                'International Flight Tickets',
                'Domestic Flight Tickets',
                'Singapore Visa',
                'Thailand Visa',
                'Malaysia Visa',
                'China Visa',
                'Canada & Australia Visa',
                'Tour Packages',
                'Hotel Booking',
                'Hajj & Umrah Packages',
              ].map((service) => (
                <li key={service} className="flex items-center gap-2">
                  <span className="text-sky-400 font-bold">✓</span>
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-lg text-white">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <span className="text-gray-300 text-sm leading-relaxed">
                  154 C/A, Motijheel,<br />Dhaka-1000, Bangladesh
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-sky-400 shrink-0" />
                <div className="space-y-1">
                  <a href="tel:+8801913389573" className="block text-gray-300 hover:text-amber-400 text-sm transition font-medium">
                    +88 01913-389573
                  </a>
                  <a href="tel:+8801611204561" className="block text-gray-300 hover:text-amber-400 text-sm transition font-medium">
                    +88 01611-204561
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-amber-400 shrink-0" />
                <a
                  href="mailto:geotrips19@gmail.com"
                  className="text-gray-300 hover:text-amber-400 text-sm transition font-medium"
                >
                  geotrips19@gmail.com
                </a>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <p className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-2">Office Hours</p>
              <p className="text-sm text-gray-300">Saturday – Thursday<br />9:00 AM – 6:00 PM</p>
              <p className="text-xs text-gray-400 mt-2">Friday: Closed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-sky-400/10 bg-[#02051c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} GEO Trips. All rights reserved. | Proprietor: Md Mesbah Uddin
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Certified: Singapore Airlines</span>
            <span>·</span>
            <span>Certified: Bangladesh Biman</span>
            <span>·</span>
            <Link
              href="/admin/login"
              className="text-amber-400 hover:text-amber-300 font-semibold transition"
            >
              Staff &amp; Admin Desk
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
