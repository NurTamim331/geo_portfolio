'use client';

import React, { useState, useEffect } from 'react';
import { Clock, CheckSquare, Eye, ArrowRight, ShieldCheck, PhoneCall } from 'lucide-react';
import Link from 'next/link';
import { CountryFlag } from '@/components/ui/CountryFlag';
import { VisaDetailModal, type VisaDetailData } from '@/components/visa/VisaDetailModal';
import { INITIAL_VISAS_DATA } from '@/lib/visa-data';

export default function VisaPage() {
  const [visas, setVisas] = useState<VisaDetailData[]>(INITIAL_VISAS_DATA);
  const [selectedVisa, setSelectedVisa] = useState<VisaDetailData | null>(null);

  useEffect(() => {
    fetch('/api/visa')
      .then((res) => res.json())
      .then((data) => {
        if (data?.visas && Array.isArray(data.visas) && data.visas.length > 0) {
          setVisas(data.visas);
        }
      })
      .catch((err) => {
        console.error('Failed to load dynamic visas:', err);
      });
  }, []);

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-amber-700 tracking-widest uppercase bg-amber-500/10 border border-amber-400/30 px-4 py-1.5 rounded-full shadow-xs">
          1 Stop Multiple Service · Document Checklists
        </span>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-slate-900 tracking-tight">
          Visa Guidelines &amp; <span className="text-[#0104c3]">Processing Fees</span>
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          Accurate documentation is the key to visa approvals. Click <strong>&ldquo;Full Checklist&rdquo;</strong> on any country to see every single document required.
        </p>
      </div>

      {/* Visas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visas.map((visa) => (
          <div
            key={visa.country}
            className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 relative group"
          >
            {/* Price Badge */}
            <div className="absolute top-6 right-6 px-3.5 py-1.5 bg-brand-blue-50 border border-brand-blue-200 text-brand-blue-700 font-display font-black text-xs rounded-xl shadow-xs">
              {visa.price}
            </div>

            <div className="space-y-5 pt-2">
              {/* Flag + Country Title */}
              <div className="flex items-center gap-3">
                <CountryFlag country={visa.flagCode} size="lg" className="rounded-md shadow-xs" />
                <div>
                  <h2 className="font-display font-black text-2xl text-slate-900 group-hover:text-brand-blue-600 transition">
                    {visa.country}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold mt-0.5">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span>Processing: {visa.time}</span>
                  </div>
                </div>
              </div>

              {/* Photo & Validity Specs */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-gray-100 text-xs space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-slate-500 font-medium shrink-0">Photo Spec:</span>
                  <span className="font-semibold text-slate-800">{visa.photoType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium shrink-0">Validity:</span>
                  <span className="font-bold text-slate-800">{visa.validity}</span>
                </div>
              </div>

              {/* Requirements Teaser List */}
              <div className="space-y-2">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                  Key Requirements
                </span>
                <ul className="text-xs text-slate-700 space-y-2">
                  {visa.categories[0]?.items.slice(0, 3).map((doc, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckSquare className="h-4 w-4 text-brand-blue-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-6 mt-6 border-t border-gray-100 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedVisa(visa)}
                className="py-3 px-3 bg-sky-50 hover:bg-sky-100 text-[#0104c3] border border-sky-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Eye className="h-4 w-4 text-[#0104c3]" />
                <span>Full Checklist</span>
              </button>

              <Link
                href={`/contact?visa=${encodeURIComponent(visa.country)}`}
                className="py-3 px-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <span>Apply Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Special Housewife & Pre-Screening Callout */}
      <div className="bg-[#03082a] text-white rounded-3xl p-8 sm:p-12 border border-sky-400/20 shadow-2xl shadow-blue-950/80 space-y-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-amber-400 shrink-0" />
          <h2 className="font-display font-black text-2xl text-white">
            Why GEO Trips Pre-Screening Guarantees Results
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-sky-100/80">
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-2">
            <span className="font-bold text-amber-400 block text-base">Housewife Special Exemption</span>
            <p className="text-xs text-sky-100/70 leading-relaxed">
              For Singapore, Thailand, and Malaysia visas, housewives are exempt from bank solvency certificates. Only 2 photos and husband’s passport copy are required.
            </p>
          </div>

          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-2">
            <span className="font-bold text-amber-400 block text-base">Corporate Pickup Desk</span>
            <p className="text-xs text-sky-100/70 leading-relaxed">
              Operating out of Motijheel C/A, we offer direct physical document collection for bank executives, multi-national offices, and business delegations in Dhaka.
            </p>
          </div>

          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 space-y-2">
            <span className="font-bold text-amber-400 block text-base">Notary & Translation Support</span>
            <p className="text-xs text-sky-100/70 leading-relaxed">
              Bengali trade licenses, Nikahnama (marriage deeds), and land registries are translated and notarized in-house to satisfy embassy consular mandates.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
          <p className="text-xs text-sky-200/60">
            Have questions about complex travel histories or previous visa rejections?
          </p>
          <a
            href="tel:+8801913389573"
            className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs rounded-xl transition flex items-center gap-2 shrink-0 shadow-lg shadow-amber-500/20"
          >
            <PhoneCall className="h-4 w-4" />
            <span>Speak with Md Mesbah Uddin (+88 01913-389573)</span>
          </a>
        </div>
      </div>

      {/* Interactive Requirements Modal */}
      <VisaDetailModal
        isOpen={Boolean(selectedVisa)}
        onClose={() => setSelectedVisa(null)}
        visa={selectedVisa}
      />
    </div>
  );
}
