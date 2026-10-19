import type { Metadata } from 'next';
import './globals.css';
import { SiteChrome } from '@/components/layout/SiteChrome';

export const metadata: Metadata = {
  title: {
    default: 'GEO Trips – Premium Corporate Travel & Visa Consultation',
    template: '%s | GEO Trips',
  },
  description:
    'GEO Trips: 25+ years of trusted corporate travel management, international flight ticketing, visa assistance, tour packages, and Hajj & Umrah services in Dhaka, Bangladesh.',
  keywords: [
    'travel agency dhaka',
    'visa assistance bangladesh',
    'singapore visa bangladesh',
    'thailand visa dhaka',
    'tour packages bangladesh',
    'hajj umrah package',
    'international flight tickets',
    'geo trips',
  ],
  openGraph: {
    siteName: 'GEO Trips',
    type: 'website',
    locale: 'en_BD',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-800 selection:bg-amber-400 selection:text-slate-950">
        <SiteChrome>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
