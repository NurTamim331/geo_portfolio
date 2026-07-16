import React, { useState } from 'react';
import { Send, CheckCircle2, User, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

export default function InquiryForm({ prefilledDestination }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Visa Processing',
    destination: prefilledDestination || 'Singapore',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sync state if prefilledDestination changes
  React.useEffect(() => {
    if (prefilledDestination) {
      setFormData(prev => ({ ...prev, destination: prefilledDestination }));
    }
  }, [prefilledDestination]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API submission
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // Save inquiry to localStorage to mimic database capture
      const currentInquiries = JSON.parse(localStorage.getItem('geo_inquiries') || '[]');
      currentInquiries.push({ ...formData, id: Date.now(), date: new Date().toISOString() });
      localStorage.setItem('geo_inquiries', JSON.stringify(currentInquiries));

      // Reset
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: 'Visa Processing',
        destination: 'Singapore',
        message: ''
      });
    }, 1200);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform hover:-translate-y-1 transition duration-300">
      
      {/* Form Header */}
      <div className="bg-brand-dark px-6 py-8 text-white relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="h-24 w-24 text-brand-green-500" />
        </div>
        <h3 className="font-display font-extrabold text-2xl text-white mb-2">
          Request Consultation
        </h3>
        <p className="text-sm text-gray-300">
          Get a callback from our senior travel expert within 2 hours.
        </p>
      </div>

      <div className="p-6 sm:p-8">
        {success ? (
          <div className="text-center py-10 space-y-4">
            <div className="inline-flex items-center justify-center p-3 bg-emerald-50 text-emerald-600 rounded-full mb-2">
              <CheckCircle2 className="h-14 w-14" />
            </div>
            <h4 className="font-display font-bold text-xl text-gray-800">
              Inquiry Submitted Successfully!
            </h4>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Thank you for choosing GEO Trips. Our travel officer will call or WhatsApp you shortly.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="mt-6 px-5 py-2.5 bg-brand-blue-600 text-white rounded-lg font-semibold hover:bg-brand-blue-700 transition cursor-pointer text-sm shadow-md"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue-600/30 focus:border-brand-blue-600 transition"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue-600/30 focus:border-brand-blue-600 transition"
                />
              </div>
            </div>

            {/* Phone Input */}
            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Phone / WhatsApp Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. +880 1712-345678"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue-600/30 focus:border-brand-blue-600 transition"
                />
              </div>
            </div>

            {/* Service Selection */}
            <div>
              <label htmlFor="service" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Requested Service
              </label>
              <select
                name="service"
                id="service"
                value={formData.service}
                onChange={handleChange}
                className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue-600/30 focus:border-brand-blue-600 transition"
              >
                <option value="Visa Processing">Visa Processing Consultation</option>
                <option value="Corporate Travel">Corporate Tour Management</option>
                <option value="Holiday Packages">Custom Holiday Tour Packages</option>
                <option value="Air Ticketing Advice">Air Ticket Consultation</option>
                <option value="Umrah Travel">Umrah Packages Information</option>
                <option value="General Inquiry">General Consultation</option>
              </select>
            </div>

            {/* Destination Selection */}
            <div>
              <label htmlFor="destination" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Travel Destination
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <select
                  name="destination"
                  id="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue-600/30 focus:border-brand-blue-600 transition"
                >
                  <option value="Singapore">Singapore (5,500 BDT)</option>
                  <option value="Thailand">Thailand (5,500 BDT)</option>
                  <option value="Malaysia">Malaysia (5,500 BDT)</option>
                  <option value="India">India (5,500 BDT)</option>
                  <option value="Other">Other Destination</option>
                </select>
              </div>
            </div>

            {/* Message Input */}
            <div>
              <label htmlFor="message" className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Your Travel Details / Questions
              </label>
              <textarea
                name="message"
                id="message"
                rows="3"
                value={formData.message}
                onChange={handleChange}
                placeholder="Include travel dates, number of travelers, or specific documents you have queries about..."
                className="block w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue-600/30 focus:border-brand-blue-600 transition resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-brand-blue-600 hover:bg-brand-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-600 disabled:opacity-50 cursor-pointer shadow-md transition"
            >
              {loading ? (
                <span>Sending Request...</span>
              ) : (
                <>
                  <Send className="h-4.5 w-4.5" />
                  <span>Submit Inquiry</span>
                </>
              )}
            </button>
            
          </form>
        )}
      </div>
    </div>
  );
}
