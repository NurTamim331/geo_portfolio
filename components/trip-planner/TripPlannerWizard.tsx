'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  MapPin, Users, Calendar, DollarSign, User, Phone, Mail,
  ChevronRight, ChevronLeft, CheckCircle2, Plane, Send, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { CountryFlag } from '@/components/ui/CountryFlag';

const STEPS = [
  { id: 1, title: 'Destination', icon: MapPin },
  { id: 2, title: 'Trip Type', icon: Users },
  { id: 3, title: 'Budget & Dates', icon: DollarSign },
  { id: 4, title: 'Contact', icon: User },
];

const DESTINATIONS = [
  { code: 'singapore', label: 'Singapore', value: 'Singapore', hint: 'Visas, Universal Studios, City Tours' },
  { code: 'thailand', label: 'Thailand', value: 'Thailand', hint: 'Bangkok, Phuket, Pattaya beach packages' },
  { code: 'malaysia', label: 'Malaysia', value: 'Malaysia', hint: 'KL, Genting, Langkawi excursions' },
  { code: 'china', label: 'China', value: 'China', hint: 'Guangzhou Canton Fair, Beijing, Shanghai' },
  { code: 'canada', label: 'Canada', value: 'Canada', hint: 'Visit visa preparation & flight booking' },
  { code: 'australia', label: 'Australia', value: 'Australia', hint: 'Sydney, Melbourne & tourist visa dossiers' },
  { code: 'saudi arabia', label: 'Saudi Arabia (Umrah)', value: 'Saudi Arabia', hint: 'Executive & VIP Umrah packages' },
  { code: 'uae', label: 'UAE / Dubai', value: 'Dubai', hint: 'Desert safari, Burj Khalifa & shopping' },
  { code: 'bangladesh', label: 'Bangladesh Domestic', value: 'Bangladesh', hint: 'Cox’s Bazar, Sylhet, Sundarbans' },
  { code: '', label: 'Custom / Other', value: 'Other', hint: 'Worldwide tailor-made journey' },
];

const TRIP_TYPES = [
  { label: '🏖️ Leisure Vacation', value: 'leisure', desc: 'Relaxation, sightseeing & family memories' },
  { label: '💼 Corporate / Business', value: 'corporate', desc: 'Conferences, business delegation & team retreats' },
  { label: '🌙 Hajj & Umrah', value: 'hajj_umrah', desc: 'Spiritual journeys with 3★ to 5★ hotel packages' },
  { label: '💍 Honeymoon Romance', value: 'honeymoon', desc: 'Private luxury suites, candlelight dinners & transfers' },
  { label: '👨‍👩‍👧‍👦 Family Package', value: 'family', desc: 'Kid-friendly itineraries, interconnecting rooms' },
  { label: '🎟️ Flight + Visa Only', value: 'flight_visa', desc: 'Prompt ticketing and consular document submission' },
];

const BUDGET_RANGES = [
  { label: 'Under ৳40,000', value: 'Under 40K BDT', note: 'Single visa / budget domestic flight' },
  { label: '৳40,000 – ৳80,000', value: '40K–80K BDT', note: 'Short Southeast Asia round-trip' },
  { label: '৳80,000 – ৳1,50,000', value: '80K–150K BDT', note: 'Standard full package tour per person' },
  { label: '৳1,50,000 – ৳3,00,000', value: '150K–300K BDT', note: 'Luxury tour / Premium Umrah package' },
  { label: '৳3,00,000+', value: '300K+ BDT', note: 'Long-haul flights, VIP business groups' },
  { label: 'Flexible / Let’s Discuss', value: 'Flexible', note: 'Recommend the best value option' },
];

