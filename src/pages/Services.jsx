import React from 'react';
import { FileCheck2, Building2, Palmtree, Ticket, Hotel, MoonStar, CheckCircle, ArrowRight } from 'lucide-react';

export default function Services({ onNavigate }) {
  const services = [
    {
      icon: FileCheck2,
      title: 'Visa Processing Logistics',
      desc: 'Expert visa consulting, documentation review, and submission assistance for Singapore, Thailand, Malaysia, India, and more. Our 99% success rate minimizes consular rejection risks.',
      points: ['Official checklists matched', 'Document pre-screening', 'Consular submission support', 'Pick-up and delivery services']
    },
    {
      icon: Building2,
      title: 'Corporate Travel Management',
      desc: 'Tailored logistics for multinational corporations and local organizations. We handle flight advice, hotel setups, group retreats, conference MICE logistics, and monthly invoicing options.',
      points: ['Dedicated account manager', '24/7 emergency flight changes', 'Consolidated monthly invoicing', 'Custom group retreat itineraries']
    },
    {
      icon: Palmtree,
      title: 'Customized Holiday Packages',
      desc: 'Bespoke leisure trip itineraries for families, honeymoons, and friendship groups. We design land-packages containing ground transport, vetted hotel stays, and verified tour guides.',
      points: ['Tailored sightseeing routes', 'Private airport transfers', 'Vetted family-friendly hotels', 'No rigid group schedules']
    },
    {
      icon: Ticket,
      title: 'Air Ticketing Advisory',
      desc: 'Strategic routing advice to minimize layovers and optimize budgets. We coordinate group flight tickets, business/first-class upgrades, seat blockings, and date modifications.',
      points: ['Optimal route planning', 'Multi-sector booking support', 'Group seat block bookings', 'Priority baggage coordination']
    },
    {
      icon: Hotel,
      title: 'Premium Hotel Sourcing',
      desc: 'Vetted accommodation options selected for security, geographic location, and business amenities. We coordinate check-in verification and direct payment settlements.',
      points: ['Secure locations verified', 'Executive lounge access rooms', 'Direct corporate billing setups', 'Complimentary airport shuttles']
    },
    {
      icon: MoonStar,
      title: 'Umrah & Religious Journeys',
      desc: 'Comprehensive custom Umrah travel arrangements for families and corporate groups, including Makkah and Madinah hotel blocks, transportation, and visa processing.',
      points: ['Vetted hotels close to Harams', 'Private VIP transport setups', 'Custom itinerary customization', 'Experienced guide coordination']
    }
  ];

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-brand-green-600 tracking-widest uppercase bg-brand-green-500/10 px-3.5 py-1.5 rounded-full">
          Our Expert Services
        </span>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-brand-dark tracking-tight">
          Comprehensive Travel & <span className="text-brand-green-500">Logistics Advisory</span>
        </h1>
        <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
          At GEO Trips, we do not host automated search systems. Every request is reviewed by a professional travel advisor to ensure accuracy and eliminate booking headaches.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((srv, idx) => {
          const Icon = srv.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:shadow-xl transition duration-300 flex flex-col justify-between">
              <div className="space-y-5">
                <div className="p-3 bg-brand-blue-50 text-brand-blue-600 rounded-xl w-fit">
                  <Icon className="h-6 w-6" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-display font-extrabold text-xl text-brand-dark">
                    {srv.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {srv.desc}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  {srv.points.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-50">
                <button
                  onClick={() => onNavigate('contact')}
                  className="w-full py-2.5 px-4 bg-slate-50 hover:bg-brand-blue-600 hover:text-white rounded-xl text-xs font-bold text-gray-700 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Inquire About Service</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact Banner */}
      <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-gray-100 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-2 text-center lg:text-left">
          <h3 className="font-display font-black text-2xl text-brand-dark">
            Need a fully customized solution?
          </h3>
          <p className="text-gray-500 text-sm max-w-xl">
            Tell us about your trip parameters (budget, travel timeline, hotel classes) and we will send a comprehensive proposals dossier in 24 hours.
          </p>
        </div>
        
        <button
          onClick={() => onNavigate('contact')}
          className="w-full lg:w-auto px-8 py-3.5 bg-brand-blue-600 hover:bg-brand-blue-700 text-white font-extrabold text-sm rounded-xl shadow-md transition cursor-pointer"
        >
          Send Customized Request
        </button>
      </div>

    </div>
  );
}
