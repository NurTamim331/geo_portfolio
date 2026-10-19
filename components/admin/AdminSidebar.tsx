'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Compass, LayoutDashboard, Users, Briefcase, DollarSign,
  FileText, CheckSquare, Package, Bell, LogOut,
  ChevronLeft, ChevronRight, TrendingUp, Receipt, Globe
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { BrandLogo } from '@/components/ui/BrandLogo';
import Image from 'next/image';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/finance', label: 'Purchases & Ledger', icon: DollarSign },
  { href: '/admin/invoices', label: 'Invoice Generator', icon: FileText },
  { href: '/admin/receipts', label: 'Money Receipts', icon: Receipt },
  { href: '/admin/visa', label: 'Visa Requirements', icon: Globe },
  { href: '/admin/clients', label: 'CRM & Clients', icon: Users },
  { href: '/admin/bookings', label: 'Bookings & Leads', icon: Briefcase },
  { href: '/admin/verifications', label: 'Payment Inbox', icon: CheckSquare },
  { href: '/admin/vendors', label: 'Vendor Manager', icon: Package },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const supabase = createClient();

  const handleSignOut = async () => {
    try {
      await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
    } catch {}
    try {
      await supabase.auth.signOut();
    } catch {}
    router.push('/admin/login');
    router.refresh();
  };

  const isActive = (item: { href: string; exact?: boolean }) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <aside
      className={cn(
        'sidebar-transition bg-[#03082a] text-white flex flex-col min-h-screen sticky top-0 h-screen shrink-0 border-r border-sky-400/15 print:hidden',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header with Official Logo */}
      <div className={cn('p-4 border-b border-sky-400/10 flex flex-col items-center', collapsed && 'p-2')}>
        {collapsed ? (
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#0104c3] border border-sky-400/30 flex items-center justify-center p-0.5">
            <Image src="/logo.jpg" alt="GEO Trips" width={36} height={36} className="object-cover rounded-lg" />
          </div>
        ) : (
          <div className="w-full flex items-center justify-between">
            <BrandLogo size="sm" showTagline={false} />
            <span className="text-[10px] font-black text-amber-300 bg-amber-500/20 border border-amber-400/30 px-2 py-0.5 rounded-md uppercase tracking-wider">
              Admin
            </span>
          </div>
        )}
      </div>

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
                  ? 'bg-brand-gold-500/15 text-brand-gold-400 border border-brand-gold-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5',
                collapsed && 'justify-center'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
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