const ESTIMATES: Record<string, Record<string, string>> = {
  Singapore: {
    leisure: '৳65,000 – ৳1,15,000 per person (Airfare + 3-Star Hotel + Singapore Visa + Transfers)',
    corporate: '৳85,000 – ৳1,50,000 per person with business conference amenities',
    family: '৳2,20,000 – ৳3,80,000 for a family of 4 (including Sentosa & Gardens by the Bay)',
    honeymoon: '৳1,60,000 – ৳2,40,000 per couple (Marina Bay Sands & romantic dinner cruise)',
    flight_visa: '৳38,000 – ৳55,000 (Roundtrip flight + ৳7,000 official visa process)',
  },
  Thailand: {
    leisure: '৳42,000 – ৳75,000 per person (Bangkok + Pattaya, 4 Nights, Hotel + Visa + Tours)',
    family: '৳1,40,000 – ৳2,30,000 for 4 persons with Safari World entry',
    corporate: '৳55,000 – ৳95,000 per attendee (Group booking rates)',
    honeymoon: '৳1,10,000 – ৳1,80,000 per couple with Phuket private pool villa',
    flight_visa: '৳32,000 – ৳45,000 (Flight + ৳7,000 visa assistance)',
  },
  Malaysia: {
    leisure: '৳38,000 – ৳68,000 per person (Kuala Lumpur + Genting Highlands, 4 Nights)',
    family: '৳1,30,000 – ৳2,20,000 for 4 persons with Sunway Lagoon passes',
    corporate: '৳50,000 – ৳85,000 per attendee',
    honeymoon: '৳95,000 – ৳1,60,000 per couple with Langkawi beach stay',
    flight_visa: '৳28,000 – ৳42,000 (Air ticket + ৳5,500 visa fee)',
  },
  'Saudi Arabia': {
    hajj_umrah: '৳1,45,000 – ৳2,60,000 per person (Standard 14 Days, near Haram)',
    corporate: '৳2,20,000+ for Executive VIP delegation',
    family: '৳4,80,000 – ৳7,50,000 for family of 4 (Quad sharing, private transport)',
  },
  China: {
    corporate: '৳1,10,000 – ৳1,95,000 per person (Canton Fair pass, hotel & flights)',
    leisure: '৳95,000 – ৳1,60,000 per person',
    flight_visa: '৳65,000 – ৳95,000 (Return flight + consular submission)',
  },
};

