import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Rafiqul Islam',
    role: 'Corporate Manager, Dhaka',
    text: 'GEO Trips has been our go-to travel partner for 8 years. Their visa processing is flawless and the documentation support is unmatched. Highly recommended for corporate travel.',
    rating: 5,
  },
  {
    name: 'Nasreen Akter',
    role: 'Housewife, Chittagong',
    text: 'Applied for Thailand visa through GEO Trips. The team guided me through every document, and I got my visa in just 6 working days. Excellent service!',
    rating: 5,
  },
  {
    name: 'Tariq Ahmed',
    role: 'Business Owner, Sylhet',
    text: 'Used them for Singapore visa twice. Professional, fast, and reliable. Mr. Mesbah personally reviews complex cases. Will always use GEO Trips.',
    rating: 5,
  },
  {
    name: 'Dr. Fatema Begum',
    role: 'Medical Professional, Dhaka',
    text: 'The China visa process was complex but GEO Trips handled all my medical professional documents perfectly. Got approved on first attempt.',
    rating: 5,
  },
  {
    name: 'Karim & Family',
    role: 'Family Travelers, Dhaka',
    text: 'Went on the Malaysia package tour. Everything from hotel to transport was perfectly arranged. The kids loved it. GEO Trips delivered more than promised.',
    rating: 5,
  },
  {
    name: 'Shahidul Hoque',
    role: 'Retired Government Officer',
    text: 'Performed Umrah through their package. Every arrangement was beautiful and the team stayed in contact throughout. A truly blessed journey. Jazak Allah Khair.',
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16 reveal-fade">
          <span className="text-xs font-bold text-brand-gold-600 tracking-widest uppercase bg-amber-50 px-3.5 py-1.5 rounded-full">
            Client Reviews
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-brand-dark">
            What Our Clients Say
          </h2>
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="h-5 w-5 text-amber-400 fill-current" />
            ))}
            <span className="ml-2 text-sm font-semibold text-gray-600">4.9/5 average rating</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="reveal-up bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 relative"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-brand-blue-100" />
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed italic mb-6">&ldquo;{t.text}&rdquo;</p>
              <div className="border-t border-gray-100 pt-4">
                <p className="font-bold text-brand-dark text-sm">{t.name}</p>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
