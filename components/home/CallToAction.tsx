import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';

export function CallToAction() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-gradient-to-r from-[#03082a] via-[#07134d] to-[#0104c3]/50 rounded-3xl p-8 sm:p-14 text-white border border-sky-400/20 relative overflow-hidden shadow-2xl shadow-blue-950/60">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="space-y-4 text-center lg:text-left max-w-xl">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
              Ready to Plan Your
              <span className="text-gradient-logo block">Perfect Journey?</span>
            </h2>
            <p className="text-sky-100/80 leading-relaxed">
              Use our interactive Trip Planner to get a rough estimate in minutes, or contact us directly. Our 1-stop travel desk handles flights, custom tours, and visa approvals seamlessly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <Link
              href="/trip-planner"
              className="w-full sm:w-auto text-center px-8 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:brightness-110 text-slate-950 font-black rounded-xl shadow-xl shadow-amber-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Plan My Trip</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href="https://wa.me/8801913389573"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto text-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
            >
              Chat on WhatsApp
            </a>
            <a
              href="tel:+8801913389573"
              className="w-full sm:w-auto text-center px-8 py-4 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-sky-100 font-bold rounded-xl transition flex items-center justify-center gap-2"
            >
              <Phone className="h-5 w-5 text-amber-400" />
              Call Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