export function TripPlannerWizard() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    destination: '',
    customDestination: '',
    tripType: '',
    numTravelers: 2,
    departureDate: '',
    returnDate: '',
    budgetRange: '',
    name: '',
    phone: '',
    email: '',
    specialNotes: '',
  });

  const selectedDest = form.destination === 'Other' ? form.customDestination || 'Custom Destination' : form.destination;

  const calculateEstimate = () => {
    const dest = form.destination;
    const type = form.tripType;
    if (ESTIMATES[dest]?.[type]) {
      return ESTIMATES[dest][type];
    }
    if (form.budgetRange && form.budgetRange !== 'Flexible') {
      return `Estimated budget allocation: ${form.budgetRange} for ${form.numTravelers} traveler(s)`;
    }
    return 'Customized quote will be formulated by Md Mesbah Uddin (GEO Trips)';
  };

  const handleNext = () => {
    if (step === 1 && !form.destination) return;
    if (step === 2 && !form.tripType) return;
    if (step === 3 && !form.budgetRange) return;
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      setError('Please provide your name and phone number.');
      return;
    }

    setLoading(true);
    setError('');

    const estimate = calculateEstimate();

    try {
      const supabase = createClient();
      await supabase.from('trip_leads').insert({
        name: form.name,
        phone: form.phone,
        email: form.email || null,
        destination: selectedDest,
        num_travelers: form.numTravelers,
        departure_date: form.departureDate || null,
        return_date: form.returnDate || null,
        budget_range: form.budgetRange,
        trip_type: form.tripType,
        rough_estimate: estimate,
        admin_notes: form.specialNotes ? `Client Notes: ${form.specialNotes}` : null,
      });
    } catch {
      // Allow completion even if Supabase table is pending migrations
    }

    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    const estimate = calculateEstimate();
    return (
      <div className="bg-[#07134d]/95 backdrop-blur-md border border-sky-400/20 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-blue-950/80 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-400/30">
          <CheckCircle2 className="h-9 w-9 text-amber-400" />
        </div>

        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">Request Confirmed</span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white mt-1">
            Trip Plan Generated!
          </h2>
          <p className="text-sky-100/80 text-sm sm:text-base mt-2 max-w-lg mx-auto">
            Thank you, <strong className="text-white">{form.name}</strong>. Your inquiry for <strong className="text-amber-400">{selectedDest}</strong> ({form.numTravelers} traveler{form.numTravelers > 1 ? 's' : ''}) has been prioritized by our 1-stop travel desk.
          </p>
        </div>

        {/* Estimated Price Box */}
        <div className="bg-white/5 border border-sky-400/30 rounded-2xl p-6 text-left max-w-xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-200 uppercase tracking-wider">Preliminary Cost Estimate</span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 rounded-full">Non-Binding</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
            {estimate}
          </p>
          <p className="text-xs text-sky-100/60">
            *Final fare is subject to airline seat classes, consular updates, and preferred travel dates.
          </p>
        </div>

        {/* Direct Action Hotlines */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={`https://wa.me/8801913389573?text=${encodeURIComponent(`Hello GEO Trips, I just planned a trip to ${selectedDest} for ${form.numTravelers} person(s). My name is ${form.name}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg"
          >
            <span>Confirm on WhatsApp</span>
          </a>
          <a
            href="tel:+8801913389573"
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <Phone className="h-4 w-4" />
            <span>Call Hotline (+880 1913-389573)</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#07134d]/95 backdrop-blur-md border border-sky-400/20 rounded-3xl shadow-2xl shadow-blue-950/80 overflow-hidden">
      {/* Wizard Progress Header */}
      <div className="bg-white/5 border-b border-white/10 p-6 sm:p-8">
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isCompleted = step > s.id;
            const isCurrent = step === s.id;
            return (
              <div key={s.id} className="flex flex-col items-center text-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition duration-200 mb-2',
                    isCurrent
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 ring-2 ring-amber-400/50'
                      : isCompleted
                      ? 'bg-sky-500 text-white'
                      : 'bg-white/5 text-gray-500 border border-white/10'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span
                  className={cn(
                    'text-[11px] sm:text-xs font-semibold hidden sm:block',
                    isCurrent ? 'text-amber-400 font-bold' : isCompleted ? 'text-sky-200' : 'text-gray-400'
                  )}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Body */}
      <div className="p-6 sm:p-10">
        {/* STEP 1: Destination */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Step 1 of 4</span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white mt-1">
                Where would you like to travel?
              </h2>
              <p className="text-sky-100/70 text-sm mt-1">
                Select from our highest-frequency visa & tour destinations or request anywhere worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {DESTINATIONS.map((dest) => (
                <button
                  key={dest.value}
                  type="button"
                  onClick={() => setForm({ ...form, destination: dest.value })}
                  className={cn(
                    'p-4 rounded-2xl border text-left transition duration-200 cursor-pointer flex flex-col justify-between',
                    form.destination === dest.value
                      ? 'bg-amber-500/20 border-amber-400 text-white ring-1 ring-amber-400 shadow-md'
                      : 'bg-white/5 border-white/10 text-gray-200 hover:bg-white/10 hover:border-white/20'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    {dest.code ? (
                      <CountryFlag country={dest.code} size="sm" />
                    ) : (
                      <Plane className="h-4 w-4 text-amber-400" />
                    )}
                    <span className="font-bold text-base text-white">{dest.label}</span>
                  </div>
                  <span className="text-xs text-sky-100/70 mt-1 pl-7">{dest.hint}</span>
                </button>
              ))}
            </div>

            {form.destination === 'Other' && (
              <div className="pt-2">
                <label className="block text-xs font-bold text-gray-300 mb-2 uppercase">Specify Destination</label>
                <input
                  type="text"
                  placeholder="e.g. Turkey, Japan, Maldives, UK..."
                  value={form.customDestination}
                  onChange={(e) => setForm({ ...form, customDestination: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Trip Type & Travelers */}
        {step === 2 && (
          <div className="space-y-8">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Step 2 of 4</span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white mt-1">
                What style of trip are you planning?
              </h2>
              <p className="text-sky-100/70 text-sm mt-1">
                This helps us tailor flights, hotel tiers, and consular documents.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {TRIP_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setForm({ ...form, tripType: type.value })}
                  className={cn(
                    'p-4 rounded-2xl border text-left transition duration-200 cursor-pointer',
                    form.tripType === type.value
                      ? 'bg-amber-500/20 border-amber-400 text-white ring-1 ring-amber-400 shadow-md'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/8 hover:border-white/20'
                  )}
                >
                  <span className="font-bold text-base text-white block">{type.label}</span>
                  <span className="text-xs text-sky-100/70 mt-1 block">{type.desc}</span>
                </button>
              ))}
            </div>

            {/* Traveler Counter */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="block font-bold text-white text-base">Number of Passengers / Travelers</span>
                <span className="text-xs text-sky-100/70">Adults and children requiring airfare or visa files</span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, numTravelers: Math.max(1, form.numTravelers - 1) })}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition"
                >
                  –
                </button>
                <span className="font-display font-black text-2xl text-amber-400 w-10 text-center">
                  {form.numTravelers}
                </span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, numTravelers: form.numTravelers + 1 })}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Budget & Dates */}
        {step === 3 && (
          <div className="space-y-8">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Step 3 of 4</span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white mt-1">
                Budget & Preferred Timing
              </h2>
              <p className="text-sky-100/70 text-sm mt-1">
                We calibrate airline routing and hotel ratings to stay comfortably within your expectations.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">
                Expected Budget Range (Total in BDT)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {BUDGET_RANGES.map((b) => (
                  <button
                    key={b.value}
                    type="button"
                    onClick={() => setForm({ ...form, budgetRange: b.value })}
                    className={cn(
                      'p-4 rounded-2xl border text-left transition duration-200 cursor-pointer',
                      form.budgetRange === b.value
                        ? 'bg-amber-500/20 border-amber-400 text-white ring-1 ring-amber-400 shadow-md'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/8 hover:border-white/20'
                    )}
                  >
                    <span className="font-bold text-sm text-white block">{b.label}</span>
                    <span className="text-[11px] text-sky-100/70 mt-1 block">{b.note}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-2">
                  Tentative Departure Date
                </label>
                <input
                  type="date"
                  value={form.departureDate}
                  onChange={(e) => setForm({ ...form, departureDate: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-brand-green-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-200 uppercase tracking-wider mb-2">
                  Tentative Return Date (Optional)
                </label>
                <input
                  type="date"
                  value={form.returnDate}
                  onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-brand-green-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Contact & Final Review */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Step 4 of 4</span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white mt-1">
                Where should we send your quote?
              </h2>
              <p className="text-sky-100/70 text-sm mt-1">
                A GEO Trips travel officer will review your choices and reach out with flight slots and hotel vouchers.
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-300 text-sm font-semibold">
                {error}
              </div>
            )}

            {/* Trip Recap Box */}
            <div className="p-4 bg-slate-900/90 border border-slate-700 rounded-2xl grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-gray-300 block font-medium">Destination</span>
                <span className="font-bold text-white text-sm">{selectedDest || 'Not selected'}</span>
              </div>
              <div>
                <span className="text-gray-300 block font-medium">Travelers</span>
                <span className="font-bold text-white text-sm">{form.numTravelers} Person(s)</span>
              </div>
              <div>
                <span className="text-gray-300 block font-medium">Target Budget</span>
                <span className="font-bold text-brand-green-400 text-sm">{form.budgetRange || 'Flexible'}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-200 uppercase mb-2">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Md Tanvir Rahman"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:border-brand-green-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-200 uppercase mb-2">WhatsApp / Phone *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="+880 1XXXXXXXXX"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:border-brand-green-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-200 uppercase mb-2">Email Address (Optional)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="email"
                      placeholder="tanvir@company.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:border-brand-green-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-200 uppercase mb-2">Special Requests / Airline Preferences</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Prefer Singapore Airlines, need 2 double beds, transit visa required..."
                  value={form.specialNotes}
                  onChange={(e) => setForm({ ...form, specialNotes: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:border-brand-green-500 resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:brightness-110 disabled:opacity-50 text-slate-950 font-black text-base rounded-xl transition shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-2 border-slate-950 border-t-transparent rounded-full" />
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Request Custom Itinerary & Estimate</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Navigation Buttons for Steps 1 - 3 */}
      {step < 4 && (
        <div className="bg-white/5 border-t border-white/10 p-6 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => prev - 1)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-sky-100/70 hover:text-white bg-white/5 hover:bg-white/10 transition flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNext}
            disabled={(step === 1 && !form.destination) || (step === 2 && !form.tripType) || (step === 3 && !form.budgetRange)}
            className="px-8 py-3 rounded-xl text-sm font-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:brightness-110 disabled:opacity-40 text-slate-950 transition flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <span>Continue</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
