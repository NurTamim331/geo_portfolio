import { Award, FileCheck, Users, Shield } from 'lucide-react';

const stats = [
  { icon: Award, value: '25+', label: 'Years of Experience', desc: 'Serving Bangladesh since 2001' },
  { icon: FileCheck, value: '50K+', label: 'Visas Approved', desc: 'Singapore, Thailand, Malaysia & more' },
  { icon: Users, value: '500+', label: 'Happy Clients', desc: 'Corporate & individual travelers' },
  { icon: Shield, value: '99.2%', label: 'Success Rate', desc: 'Expert documentation accuracy' },
];

export function StatsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="reveal-up bg-white rounded-2xl p-6 shadow-xl border border-gray-100/50 flex items-start gap-4 hover:-translate-y-1 transition duration-300"
            >
              <div className="p-3 bg-brand-blue-50 text-brand-blue-600 rounded-xl shrink-0">
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
  );
}
