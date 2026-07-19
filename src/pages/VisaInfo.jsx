import React from 'react';
import { Clock, CheckSquare, Eye, ArrowRight, ShieldCheck } from 'lucide-react';

export default function VisaInfo({ onOpenModal, onApply }) {
  const visas = [
    {
      country: 'Singapore',
      price: '7,000',
      time: '10 Working Days',
      photoType: '2 color photos on matte paper',
      bgGradient: 'from-blue-600/5 to-cyan-500/5',
      documents: [
        'Passport validity: ≥ 6 months',
        '2 recent color photographs on matte paper',
        'Bank Salary Statement (6 months) OR Personal Bank Statement + 3 months\' salary pay slip',
        'Bank Solvency Certificate',
        'NOC letter from office',
        'Visiting card',
        'National ID (NID) card',
        'Office ID card copy',
        'Old passport (if any)',
        'For Businessmen: Trade license with notary',
        'Housewives: Only 2 photographs (no other documents required)',
        'Students: Student ID card / school salary books photocopy',
        'Children: Birth certificate'
      ]
    },
    {
      country: 'Thailand',
      price: '7,000',
      time: '7 Working Days',
      photoType: '2 color photos on matte paper',
      bgGradient: 'from-orange-600/5 to-red-500/5',
      documents: [
        'Passport validity: ≥ 6 months',
        '2 recent color photographs on matte paper',
        'Bank Salary Statement (6 months) OR Personal Bank Statement + 3 months\' salary pay slip',
        'Bank Solvency Certificate',
        'NOC letter from office',
        'Visiting card',
        'National ID (NID) card',
        'Office ID card copy',
        'Old passport (if any)',
        'For Businessmen: Trade license with notary',
        'Housewives: Only 2 photographs (no other documents required)',
        'Students: Student ID card / school salary books photocopy',
        'Children: Birth certificate'
      ]
    },
    {
      country: 'Malaysia',
      price: '5,500',
      time: '4 Working Days',
      photoType: '2 color photos on matte paper',
      bgGradient: 'from-emerald-600/5 to-teal-500/5',
      documents: [
        'Passport validity: ≥ 6 months',
        '2 recent color photographs on matte paper',
        'Bank Salary Statement (6 months) OR Personal Bank Statement + 3 months\' salary pay slip',
        'Bank Solvency Certificate',
        'NOC letter from office',
        'Visiting card',
        'National ID (NID) card',
        'Office ID card copy',
        'Old passport (if any)',
        'For Businessmen: Trade license with notary',
        'Housewives: Only 2 photographs (no other documents required)',
        'Students: Student ID card / school salary books photocopy',
        'Children: Birth certificate'
      ]
    },
    {
      country: 'China',
      price: 'Dynamic (Call/Meeting)',
      time: '12–20 Working Days',
      photoType: '35 × 45 mm white background matte paper',
      bgGradient: 'from-rose-600/5 to-pink-500/5',
      documents: [
        'Current and previous passport (minimum 8 months validity)',
        'Photo: 35 × 45 mm, matte paper, white background (ears, eyes, and shoulders visible)',
        'Bank statement + solvency certificate: 3 lacs minimum (signed by bank authority; no e-statements)',
        'Additional family member: +1 lac per person',
        'Job holder: NOC, Salary Certificate, Visiting Card, ID Card',
        'Business person: Trade License, Company pad, Visiting Card',
        'Student: Institutional NOC, Student ID card',
        'Doctor: BMDC Certificate, Visiting Card, NOC/Company pad',
        'Lawyer: Bar Council Certificate, Visiting Card, NOC/Company pad',
        'Retired person: Retirement letter or pension book',
        'TIN Certificate',
        'Confirmed air ticket',
        'Marriage & Birth certificate for children (if applicable)',
        'Invitation Letter (if any)',
        'Police GD copy (if passport lost previously)',
        'Terms: In case of rejection, embassy fee and refund charges are paid by the applicant'
      ]
    },
    {
      country: 'Canada',
      price: '10,000',
      time: 'Consulate Timeline',
      photoType: '35 × 45 mm photos',
      bgGradient: 'from-purple-600/5 to-indigo-500/5',
      documents: [
        'Original passport',
        'Application processing fee: 10,000 BDT',
        'TIN & Tax Certificate',
        'Bank statement (last 6 months) & Bank Solvency Certificate',
        'F.D.R Statement',
        'Supporting documents (car, share, land, flat registry etc. if any)',
        'National ID Card and Birth Certificate',
        'Visiting Card',
        'Invitation Letter + Passport copy + Tenant Agreement + Professional docs OR Hotel Booking',
        'Marriage Certificate & Vaccination Certificate',
        'Photo: 35 × 45 mm',
        'Professional documents (as per occupation)',
        'Family details: Father, Mother, Children, Sister, Brother, Spouse names, DOB, and addresses',
        'Employment start date & Education details (last institution name, course, session)'
      ]
    },
    {
      country: 'Australia',
      price: '10,000',
      time: 'Consulate Timeline',
      photoType: '35 × 45 mm photos',
      bgGradient: 'from-teal-600/5 to-cyan-500/5',
      documents: [
        'Original passport',
        'Application processing fee: 10,000 BDT',
        'TIN & Tax Certificate',
        'Bank statement (last 6 months) & Bank Solvency Certificate',
        'F.D.R Statement',
        'Supporting documents (car, share, land, flat registry etc. if any)',
        'National ID Card and Birth Certificate',
        'Visiting Card',
        'Invitation Letter + Passport copy + Tenant Agreement + Professional docs OR Hotel Booking',
        'Marriage Certificate & Vaccination Certificate',
        'Photo: 35 × 45 mm',
        'Professional documents (as per occupation)',
        'Family details: Father, Mother, Children, Sister, Brother, Spouse names, DOB, and addresses',
        'Employment start date & Education details (last institution name, course, session)'
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visas.map((visa, idx) => (
          <div 
            key={idx} 
            className={`bg-gradient-to-br ${visa.bgGradient} rounded-3xl border border-gray-100 p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-lg transition duration-300 relative overflow-hidden`}
          >
            {/* Price tag */}
            <div className="absolute top-6 right-6 px-4 py-2 bg-brand-blue-600/10 border border-brand-blue-600/20 text-brand-blue-700 font-display font-extrabold text-[11px] sm:text-xs rounded-xl max-w-[60%] text-center leading-tight">
              {visa.price === 'Dynamic (Call/Meeting)' ? 'Call for Quote' : `${visa.price} BDT`}
            </div>

            <div className="space-y-6 pt-4">
              <div>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-brand-dark">
                  {visa.country}
                </h3>
                
                <div className="flex items-center gap-1.5 text-xs text-brand-green-600 font-semibold mt-1">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>Processing: {visa.time}</span>
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
                    <span><strong>Validity:</strong> passport validity is required.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckSquare className="h-4 w-4 text-brand-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Photo:</strong> {visa.photoType}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckSquare className="h-4 w-4 text-brand-blue-600 shrink-0 mt-0.5" />
                    <span><strong>Financing:</strong> Bank statements + Solvency Certificate.</span>
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
            <span className="block font-bold text-white text-base">Expert Pre-Screening</span>
            <p className="text-xs text-gray-400 leading-relaxed">We double-verify trade licenses, salary slips, and company NOC letterheads to match exact consular criteria before submission.</p>
          </div>
          <div className="space-y-1">
            <span className="block font-bold text-white text-base">Corporate Pickup Desk</span>
            <p className="text-xs text-gray-400 leading-relaxed">For registered corporate partners inside Dhaka, we collect travel dossiers directly from your administrative offices.</p>
          </div>
          <div className="space-y-1">
            <span className="block font-bold text-white text-base">Special Exemptions Advice</span>
            <p className="text-xs text-gray-400 leading-relaxed">We advise on specific exemptions, such as the housewife exemption (where only two photos are needed for Singapore, Malaysia & Thailand).</p>
          </div>
        </div>
      </div>

    </div>
  );
}
