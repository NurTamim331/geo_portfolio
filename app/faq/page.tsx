import type { Metadata } from 'next';
import { HelpCircle, ChevronDown, PhoneCall } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions – GEO Trips',
  description: 'Common questions on visa processing time, bank statement thresholds, housewife exemptions, and flight booking with GEO Trips.',
};

const faqs = [
  {
    q: 'How long does a Singapore or Thailand tourist visa take from Dhaka?',
    a: 'Singapore tourist e-visas generally take 10 working days from the date of consular biometric or submission. Thailand sticker tourist visas take approximately 7 working days once submitted to the authorized visa application center in Dhaka.',
  },
  {
    q: 'What is the "Housewife Exemption" for Southeast Asian visas?',
    a: 'For Singapore, Malaysia, and Thailand, housewives travelling with their husband or independently do NOT need to present their own bank accounts or company NOC letters. Only 2 recent photographs on matte paper, their passport, and a copy of the husband’s passport/marriage certificate are required.',
  },
  {
    q: 'What are the bank solvency requirements for a China tourist visa?',
    a: 'The Chinese Embassy in Bangladesh strictly requires a physical bank statement (e-statements are not accepted) showing a minimum ending balance of ৳3,00,000 for a single applicant, plus an additional ৳1,00,000 per accompanying family member. It must be stamped and signed by the bank manager alongside a Bank Solvency Certificate.',
  },
  {
    q: 'Can GEO Trips merge multiple tour elements into a single corporate invoice?',
    a: 'Yes. Our specialized Invoice Generator in the Admin and Client portals allows multiple flight tickets, hotel reservations, and consular visa fees for different staff members to be merged into a single consolidated master invoice.',
  },
  {
    q: 'How do I submit payment proof after doing a bank transfer or bKash?',
    a: 'Once you log in to your Client Dashboard, navigate to "Submit Payment", enter your transfer amount and bank name, and attach a photo or PDF screenshot of the deposit slip. Our administration desk verifies and clears your dues within 2–4 hours.',
  },
  {
    q: 'Where is GEO Trips located if I want to deliver physical documents?',
    a: 'Our central Dhaka commercial office is located at 154 C/A, Motijheel, Dhaka-1000. You can visit Saturday through Thursday between 9:00 AM and 6:00 PM. We also offer document collection desks for registered corporate accounts in Dhaka.',
  },
];

export default function FAQPage() {
  return (
    <div className="space-y-16 py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="text-xs font-bold text-amber-700 tracking-widest uppercase bg-amber-500/10 border border-amber-400/30 px-3.5 py-1.5 rounded-full">
          Got Questions?
        </span>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-brand-dark tracking-tight">
          Frequently Asked <span className="text-gradient-logo">Questions</span>
        </h1>
        <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
          Clear answers about visa criteria, financial requirements, and booking workflows.
        </p>
      </div>

      {/* Accordion / FAQ Cards */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 text-brand-royal rounded-xl shrink-0 mt-0.5">
                <HelpCircle className="h-5 w-5" />
              </div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-brand-dark">
                {faq.q}
              </h2>
            </div>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed pl-10">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      {/* Still have questions banner */}
      <div className="bg-royal-gradient text-white rounded-3xl p-8 sm:p-10 border border-white/10 text-center space-y-4 shadow-xl">
        <h3 className="font-display font-bold text-xl text-white">Have a unique or urgent visa query?</h3>
        <p className="text-gray-300 text-sm max-w-md mx-auto">
          Contact our principal consultant directly. We are ready to assist you.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <a
            href="tel:+8801913389573"
            className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-brand-dark font-extrabold text-xs rounded-xl transition shadow-md flex items-center gap-2 shadow-amber-400/20"
          >
            <PhoneCall className="h-4 w-4" />
            <span>Call +88 01913-389573</span>
          </a>
          <Link
            href="/contact"
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition"
          >
            Send Inquiry
          </Link>
        </div>
      </div>
    </div>
  );
}
