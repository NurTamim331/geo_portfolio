import React from 'react';
import { Award, ShieldCheck, HeartHandshake, Milestone, Users } from 'lucide-react';

export default function AboutUs({ onNavigate }) {
  const values = [
    { icon: ShieldCheck, title: 'Absolute Transparency', desc: 'No hidden fees. We verify costs upfront and provide honest consultations on visa approval chances.' },
    { icon: HeartHandshake, title: 'Relationship-First Service', desc: 'Over 80% of our business comes from returning clients and corporate partnerships built over decades.' },
    { icon: Award, title: 'Attention to Detail', desc: 'Visa application forms are double-verified by senior officers to prevent common spelling or checklist errors.' }
  ];

  const milestones = [
    { year: '2001', title: 'Company Foundation', desc: 'GEO Trips was founded in Dhaka with a core team of three travel enthusiasts focused on tour planning.' },
    { year: '2007', title: 'Civil Aviation Registration', desc: 'Acquired official governmental travel agency licensure and partnered with primary global airlines.' },
    { year: '2012', title: 'Corporate Division Launch', desc: 'Introduced customized travel logistics management for MNCs and prominent local conglomerates.' },
    { year: '2018', title: 'Visa Operations Expansion', desc: 'Streamlined dedicated document review desks for Singapore, Thailand, Malaysia, and India.' },
    { year: '2026', title: '25 Years of Excellence', desc: 'Celebrating a quarter of a century of client trust, carrying over 50,000 travelers worldwide.' }
  ];

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-brand-green-600 tracking-widest uppercase bg-brand-green-500/10 px-3.5 py-1.5 rounded-full">
          About GEO Trips
        </span>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-brand-dark tracking-tight">
          A Quarter-Century of <span className="text-brand-green-500">Travel Expertise</span>
        </h1>
        <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
          GEO Trips is a premier travel agency run by <strong>Md Mesbah Uddin</strong>, a certified travel agent for <strong>Singapore Airlines</strong> and <strong>Bangladesh Biman</strong>. With over 25 years of experience, we serve corporate and personal travelers with absolute dedication and trust from our Motijheel head office.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-brand-dark">
            Our Vision: Restoring Trust in Travel Agency Services
          </h2>
          <p className="text-gray-600 leading-relaxed">
            In an industry dominated by massive online aggregators and anonymous automated chat bots, GEO Trips stands firm on the importance of human-to-human relationships. We believe that your corporate schedule or long-planned family holiday deserves personalized, dedicated care.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our team members undergo rigorous training on international document standards, governmental regulations, and consular expectations. When you hand your passport and financial records to GEO Trips, you are placing them in the hands of seasoned professionals.
          </p>
          
          <div className="pt-2">
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 bg-brand-blue-600 hover:bg-brand-blue-700 text-white rounded-xl font-bold text-sm transition shadow-md cursor-pointer"
            >
              Talk to Our Management
            </button>
          </div>
        </div>

        {/* Experience Box */}
        <div className="lg:col-span-6 bg-gradient-to-br from-brand-dark to-brand-dark-light rounded-3xl p-8 sm:p-12 text-white border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-green-500/5 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 text-center lg:text-left space-y-6">
            <div className="text-brand-green-500 font-display font-black text-7xl sm:text-8xl">
              25+
            </div>
            <div className="font-display font-bold text-2xl">
              Years of Unbroken Excellence
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              We have weathered global challenges, travel policy updates, and changing consulate procedures, consistently delivering the same standard of professional accountability.
            </p>
            <div className="grid grid-cols-2 gap-4 text-center pt-4">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <span className="block font-display font-black text-xl text-brand-green-500">2001</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Year Founded</span>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <span className="block font-display font-black text-xl text-brand-green-500">50K+</span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">Travelers Guided</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-10">
        <div className="text-center space-y-2">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-brand-dark">
            Our Core Values
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            These guiding principles form the foundation of our daily interactions and business execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md hover:shadow-xl transition duration-300">
                <div className="p-3 bg-brand-blue-50 text-brand-blue-600 rounded-xl w-fit mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-brand-dark mb-2">
                  {val.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {val.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline Milestones */}
      <div className="space-y-12">
        <div className="text-center space-y-2">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-brand-dark">
            Milestones & History
          </h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Follow our journey from startup travel advisor to corporate logistical partner.
          </p>
        </div>

        <div className="relative border-l-2 border-brand-green-200 ml-4 md:ml-32 space-y-8 py-4">
          {milestones.map((m, idx) => (
            <div key={idx} className="relative pl-6 md:pl-10">
              
              {/* Year Indicator for desktop */}
              <div className="hidden md:flex absolute right-full mr-6 top-1.5 items-center gap-1.5 text-right w-24">
                <span className="font-display font-black text-lg text-brand-blue-600 w-full">
                  {m.year}
                </span>
                <div className="h-2 w-2 rounded-full bg-brand-green-500"></div>
              </div>
              
              {/* Bullet Node */}
              <div className="absolute -left-[9px] top-2 h-4 w-4 rounded-full border-2 border-brand-green-500 bg-white"></div>
              
              {/* Mobile Year Badge */}
              <span className="inline-block md:hidden px-2 py-0.5 rounded bg-brand-blue-50 text-brand-blue-700 font-bold text-xs mb-2">
                {m.year}
              </span>

              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm max-w-3xl">
                <h3 className="font-display font-bold text-base sm:text-lg text-brand-dark mb-1">
                  {m.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {m.desc}
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
