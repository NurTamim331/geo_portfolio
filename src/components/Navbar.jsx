import React, { useState } from 'react';
import { Phone, MessageSquare, Menu, X, Compass } from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'services', label: 'Services' },
    { id: 'visa', label: 'Visa Info' },
    { id: 'why-choose-us', label: 'Why Us' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'testimonials', label: 'Reviews' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-50 bg-brand-dark/95 backdrop-blur-md text-white border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => handleNavClick('home')}>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-brand-green-500 to-brand-green-600 rounded-lg shadow-md">
                <Compass className="h-6 w-6 text-brand-dark" />
              </div>
              <div>
                <span className="font-display font-extrabold text-2xl tracking-wider text-white">
                  GEO<span className="text-brand-blue-500">TRIPS</span>
                </span>
                <span className="block text-[9px] uppercase tracking-widest text-gray-400 font-semibold leading-none">
                  Corporate Travel Services
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${activePage === item.id
                  ? 'text-brand-green-500 bg-white/5 border-b-2 border-brand-green-500'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Quick CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <a
              href="tel:+8801913389573"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-blue-600/20 hover:bg-brand-blue-600 border border-brand-blue-600/40 text-brand-blue-100 hover:text-white transition duration-200 text-sm font-semibold"
            >
              <Phone className="h-4 w-4" />
              <span className='flex justify-center items-center text-xs'>+880 1913389573</span>
            </a>
            <a
              href="https://wa.me/8801913389573"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-600/40 text-emerald-100 hover:text-white transition duration-200 text-sm font-semibold"
            >
              <MessageSquare className="h-4 w-4" />
              <span className='text-xs'>WhatsApp</span>
            </a>
          </div>

          {/* Hamburger Menu Button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-brand-dark-light border-b border-white/5">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full text-left px-4 py-3 rounded-md text-base font-semibold cursor-pointer ${activePage === item.id
                  ? 'text-brand-green-500 bg-brand-dark/50 border-l-4 border-brand-green-500'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
              >
                {item.label}
              </button>
            ))}

            {/* Mobile CTAs */}
            <div className="pt-4 pb-2 px-4 border-t border-white/10 grid grid-cols-2 gap-3">
              <a
                href="tel:+8801913389573"
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-blue-600 text-white font-semibold text-sm shadow-md"
              >
                <Phone className="h-4 w-4" />
                <span>Call Us</span>
              </a>
              <a
                href="https://wa.me/8801913389573"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold text-sm shadow-md"
              >
                <MessageSquare className="h-4 w-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
