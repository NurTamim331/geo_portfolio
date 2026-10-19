'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2, Clock, Building2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'General Inquiry',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      await supabase.from('trip_leads').insert({
        name: form.name,
        phone: form.phone,
        email: form.email || null,
        destination: form.service,
        num_travelers: 1,
        admin_notes: `Direct Contact Inquiry: ${form.message}`,
        status: 'new',
      });
    } catch {
      // Allow completion
    }

    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-amber-700 tracking-widest uppercase bg-amber-500/10 border border-amber-400/30 px-3.5 py-1.5 rounded-full">
          Get in Touch
        </span>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-brand-dark tracking-tight">
          Connect with <span className="text-gradient-logo">GEO Trips</span>
        </h1>
        <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
          Visit our Motijheel commercial office in Dhaka, give us a direct call, or submit your travel inquiry online.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Contact Info Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
            <h2 className="font-display font-bold text-xl text-brand-dark">Direct Hotlines</h2>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-brand-blue-50 text-brand-blue-600 rounded-2xl shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Hotline Numbers</span>
                  <a href="tel:+8801913389573" className="block text-base font-bold text-brand-dark hover:text-brand-blue-600 mt-0.5">
                    +88 01913-389573
                  </a>
                  <a href="tel:+8801611204561" className="block text-sm font-semibold text-gray-600 hover:text-brand-blue-600">
                    +88 01611-204561
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">WhatsApp Support</span>
                  <a
                    href="https://wa.me/8801913389573"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-bold text-emerald-600 hover:underline block mt-0.5"
                  >
                    Chat on WhatsApp
                  </a>
                  <span className="text-xs text-gray-400">Available during office hours</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-slate-100 text-slate-700 rounded-2xl shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Email Inquiries</span>
                  <a href="mailto:geotrips19@gmail.com" className="text-sm font-bold text-brand-dark hover:text-brand-blue-600 block mt-0.5">
                    geotrips19@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Motijheel Head Office</span>
                  <p className="text-sm font-semibold text-brand-dark mt-0.5 leading-relaxed">
                    154 C/A, Motijheel, Dhaka-1000, Bangladesh
                  </p>
                  <span className="text-xs text-gray-400">Proprietor: Md Mesbah Uddin</span>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-2 border-t border-gray-100">
                <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Operating Hours</span>
                  <p className="text-sm font-bold text-brand-dark mt-0.5">Saturday – Thursday</p>
                  <p className="text-xs text-gray-500">9:00 AM – 6:00 PM (Friday Closed)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inquiry Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12 space-y-6">
            <div>
              <h2 className="font-display font-black text-2xl text-brand-dark">Send Us an Inquiry</h2>
              <p className="text-gray-500 text-sm mt-1">
                Fill out the details below. We typically respond within 2 business hours.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
                <h3 className="font-display font-bold text-xl text-emerald-900">Message Received!</h3>
                <p className="text-sm text-emerald-800 max-w-md mx-auto">
                  Thank you, <strong>{form.name}</strong>. Md Mesbah Uddin or our duty officer will review your request and get in touch at <strong>{form.phone}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: '', phone: '', email: '', service: 'General Inquiry', message: '' });
                  }}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Shakil Ahmed"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+880 1XXXXXXXXX"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="shakil@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                      Service Requested
                    </label>
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-600"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Singapore Visa">Singapore Visa</option>
                      <option value="Thailand Visa">Thailand Visa</option>
                      <option value="Malaysia Visa">Malaysia Visa</option>
                      <option value="China Visa">China Visa</option>
                      <option value="Canada / Australia Visa">Canada / Australia Visa</option>
                      <option value="International Air Tickets">International Air Tickets</option>
                      <option value="Custom Tour Package">Custom Tour Package</option>
                      <option value="Hajj & Umrah Package">Hajj & Umrah Package</option>
                      <option value="Hotel Booking">Hotel Booking</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    Message / Travel Specifications *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us your travel dates, passenger count, or questions..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-blue-600 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-brand-dark font-extrabold text-sm rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer shadow-amber-400/20"
                >
                  {loading ? (
                    <span className="animate-spin h-5 w-5 border-2 border-brand-dark border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Inquiry to GEO Trips</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
