'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingCTAs } from '@/components/layout/FloatingCTAs';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <>
      {/* Top Banner */}
      <div className="bg-[#02051c] text-white text-[11px] py-2 px-4 border-b border-sky-400/10 relative z-50 hidden sm:block print:hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center font-semibold tracking-wide">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            GEO Trips: 1 Stop Multiple Service · Travel Agent · Trusted since 2001
          </span>
          <div className="flex items-center gap-4 text-amber-400 font-bold">
            <span>Hotline: +88 01913-389573</span>
            <span className="text-sky-200">Support: Sat – Thu (9AM – 6PM)</span>
          </div>
        </div>
      </div>

      <div className="print:hidden">
        <Navbar />
      </div>

      <main className="flex-grow">
        {children}
      </main>

      <div className="print:hidden">
        <Footer />
        <FloatingCTAs />
      </div>
    </>
  );
}
