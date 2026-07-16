import React from 'react';
import { DollarSign, Clock, CheckSquare, Eye, ArrowRight, ShieldCheck } from 'lucide-react';

export default function VisaInfo({ onOpenModal, onApply }) {
  const visas = [
    {
      country: 'Singapore',
      price: '5500',
      time: '10 Working Days',
      photoType: '2 Copy recent picture MAT PAPER',
      bgGradient: 'from-blue-600/5 to-cyan-500/5',
      documents: [
        'Valid Passport with 6 months validity',
        '2 Copy recent picture MAT PAPER',
        'Bank Salary Statement (06 month)',
        'Personal Bank Statement AND 3 Month Salary Pay Slip.',
        'Bank Solvency Certificate',
        'NOC Letter From Office',
        'Visiting Card',
        'Office ID Card copy',
        'Old Passport [If Any]',
        'Student Id Card and Tuition fee receipt [For student]'
      ]
    },
    {
      country: 'Thailand',
      price: '5500',
      time: '7 Working Days',
      photoType: '2 Copy recent picture [4.5 X 3.5]',
      bgGradient: 'from-orange-600/5 to-red-500/5',
      documents: [
        'Valid Passport with 6 months validity',
        '2 Copy recent picture [4.5 X 3.5 ]',
        'Bank Salary Statement (06 month)',
        'Personal Bank Statement and 3 Month Salary Pay Slip [Job Holder]',
        'Bank Solvency Certificate',
        'NOC Letter From Office [2 copy on office pad]',
        'Visiting Card',
        'Office ID Card copy',
        'Old Passport [If Any]',
        'Student Id Card and Tuition fee receipt [For student]'
      ]
    },
    {
      country: 'Malaysia',
      price: '5500',
      time: '4 Working Days',
      photoType: '2 Copy recent picture [4.5 X 3.5]',
      bgGradient: 'from-emerald-600/5 to-teal-500/5',
      documents: [
        'Valid Passport with 6 months validity',
        '2 Copy recent picture [4.5 X 3.5 ]',
        'Bank Salary Statement (06 month)',
        'Personal Bank Statement and 3 Month Salary Pay Slip [Job Holder]',
        'Bank Solvency Certificate',
        'NOC Letter From Office [2 copy on office pad]',
        'Visiting Card',
        'Office ID Card copy',
        'Old Passport [If Any]',
        'Student Id Card and Tuition fee receipt [For student]'
      ]
    },
    {
      country: 'India',
      price: '5500',
      time: '12 Working Days',
      photoType: '2 Copy recent picture [4.5 X 3.5]',
      bgGradient: 'from-rose-600/5 to-pink-500/5',
      documents: [
        'Valid Passport with 6 months validity',
        '2 Copy recent picture [4.5 X 3.5 ]',
        'Bank Salary Statement (06 month)',
        'Personal Bank Statement and 3 Month Salary Pay Slip [Job Holder]',
        'Bank Solvency Certificate',
        'NOC Letter From Office [2 copy on office pad]',
        'Visiting Card',
        'Office ID Card copy',
        'Old Passport [If Any]',
        'Student Id Card and Tuition fee receipt [For student]'
      ]
    }
  ];

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-brand-green-600 tracking-widest uppercase bg-brand-green-500/10 px-3.5 py-1.5 rounded-full">
          Visa Information
        </span>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-brand-dark tracking-tight">
          Visa Guidelines & <span className="text-brand-green-500">Processing Fees</span>
        </h1>
        <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
          Accurate documentation is the key to visa approvals. Review our checklists below, or request an expert callback to verify your credentials.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {visas.map((visa, idx) => (
          <div 
            key={idx} 
            className={`bg-gradient-to-br ${visa.bgGradient} rounded-3xl border border-gray-100 p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-lg transition duration-300 relative overflow-hidden`}
          >
            {/* Price tag */}
            <div className="absolute top-6 right-6 px-4 py-2 bg-brand-blue-600/10 border border-brand-blue-600/20 text-brand-blue-700 font-display font-extrabold text-lg sm:text-xl rounded-xl">
              {visa.price} BDT
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-brand-dark">
                  {visa.country}
                </h3>
                
                <div className="flex items-center gap-1.5 text-xs text-brand-green-600 font-semibold mt-1">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>Processing Time: {visa.time}</span>
                </div>
              </div>

              {/* Key Items List */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Important Requirements
                </h4>
                
                <ul className="text-xs sm:text-sm text-gray-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckSquare className="h-4 w-4 text-brand-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Validity:</strong> Passport with at least 6 months validity.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckSquare className="h-4 w-4 text-brand-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Photo:</strong> {visa.photoType}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckSquare className="h-4 w-4 text-brand-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Financing:</strong> 6 months bank statement + solvency.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CTAs */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => onOpenModal(visa)}
                className="py-3 px-4 bg-white hover:bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Eye className="h-4 w-4" />
                <span>View Checklist</span>
              </button>
              
              <button
                onClick={() => onApply(visa.country)}
                className="py-3 px-4 bg-brand-green-500 hover:bg-brand-green-600 text-brand-dark font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <span>Apply Now</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Quick Trust Checklist */}
      <div className="p-6 sm:p-8 bg-brand-dark rounded-3xl text-white border border-white/5 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-7 w-7 text-brand-green-500 shrink-0" />
          <h3 className="font-display font-extrabold text-xl sm:text-2xl text-white">
            Why process your visa via GEO Trips?
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-300">
          <div className="space-y-1">
            <span className="block font-bold text-white text-base">Expert Consultation</span>
            <p className="text-xs text-gray-400 leading-relaxed">We evaluate your bank balances, travel history, and profession to suggest documentation fixes before submission.</p>
          </div>
          <div className="space-y-1">
            <span className="block font-bold text-white text-base">Dedicated Courier Desk</span>
            <p className="text-xs text-gray-400 leading-relaxed">For corporate partners, we collect and return passports to your head office using secure logistics officers.</p>
          </div>
          <div className="space-y-1">
            <span className="block font-bold text-white text-base">Zero Hidden Fees</span>
            <p className="text-xs text-gray-400 leading-relaxed">The processing cost of 5,500 BDT is transparently structured with no surcharge or emergency hidden fees.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
