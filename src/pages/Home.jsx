import React from 'react';
import { Shield, Award, Users, FileCheck, PhoneCall, ArrowRight, PlaneTakeoff, HelpCircle } from 'lucide-react';

export default function Home({ onNavigate, onApply }) {
  const stats = [
    { icon: Award, value: '25+', label: 'Years of Experience', desc: 'Serving Bangladesh since 2001' },
    { icon: FileCheck, value: '50K+', label: 'Visas Approved', desc: 'Singapore, Thailand, Malaysia, India' },
    { icon: Users, value: '200+', label: 'Corporate Partners', desc: 'Dedicated corporate desk' },
    { icon: Shield, value: '99.2%', label: 'Success Rate', desc: 'Highly professional documentation' }
  ];

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative bg-brand-dark overflow-hidden py-24 sm:py-32">
        {/* Visual Background Elements */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-green-500 via-transparent to-transparent"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-green-600/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            
            {/* Experience Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-green-500/10 border border-brand-green-500/30 text-brand-green-300 text-xs sm:text-sm font-bold tracking-wide uppercase">
              <Award className="h-4.5 w-4.5 text-brand-green-500 animate-pulse" />
              <span>Celebrating 25+ Years of Trust & Excellence</span>
            </div>

            {/* Title */}
            <h1 className="font-display font-black text-4xl sm:text-6xl text-white leading-tight tracking-tight">
              Premium Corporate Travel & <br />
              <span className="text-brand-green-500">Expert Visa Consultation</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-xl text-gray-300 font-medium leading-relaxed max-w-2xl mx-auto">
              GEO Trips provides high-end business travel logistics, family vacation tours, and dependable visa services with unmatched speed and accuracy. No automated chatbots—just real, expert support.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('visa')}
                className="w-full sm:w-auto px-8 py-4 bg-brand-green-500 hover:bg-brand-green-600 text-brand-dark font-extrabold text-base rounded-xl transition duration-200 shadow-lg hover:shadow-brand-green-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Check Visa Requirements</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <a
                href="tel:+8801913389573"
                className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold text-base rounded-xl border border-white/10 hover:border-white/20 transition duration-200 flex items-center justify-center gap-2"
              >
                <PhoneCall className="h-5 w-5 text-brand-green-500" />
                <span>Call +880 1913-389573</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100/50 flex items-start gap-4 transform hover:-translate-y-1 transition duration-300">
                <div className="p-3 bg-brand-blue-50 text-brand-blue-600 rounded-xl">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <span className="block font-display font-black text-3xl text-brand-dark leading-tight">
                    {stat.value}
                  </span>
                  <span className="block text-sm font-bold text-brand-blue-600 mt-0.5">
                    {stat.label}
                  </span>
                  <span className="block text-xs text-gray-500 mt-1 leading-snug">
                    {stat.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Welcome Introduction */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-brand-green-600 tracking-widest uppercase">
                Welcome to GEO Trips
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-brand-dark">
                Your Dependable Partner in Global Travel Logistics
              </h2>
            </div>
            
            <p className="text-gray-600 leading-relaxed">
              Established in 2001, GEO Trips has spent a quarter of a century refining corporate tour management, holiday planning, and visa consulting. We recognize that business operations require prompt turnarounds, absolute transparency, and impeccable documentation accuracy.
            </p>
            
            <p className="text-gray-600 leading-relaxed">
              Rather than attempting to be an automated online system, we focus on a highly customized model where every visa dossier is personally compiled by an expert associate, minimizing the likelihood of rejection.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('about')}
                className="px-6 py-3 bg-brand-blue-600 hover:bg-brand-blue-700 text-white rounded-xl font-bold text-sm transition cursor-pointer shadow-md"
              >
                Learn More About Us
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition cursor-pointer"
              >
                Request Callback
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-green-500 to-transparent opacity-10 rounded-2xl"></div>
            <div className="border border-gray-100 shadow-2xl rounded-2xl p-8 bg-white space-y-6">
              <div className="flex items-center gap-3">
                <PlaneTakeoff className="h-6 w-6 text-brand-green-600 shrink-0" />
                <h3 className="font-display font-bold text-lg text-brand-dark">
                  Direct Visas Processed
                </h3>
              </div>
              
              <div className="space-y-4">
                {[
                  { name: 'Singapore Visa', fee: '7,000 BDT', speed: '10 Days' },
                  { name: 'Thailand Tourist Visa', fee: '7,000 BDT', speed: '7 Days' },
                  { name: 'Malaysia Tour Visa', fee: '5,500 BDT', speed: '4 Days' },
                  { name: 'China Tourist Visa', fee: 'Call for Quote', speed: '12-20 Days' }
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3.5 bg-slate-50 rounded-xl border border-gray-100 hover:border-brand-green-200 transition">
                    <div>
                      <span className="block font-bold text-sm text-gray-800">{item.name}</span>
                      <span className="text-[11px] text-gray-500 font-semibold">{item.speed} processing</span>
                    </div>
                    <div className="text-right">
                      <span className="block font-display font-extrabold text-xs sm:text-sm text-brand-blue-600">{item.fee}</span>
                      <button 
                        onClick={() => onApply(item.name.split(' ')[0])}
                        className="text-[10px] text-brand-green-600 hover:underline font-bold"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Quick Promotion Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-dark to-brand-dark-light rounded-3xl p-8 sm:p-12 text-white border border-white/5 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-green-500/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center lg:text-left">
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                Planning corporate retreats or group excursions?
              </h3>
              <p className="text-gray-300 max-w-xl text-sm sm:text-base leading-relaxed">
                Contact our Group Travel Division. We manage hotels, logistics, itinerary customisation, and fast-track visas for teams of 10 to 200+ members.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <a
                href="https://wa.me/8801913389573"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg transition duration-200 cursor-pointer"
              >
                Chat on WhatsApp
              </a>
              <button
                onClick={() => onNavigate('contact')}
                className="w-full sm:w-auto px-6 py-3.5 bg-brand-green-500 hover:bg-brand-green-600 text-brand-dark font-extrabold text-sm rounded-xl shadow-lg transition duration-200 cursor-pointer"
              >
                Inquire Online
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
