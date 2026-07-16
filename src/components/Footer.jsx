import React from 'react';
import { Compass, Phone, Mail, MapPin, Clock, MessageSquare, ShieldCheck } from 'lucide-react';

export default function Footer({ setActivePage }) {
  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-dark text-gray-400 pt-16 pb-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavClick('home')}>
              <div className="p-2 bg-brand-green-500 rounded-lg">
                <Compass className="h-5 w-5 text-brand-dark" />
              </div>
              <span className="font-display font-extrabold text-xl tracking-wider text-white">
                GEO<span className="text-brand-green-500">TRIPS</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              With over 25 years of industry experience, GEO Trips is a trusted name in corporate travel management, visa consulting, and custom holiday tour packages in Bangladesh.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-green-500 font-semibold bg-white/5 p-3 rounded-lg border border-white/5 w-fit">
              <ShieldCheck className="h-4 w-4" />
              <span>Registered Travel Agency since 2001</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-display font-bold text-base mb-4 tracking-wide uppercase">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About Company' },
                { id: 'services', label: 'Our Services' },
                { id: 'why-choose-us', label: 'Why Choose Us' },
                { id: 'gallery', label: 'Photo Gallery' },
                { id: 'testimonials', label: 'Customer Reviews' }
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleNavClick(link.id)}
                    className="hover:text-brand-green-500 transition duration-200 cursor-pointer text-left"
                  >
                    &rarr; {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Visa Requirements Info */}
          <div>
            <h3 className="text-white font-display font-bold text-base mb-4 tracking-wide uppercase">
              Popular Visas
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'Singapore Visa', days: '10 Working Days' },
                { name: 'Thailand Visa', days: '7 Working Days' },
                { name: 'Malaysia Visa', days: '4 Working Days' },
                { name: 'India Visa', days: '12 Working Days' }
              ].map((visa, i) => (
                <li key={i}>
                  <button
                    onClick={() => handleNavClick('visa')}
                    className="hover:text-brand-green-500 transition duration-200 cursor-pointer text-left flex justify-between w-full"
                  >
                    <span>{visa.name}</span>
                    <span className="text-xs text-brand-green-500/80 italic">{visa.days}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-4">
            <h3 className="text-white font-display font-bold text-base mb-2 tracking-wide uppercase">
              Contact Office
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-brand-green-500 shrink-0 mt-0.5" />
                <span>
                  Suit #1204, Concord Tower,<br />
                  Kazi Nazrul Islam Avenue, Shahbagh,<br />
                  Dhaka - 1000, Bangladesh
                </span>
              </div>
              
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-brand-green-500" />
                <a href="tel:+8801712345678" className="hover:text-brand-green-500 transition duration-200">
                  +880 1712-345678
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-brand-green-500" />
                <a href="mailto:info@geotrips.com" className="hover:text-brand-green-500 transition duration-200">
                  info@geotrips.com
                </a>
              </div>

              <div className="flex items-center gap-2.5 pt-1.5 border-t border-white/5">
                <Clock className="h-4 w-4 text-brand-green-500 shrink-0" />
                <span>Sat - Thu: 9:00 AM - 6:00 PM <br /><span className="text-red-400 text-xs font-semibold">Friday: Closed</span></span>
              </div>
            </div>
          </div>

        </div>

        {/* Lower Banner */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div>
            <p>&copy; {new Date().getFullYear()} GEO Trips. All Rights Reserved.</p>
            <p className="mt-1 text-gray-500 max-w-md">
              Disclaimer: GEO Trips is an informational and business travel assistance agency. We do not support self-service bookings or online payment processing on this platform.
            </p>
          </div>
          
          <div className="flex gap-4">
            <a
              href="tel:+8801712345678"
              className="flex items-center gap-1 hover:text-brand-green-500 transition duration-200"
            >
              <Phone className="h-3 w-3" />
              <span>Call Support</span>
            </a>
            <a
              href="https://wa.me/8801712345678"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-brand-green-500 transition duration-200"
            >
              <MessageSquare className="h-3 w-3 text-emerald-500" />
              <span>WhatsApp Chat</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
