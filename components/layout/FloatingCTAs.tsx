'use client';

import { Phone, MessageSquare, ChevronUp } from 'lucide-react';

export function FloatingCTAs() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <button
        onClick={scrollToTop}
        className="p-3 bg-white hover:bg-slate-50 text-gray-500 border border-gray-200 rounded-full shadow-lg transition duration-200 cursor-pointer hidden md:flex items-center justify-center hover:-translate-y-0.5"
        title="Scroll to Top"
      >
        <ChevronUp className="h-5 w-5" />
      </button>

      <a
        href="https://wa.me/8801913389573"
        target="_blank"
        rel="noopener noreferrer"
        className="p-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-xl transition duration-200 flex items-center justify-center hover:scale-105"
        title="WhatsApp Support"
      >
        <MessageSquare className="h-6 w-6" />
      </a>

      <a
        href="tel:+8801913389573"
        className="p-3.5 bg-[#0104c3] hover:bg-[#000fa8] text-white rounded-full shadow-xl shadow-[#0104c3]/30 transition duration-200 flex items-center justify-center hover:scale-105"
        title="Call Hotline"
      >
        <Phone className="h-6 w-6" />
      </a>
    </div>
  );
}
