import React from 'react';
import { Award, CheckCircle, ShieldCheck, Compass, HeartHandshake, PhoneCall } from 'lucide-react';

export default function WhyChooseUs({ onNavigate }) {
  const benefits = [
    {
      title: '25+ Years of Proven History',
      desc: 'Established in 2001, we have navigated over two decades of global visa modifications, travel trends, and regulatory shifts, ensuring consistency for our clients.'
    },
    {
      title: '99.2% Visa Acceptance Record',
      desc: 'We do not submit application dossiers blindly. Our expert visa consulting officers pre-audit all financial records and support files to ensure maximum consulate compliance.'
    },
    {
      title: 'Dedicated Corporate Travel Desk',
      desc: 'Our business client desk manages scheduling, routing optimization, corporate discounts, and flexible invoicing, allowing your staff to focus on their core objectives.'
    },
    {
      title: 'Secure Document Courier Services',
      desc: 'No need to risk mailing passports. Our registered company messengers pick up and deliver critical travel files directly from corporate locations across Dhaka.'
    },
    {
      title: 'Vetted Destination Partner Network',
      desc: 'From ground transport operators in Bangkok to hotel managers in Singapore, our direct relations translate into premium room upgrades and reliable transfers.'
    },
    {
      title: 'Instant Human Accessibility',
      desc: 'We reject automated voice response units and chatbot loops. When you phone GEO Trips, a senior consultant answers to address your specific concern immediately.'
    }
  ];

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-brand-green-600 tracking-widest uppercase bg-brand-green-500/10 px-3.5 py-1.5 rounded-full">
          Why Choose Us
        </span>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-brand-dark tracking-tight">
          Redefining Professionalism in <span className="text-brand-green-500">Travel Planning</span>
        </h1>
        <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
          Discover why thousands of families and leading corporate houses trust GEO Trips with their business travels and visa processing needs.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Illustration text */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-4 bg-brand-blue-50 border border-brand-blue-100 rounded-3xl space-y-4">
            <div className="p-3 bg-brand-blue-600 text-white rounded-2xl w-fit">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="font-display font-extrabold text-xl text-brand-dark">
              A Personal Approach
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Consulates demand distinct evidence templates for students, corporate managers, families, and tourists. Our advisors understand these criteria and personalize your file format accordingly.
            </p>
          </div>

          <div className="p-4 bg-brand-green-50 border border-brand-green-100 rounded-3xl space-y-4">
            <div className="p-3 bg-brand-green-500 text-brand-dark rounded-2xl w-fit">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h3 className="font-display font-extrabold text-xl text-brand-dark">
              Built on Client Loyalty
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              We focus on building lasting relationships. By delivering transparent billing, accurate estimates, and flawless execution, our clients continue to return to us year after year.
            </p>
          </div>
        </div>

        {/* Right Side: Features Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                <h4 className="font-display font-bold text-sm sm:text-base text-brand-dark">
                  {benefit.title}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* Call to action */}
      <div className="bg-brand-dark text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden border border-white/5 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-brand-green-500/10 via-transparent to-transparent"></div>
        
        <h3 className="font-display font-black text-2xl sm:text-3xl text-white relative z-10">
          Experience the GEO Trips Difference Today
        </h3>
        <p className="text-gray-300 max-w-xl mx-auto text-sm sm:text-base leading-relaxed relative z-10">
          Connect with our senior partners directly on phone or WhatsApp, and let us handle your next travel itinerary or corporate visa file.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 pt-2">
          <a
            href="tel:+8801913389573"
            className="w-full sm:w-auto px-6 py-3.5 bg-brand-green-500 hover:bg-brand-green-600 text-brand-dark font-extrabold text-sm rounded-xl transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
          >
            <PhoneCall className="h-4.5 w-4.5" />
            <span>Call +880 1913-389573</span>
          </a>
          
          <button
            onClick={() => onNavigate('contact')}
            className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-xl border border-white/10 hover:border-white/20 transition cursor-pointer"
          >
            Request Corporate Presentation
          </button>
        </div>
      </div>

    </div>
  );
}
