'use client';

import React from 'react';
import { X, CheckCircle2, Clock, DollarSign, Camera, FileText, Phone, MessageSquare, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { CountryFlag } from '@/components/ui/CountryFlag';
import Link from 'next/link';

export interface VisaDetailData {
  country: string;
  flagCode: string;
  price: string;
  time: string;
  photoType: string;
  validity: string;
  stayPermit?: string;
  overview: string;
  categories: {
    name: string;
    items: string[];
  }[];
  specialNote?: string;
  terms?: string[];
}

interface VisaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  visa: VisaDetailData | null;
}

export function VisaDetailModal({ isOpen, onClose, visa }: VisaDetailModalProps) {
  if (!isOpen || !visa) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#03082a] via-[#07134d] to-[#0104c3]/80 text-white p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <CountryFlag country={visa.flagCode} size="lg" className="rounded-md" />
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
                Official Embassy Checklist
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
                {visa.country} Visa Requirements
              </h2>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-gray-400 block font-medium">Processing Fee</span>
              <strong className="text-amber-400 text-sm font-black">{visa.price}</strong>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-gray-400 block font-medium">Timeline</span>
              <strong className="text-white text-sm font-bold">{visa.time}</strong>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-gray-400 block font-medium">Validity</span>
              <strong className="text-white text-sm font-bold">{visa.validity}</strong>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-gray-400 block font-medium">Photo Spec</span>
              <strong className="text-sky-300 text-[11px] leading-tight block font-semibold">{visa.photoType}</strong>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
          {/* Overview text */}
          <p className="text-sm text-gray-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-gray-100">
            {visa.overview}
          </p>

          {/* Special Exemption / Alert (e.g. Housewives only need 2 photos) */}
          {visa.specialNote && (
            <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs sm:text-sm">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Important Agency Advantage:</strong>
                <p className="mt-0.5 text-emerald-800 leading-relaxed">{visa.specialNote}</p>
              </div>
            </div>
          )}

          {/* Document Categories */}
          <div className="space-y-6">
            <h3 className="font-display font-black text-lg text-brand-dark flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-blue-600" />
              <span>Complete Required Documents Checklist</span>
            </h3>

            {visa.categories.map((cat, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200/80 p-5 space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-brand-blue-700 block">
                  {cat.name}
                </span>
                <ul className="space-y-2.5">
                  {cat.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Terms & Conditions */}
          {visa.terms && visa.terms.length > 0 && (
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1.5 text-xs text-amber-900">
              <span className="font-bold flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span>Embassy Terms & Guidelines:</span>
              </span>
              <ul className="list-disc list-inside space-y-1 text-amber-800 pl-1">
                {visa.terms.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Sticky Footer with CTAs */}
        <div className="bg-slate-50 border-t border-gray-100 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Need advice on this document list?</span>
            <a href="tel:+8801913389573" className="font-bold text-brand-blue-600 hover:underline">
              Call Hotline
            </a>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={`https://wa.me/8801913389573?text=${encodeURIComponent(`Hello GEO Trips, I am looking for full assistance regarding the ${visa.country} visa.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span>WhatsApp Us</span>
            </a>
            <Link
              href={`/contact?visa=${encodeURIComponent(visa.country)}`}
              onClick={onClose}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <span>Apply Online</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
