import { TripPlannerWizard } from '@/components/trip-planner/TripPlannerWizard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive Trip Planner – GEO Trips',
  description: 'Plan your dream journey with GEO Trips. Get an instant rough estimate for international flights, curated tours, hotels, and expert visa assistance.',
};

export default function TripPlannerPage() {
  return (
    <div className="min-h-screen bg-[#03082a] py-16 sm:py-24 relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,_#0104c3_0%,_#03082a_75%,_#02051c_100%)] pointer-events-none" />
      <div className="absolute top-1/4 right-5 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-5 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 tracking-widest uppercase bg-amber-500/15 border border-amber-400/30 px-4 py-1.5 rounded-full mb-4 shadow-sm">
            ✨ 1 Stop Multiple Service · Interactive Estimate
          </span>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            Design Your <span className="text-gradient-logo">Ideal Journey</span>
          </h1>
          <p className="text-sky-100/80 mt-4 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Answer 4 quick questions. Receive an immediate estimated price range, and let our 25-year travel consultants craft your personalized itinerary.
          </p>
        </div>

        <TripPlannerWizard />
      </div>
    </div>
  );
}
