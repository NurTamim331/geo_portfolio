import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare, Phone } from 'lucide-react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'What are the visa processing fees for Singapore, Thailand, Malaysia, and India?',
      a: 'The visa processing fee is exactly 5,500 BDT for each of these countries (Singapore, Thailand, Malaysia, India). This fee is completely transparent and covers our document reviews, consular queue submission logistics, and direct processing services.'
    },
    {
      q: 'Why does GEO Trips not provide online search or immediate booking options?',
      a: 'We believe that automated booking systems often lead to mistakes, hidden surcharges, and visa document mismatches. By focusing on a personalized, informational, and advisory model, a real travel expert evaluates your requirements, checks routes, and verifies visa compliance individually. This ensures the highest success rate and prevents errors.'
    },
    {
      q: 'How does GEO Trips achieve a 99.2% visa approval rate?',
      a: 'Consulates frequently reject visas due to minor issues—such as incorrect photo paper (e.g. Singapore requires MAT paper), missing matching pay slips, or spelling errors on NOC pads. Our visa consultants pre-audit your files against rigorous checklists and advise adjustments before we submit, ensuring consulate requirements are met.'
    },
    {
      q: 'Do you offer document collection and passport delivery services?',
      a: 'Yes. For our registered corporate clients and partners within Dhaka, our logistics officers handle the secure pickup of passport portfolios and delivery of completed visas directly to your office, saving your staff valuable time.'
    },
    {
      q: 'What is the procedure for booking a corporate team retreat or group excursion?',
      a: 'Simply call, email, or send us a WhatsApp message with your estimated team headcount, destination, and target travel month. We will allocate a senior corporate manager to design land packages, coordinate hotel group rates, block airline seats, and manage the block visa files.'
    },
    {
      q: 'Is the visa processing fee refundable if my application is rejected?',
      a: 'Consulate and processing fees are non-refundable as they cover embassy processing overheads and submission logistics. However, our primary goal is to prevent rejections. If our initial pre-audit shows that your document profile is insufficient, we will tell you upfront and help you resolve the issues before submission.'
    }
  ];

  return (
    <div className="space-y-16 py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold text-brand-green-600 tracking-widest uppercase bg-brand-green-500/10 px-3.5 py-1.5 rounded-full">
          Frequently Asked Questions
        </span>
        <h1 className="font-display font-black text-4xl text-brand-dark tracking-tight">
          Have Questions? <span className="text-brand-green-500">We Have Answers</span>
        </h1>
        <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
          Read through our most common client questions, or reach out to our team directly for specific travel questions.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div 
              key={idx} 
              className="bg-white rounded-2xl border border-gray-150 shadow-sm overflow-hidden transition duration-200"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                className="w-full px-6 py-5 text-left flex justify-between items-center gap-4 hover:bg-slate-50/50 transition cursor-pointer focus:outline-none"
              >
                <span className="font-display font-bold text-sm sm:text-base text-brand-dark pr-4">
                  {faq.q}
                </span>
                <span className="text-brand-green-600 shrink-0">
                  {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </span>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-gray-500 leading-relaxed border-t border-gray-50 bg-slate-50/30">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Ask Question Card */}
      <div className="bg-slate-50 border border-gray-150 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 mt-12 text-center md:text-left">
        <div className="space-y-1">
          <h4 className="font-display font-bold text-lg text-brand-dark">Still have unanswered questions?</h4>
          <p className="text-xs text-gray-400">Our customer support officers are ready to help you on WhatsApp or telephone.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto justify-center">
          <a 
            href="tel:+8801712345678" 
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-white hover:bg-slate-100 border border-gray-200 text-xs font-bold text-gray-700 rounded-xl transition shadow-sm"
          >
            <Phone className="h-4 w-4 text-brand-blue-600" />
            <span>Call +880 1712-345678</span>
          </a>
          
          <a 
            href="https://wa.me/8801712345678" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white rounded-xl transition shadow-md"
          >
            <MessageSquare className="h-4 w-4" />
            <span>WhatsApp Us</span>
          </a>
        </div>
      </div>

    </div>
  );
}
