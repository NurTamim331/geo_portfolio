import { ShieldCheck, Award, Headphones, Clock, Lock, Star } from 'lucide-react';

const badges = [
  { icon: Award, title: 'Certified Agent', desc: 'Authorized by Singapore Airlines & Bangladesh Biman' },
  { icon: ShieldCheck, title: '99.2% Success Rate', desc: 'Expert pre-screening eliminates rejections' },
  { icon: Headphones, title: 'Personal Support', desc: 'No bots — real expert advisors for every client' },
  { icon: Clock, title: '25+ Years Experience', desc: 'Proven track record since 2001 in Dhaka' },
  { icon: Lock, title: 'Secure & Confidential', desc: 'Your passport and financial data is fully protected' },
  { icon: Star, title: 'Corporate Preferred', desc: '200+ corporate partners trust GEO Trips' },
];

export function TrustBadges() {
  return (
    <section className="py-20 bg-[#03082a] border-y border-sky-400/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-bold text-amber-400 tracking-widest uppercase bg-amber-500/10 border border-amber-400/20 px-3.5 py-1.5 rounded-full">
            Why Choose Us
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white mt-3">
            Built on Trust, Backed by Results
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.title}
                className="reveal-up flex items-start gap-4 p-6 bg-[#07134d]/70 hover:bg-[#07134d] border border-sky-400/15 hover:border-amber-400/40 rounded-2xl transition duration-200 shadow-md"
              >
                <div className="p-3 bg-amber-500/15 text-amber-400 rounded-xl shrink-0 border border-amber-400/20">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{badge.title}</h3>
                  <p className="text-sky-100/70 text-sm mt-1 leading-relaxed">{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
