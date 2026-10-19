import type { Metadata } from 'next';
import { Camera, MapPin, Award } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Travel Gallery & Moments – GEO Trips',
  description: 'Explore destinations arranged by GEO Trips: Singapore, Malaysia, Thailand, China, Saudi Arabia, and corporate delegations.',
};

const destinations = [
  {
    title: 'Singapore Cityscape & Marina Bay',
    category: 'City Tour',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&auto=format&fit=crop&q=80',
    location: 'Singapore',
  },
  {
    title: 'Phi Phi Islands & Phuket Beach',
    category: 'Island Excursion',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&auto=format&fit=crop&q=80',
    location: 'Thailand',
  },
  {
    title: 'Petronas Twin Towers & Kuala Lumpur',
    category: 'Corporate & Leisure',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&auto=format&fit=crop&q=80',
    location: 'Malaysia',
  },
  {
    title: 'Holy Makkah & Kaaba Sanctity',
    category: 'Hajj & Umrah',
    image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&auto=format&fit=crop&q=80',
    location: 'Saudi Arabia',
  },
  {
    title: 'Sydney Opera House & Harbour',
    category: 'Australia Visa',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&auto=format&fit=crop&q=80',
    location: 'Australia',
  },
  {
    title: 'Banff National Park & Rocky Mountains',
    category: 'Canada Tourism',
    image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&auto=format&fit=crop&q=80',
    location: 'Canada',
  },
];

export default function GalleryPage() {
  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-amber-700 tracking-widest uppercase bg-amber-500/10 border border-amber-400/30 px-3.5 py-1.5 rounded-full">
          Global Portfolio
        </span>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-brand-dark tracking-tight">
          Destinations We <span className="text-gradient-logo">Connect You To</span>
        </h1>
        <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
          From the futuristic skylines of Singapore to holy sanctuaries in Makkah, GEO Trips has made international journeys effortless since 2001.
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {destinations.map((item, idx) => (
          <div
            key={idx}
            className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative h-64 overflow-hidden bg-slate-100">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-brand-dark/80 backdrop-blur-md text-white text-xs font-bold rounded-full">
                  {item.category}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-brand-royal font-bold">
                <MapPin className="h-3.5 w-3.5" />
                <span>{item.location}</span>
              </div>
              <h3 className="font-display font-bold text-lg text-brand-dark">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-8">
        <Link
          href="/trip-planner"
          className="inline-flex items-center gap-2 px-8 py-4 bg-amber-400 hover:bg-amber-500 text-brand-dark font-extrabold text-sm rounded-xl transition shadow-lg shadow-amber-400/20"
        >
          <span>Plan Your Trip to These Destinations</span>
        </Link>
      </div>
    </div>
  );
}
