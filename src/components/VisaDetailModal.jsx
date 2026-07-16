import React from 'react';
import { X, Calendar, DollarSign, Clock, HelpCircle, Check, Phone, MessageSquare } from 'lucide-react';

export default function VisaDetailModal({ isOpen, onClose, visaData, onApply }) {
  if (!isOpen || !visaData) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl z-10 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Banner */}
        <div className="bg-brand-dark px-6 py-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
          
          <h3 className="font-display font-black text-2xl tracking-wide text-white">
            {visaData.country} Visa Requirements
          </h3>
          <p className="text-sm text-brand-green-500 font-semibold mt-1">
            Official Guidelines & Required Documentation
          </p>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex items-center gap-3">
              <div className="p-2.5 bg-brand-blue-600/10 text-brand-blue-600 rounded-lg">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-gray-400">Visa Processing Fee</span>
                <span className="font-display font-extrabold text-base text-gray-800">{visaData.price} BDT</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex items-center gap-3">
              <div className="p-2.5 bg-brand-green-500/10 text-brand-green-600 rounded-lg">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-gray-400">Processing Time</span>
                <span className="font-display font-extrabold text-base text-gray-800">{visaData.time}</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 col-span-2 sm:col-span-1 flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-600 rounded-lg">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <span className="block text-[10px] uppercase font-bold text-gray-400">Validity Period</span>
                <span className="font-display font-extrabold text-base text-gray-800">Single/Multiple Entry</span>
              </div>
            </div>

          </div>

          {/* Documents Section */}
          <div>
            <h4 className="font-display font-bold text-gray-800 mb-3 text-sm tracking-wide uppercase border-b border-gray-100 pb-1.5">
              Required Documents Checklist
            </h4>
            
            <div className="max-h-72 overflow-y-auto pr-2 space-y-2">
              {visaData.documents.map((doc, idx) => (
                <div key={idx} className="flex items-start gap-2.5 bg-slate-50/50 p-2.5 rounded-lg border border-gray-100 hover:bg-slate-50 transition duration-150">
                  <div className="p-0.5 bg-emerald-50 text-emerald-600 rounded-full mt-0.5 shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Expert Note */}
          <div className="p-4 bg-amber-50/60 border border-amber-200/50 rounded-xl text-xs text-amber-800 leading-relaxed">
            <span className="font-bold text-amber-900 block mb-1">Important Visa Note:</span>
            Documents required vary depending on your profession. Corporate clients can request direct pickup of documents from their office within Dhaka. All document copies should be clear and legible.
          </div>

        </div>

        {/* Footer CTAs */}
        <div className="bg-slate-50 px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex gap-2">
            <a 
              href="tel:+8801712345678" 
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition"
            >
              <Phone className="h-3.5 w-3.5 text-brand-blue-600" />
              <span>Call Agency</span>
            </a>
            <a 
              href="https://wa.me/8801712345678" 
              target="_blank"
              rel="noopener noreferrer" 
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 transition"
            >
              <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </a>
          </div>

          <button
            onClick={() => {
              onApply(visaData.country);
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2.5 bg-brand-green-500 hover:bg-brand-green-600 text-brand-dark rounded-xl font-bold transition text-sm cursor-pointer shadow-md"
          >
            Apply for {visaData.country} Visa
          </button>

        </div>

      </div>
    </div>
  );
}
