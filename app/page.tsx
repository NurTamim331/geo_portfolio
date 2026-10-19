import { HeroSection } from '@/components/home/HeroSection';
import { StatsSection } from '@/components/home/StatsSection';
import { ServicesOverview } from '@/components/home/ServicesOverview';
import { VisaQuickView } from '@/components/home/VisaQuickView';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { TrustBadges } from '@/components/home/TrustBadges';
import { CallToAction } from '@/components/home/CallToAction';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GEO Trips – Premium Corporate Travel & Visa Consultation',
  description: '25+ years of trusted corporate travel management, international flight ticketing, visa assistance, and tour packages in Dhaka, Bangladesh.',
};

export default function HomePage() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <StatsSection />
      <ServicesOverview />
      <VisaQuickView />
      <TrustBadges />
      <TestimonialsSection />
      <CallToAction />
    </div>
  );
}
