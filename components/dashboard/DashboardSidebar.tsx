'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Compass, LayoutDashboard, User, Briefcase, Receipt, Upload, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import type { Profile } from '@/lib/supabase/types';
import { BrandLogo } from '@/components/ui/BrandLogo';
import Image from 'next/image';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/profile', label: 'My Profile', icon: User },
  { href: '/dashboard/trips', label: 'My Trips', icon: Briefcase },
  { href: '/dashboard/financials', label: 'Invoices & Dues', icon: Receipt },
  { href: '/dashboard/payments', label: 'Submit Payment', icon: Upload },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(data);
      }
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const isActive = (item: { href: string; exact?: boolean }) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <aside
      className={cn(
        'sidebar-transition bg-[#03082a] text-white flex flex-col min-h-screen sticky top-0 h-screen shrink-0 border-r border-sky-400/15',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Official Brand Logo */}
      <div className={cn('p-4 border-b border-sky-400/10 flex items-center justify-center', collapsed && 'p-2')}>
        {collapsed ? (
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#0104c3] border border-sky-400/30 flex items-center justify-center p-0.5">
            <Image src="/logo.jpg" alt="GEO Trips" width={36} height={36} className="object-cover rounded-lg" />
          </div>
        ) : (
          <BrandLogo size="sm" showTagline={false} />
        )}
      </div>

      {/* User Info */}
      {!collapsed && profile && (
        <div className="px-5 py-4 border-b border-white/10">
          <p className="text-xs text-sky-200/60 font-semibold uppercase tracking-wider mb-1">Signed in as</p>
          <p className="text-sm font-bold text-white truncate">{profile.full_name || profile.email}</p>
          <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Client</span>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition',
                active
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-400/30 shadow-sm'
                  : 'text-sky-100/70 hover:text-white hover:bg-white/5',
                collapsed && 'justify-center'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Sign Out + Collapse */}
      <div className="p-3 border-t border-white/10 space-y-2">
        <button
          onClick={handleSignOut}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 text-gray-600 hover:text-gray-400 transition"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  );
}
