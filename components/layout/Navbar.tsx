'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, MessageSquare, Menu, X, Compass, User, LayoutDashboard, LogOut, Shield } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import type { Profile } from '@/lib/supabase/types';

import { BrandLogo } from '@/components/ui/BrandLogo';

const navItems = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'about', label: 'About Us', href: '/about' },
  { id: 'services', label: 'Services', href: '/services' },
  { id: 'visa', label: 'Visa Info', href: '/visa' },
  { id: 'gallery', label: 'Gallery', href: '/gallery' },
  { id: 'faq', label: 'FAQ', href: '/faq' },
  { id: 'contact', label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<Profile | null>(null);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user: authUser } }) => {
      if (authUser) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();
        setUser(data);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser(data);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  };

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 text-white border-b transition-all duration-300',
        scrolled
          ? 'bg-[#03082a]/95 backdrop-blur-md border-sky-400/15 shadow-2xl shadow-blue-950/60'
          : 'bg-[#03082a] border-white/5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Official Logo */}
          <BrandLogo size="md" showTagline={true} />

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  'px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
                  isActive(item.href)
                    ? 'text-amber-400 bg-white/10 shadow-inner border border-amber-400/30'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <a
              href="tel:+8801913389573"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-sky-200 hover:text-white transition duration-200 text-sm font-semibold"
            >
              <Phone className="h-4 w-4 text-amber-400" />
              <span className="text-xs">+880 1913-389573</span>
            </a>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:brightness-110 font-bold transition text-sm shadow-md shadow-amber-500/20"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="text-xs">{user.role === 'admin' ? 'Admin Portal' : 'My Portal'}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:brightness-110 text-slate-950 font-black text-xs transition shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <User className="h-3.5 w-3.5" />
                  <span>Client Login</span>
                </Link>
                <Link
                  href="/admin/login"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-slate-900/90 hover:bg-slate-800 text-amber-400 border border-amber-400/30 text-xs font-bold transition shadow-xs cursor-pointer"
                  title="Staff & Admin Portal Login"
                >
                  <Shield className="h-3.5 w-3.5" />
                  <span className="hidden xl:inline text-[11px]">Admin</span>
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger */}
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-brand-dark-light border-b border-white/5">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'block w-full text-left px-4 py-3 rounded-md text-base font-semibold',
                  isActive(item.href)
                    ? 'text-amber-400 bg-white/10 border-l-4 border-amber-400'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                )}
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-4 pb-2 px-4 border-t border-white/10 grid grid-cols-2 gap-3">
              <a
                href="tel:+8801913389573"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-500/20 text-sky-200 border border-sky-400/30 font-bold text-sm shadow-md"
              >
                <Phone className="h-4 w-4 text-amber-400" />
                <span>Call Us</span>
              </a>
              <a
                href="https://wa.me/8801913389573"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md"
              >
                <MessageSquare className="h-4 w-4" />
                <span>WhatsApp</span>
              </a>
            </div>

            {user ? (
              <div className="px-4 py-2">
                <Link
                  href={user.role === 'admin' ? '/admin' : '/dashboard'}
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20"
                >
                  {user.role === 'admin' ? 'Admin Portal' : 'My Dashboard'}
                </Link>
              </div>
            ) : (
              <div className="px-4 py-2">
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/20"
                >
                  Client Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
