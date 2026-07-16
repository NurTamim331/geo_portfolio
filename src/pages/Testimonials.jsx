import React from 'react';
import { Star, Quote, ShieldCheck, Users } from 'lucide-react';

export default function Testimonials({ onNavigate }) {
  const reviews = [
    {
      name: 'Rahat Chowdhury',
      role: 'Director of HR, Apex Apparel Group',
      type: 'Corporate Partner',
      text: 'Managing annual retreats for 150 employees was always a logistical nightmare. GEO Trips took over flight routes, hotel selections, and fast-tracked Thailand visas for our entire team. Exceptional execution.',
      stars: 5,
      date: 'March 2026'
    },
    {
      name: 'Dr. Sabrina Hasan',
      role: 'Associate Professor, DU',
      type: 'Family Tour Package',
      text: 'We planned a family trip to Singapore. GEO Trips advised us on the bank solvency specifications and MAT paper photos. Their attention to document details is why we got our e-visas in exactly 10 days.',
      stars: 5,
      date: 'April 2026'
    },
    {
      name: 'Fahim Muntasir',
      role: 'Student, National University',
      type: 'Student Travel Consulting',
      text: 'I was very confused about the student visa requirements for India. The officers at GEO Trips explained everything, helped check my tuition receipts and college ID. Process was stress-free.',
      stars: 5,
      date: 'June 2026'
    },
    {
      name: 'Nadia Rahman',
      role: 'Managing Partner, Zenith Tech Solutions',
      type: 'Corporate Travel Desk',
      text: 'For the past 4 years, our executives have flown exclusively through GEO Trips. Their emergency support desk resolved a midnight flight cancellation in Kuala Lumpur within 30 minutes. Absolutely dependable.',
      stars: 5,
      date: 'February 2026'
    },
    {
      name: 'Imtiaz Ahmed & Family',
      role: 'Retired Banker',
      type: 'Custom Leisure Tour',
      text: 'I wanted a slow, comfortable tour of Agra and Delhi. GEO Trips prepared a custom land package with a private driver and five-star hotels. They even handled our Indian visa files perfectly.',
      stars: 5,
      date: 'January 2026'
    },
    {
      name: 'Farhan Masud',
      role: 'Independent Tech Consultant',
      type: 'Frequent Visa Client',
      text: 'I process my Malaysia visas through GEO Trips multiple times a year. The 4-day turnaround is consistently met, and their courier pickup service saves me hours of sitting in traffic.',
      stars: 5,
      date: 'May 2026'
    }
  ];

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-brand-green-600 tracking-widest uppercase bg-brand-green-500/10 px-3.5 py-1.5 rounded-full">
          Client Reviews
        </span>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-brand-dark tracking-tight">
          What Our Travelers <span className="text-brand-green-500">Say About Us</span>
        </h1>
        <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
          Over 80% of our business volume comes from repeat clients and corporate referrals. Read about their experiences with us.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((rev, idx) => (
          <div 
            key={idx} 
            className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-xl transition duration-300 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Quote Icon */}
            <div className="absolute top-6 right-8 text-slate-100 pointer-events-none">
              <Quote className="h-16 w-16" />
            </div>

            <div className="space-y-5 relative z-10">
              
              {/* Stars */}
              <div className="flex gap-1 text-brand-green-500">
                {[...Array(rev.stars)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm text-gray-600 leading-relaxed italic">
                "{rev.text}"
              </p>

            </div>

            {/* Profile Info */}
            <div className="pt-6 mt-6 border-t border-gray-50 flex items-center justify-between">
              <div>
                <span className="block font-display font-extrabold text-sm sm:text-base text-brand-dark leading-tight">
                  {rev.name}
                </span>
                <span className="block text-[11px] font-bold text-gray-400 mt-0.5 uppercase tracking-wide">
                  {rev.role}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded bg-brand-blue-50 text-[10px] font-bold text-brand-blue-700 uppercase tracking-wider shrink-0">
                {rev.type.split(' ')[0]}
              </span>
            </div>

          </div>
        ))}
      </div>

      {/* Bottom corporate banner */}
      <div className="p-6 sm:p-10 bg-brand-dark text-white rounded-3xl border border-white/5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-brand-green-500 shrink-0" />
          <div>
            <h3 className="font-display font-bold text-lg text-white">Join 200+ Corporate Houses</h3>
            <p className="text-xs text-gray-400 mt-0.5">Let GEO Trips handle your corporate travel account for smooth ticketing, lodging, and visas.</p>
          </div>
        </div>
        
        <button
          onClick={() => onNavigate('contact')}
          className="w-full sm:w-auto px-6 py-3 bg-brand-green-500 hover:bg-brand-green-600 text-brand-dark font-extrabold text-sm rounded-xl transition shadow-md cursor-pointer shrink-0"
        >
          Open Corporate Account
        </button>
      </div>

    </div>
  );
}
