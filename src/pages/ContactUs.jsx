import React from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare } from 'lucide-react';
import InquiryForm from '../components/InquiryForm';

export default function ContactUs({ prefilledDestination }) {
  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-brand-green-600 tracking-widest uppercase bg-brand-green-500/10 px-3.5 py-1.5 rounded-full">
          Contact Us
        </span>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-brand-dark tracking-tight">
          Connect With Our <span className="text-brand-green-500">Travel Experts</span>
        </h1>
        <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
          Reach out by phone, WhatsApp, email, or visit our office. You can also submit the inquiry form below for a quick callback.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Contact Info & Map */}
        <div className="lg:col-span-6 space-y-8">
          
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="font-display font-extrabold text-xl text-brand-dark pb-3 border-b border-gray-100">
              Corporate Headquarters
            </h3>

            <div className="space-y-4 text-sm sm:text-base">
              
              <div className="flex items-start gap-3.5">
                <MapPin className="h-6 w-6 text-brand-green-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-brand-dark">Office Address</span>
                  <span className="text-gray-500 text-sm">
                    154 C/A, Motijheel,<br />
                    Dhaka - 1000, Bangladesh
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="h-5 w-5 text-brand-green-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-brand-dark">Telephone Hotlines</span>
                  <div className="space-y-1 text-sm font-semibold text-brand-blue-600">
                    <a href="tel:+8801913389573" className="hover:underline block">
                      +880 1913-389573
                    </a>
                    <a href="tel:+8801611204561" className="hover:underline block">
                      +880 1611-204561
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="h-5 w-5 text-brand-green-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-brand-dark">Email Correspondence</span>
                  <div className="space-y-0.5 text-sm">
                    <a href="mailto:geotrips19@gmail.com" className="text-brand-blue-600 hover:underline block font-semibold">
                      geotrips19@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Clock className="h-5 w-5 text-brand-green-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-brand-dark">Office Operating Hours</span>
                  <span className="text-gray-500 text-sm">
                    Saturday to Thursday: 9:00 AM to 6:00 PM <br />
                    <span className="text-red-500 font-bold">Friday: Closed</span>
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Interactive Mock Map View */}
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm h-80 relative flex flex-col justify-end">
            <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <MapPin className="h-10 w-10 text-brand-blue-600 animate-bounce" />
              <span className="block font-display font-bold text-gray-800">Motijheel C/A, Dhaka</span>
              <p className="text-xs text-gray-500 max-w-xs">
                Conveniently located in the heart of Dhaka's commercial center at 154 Motijheel C/A.
              </p>
              
              {/* Google Map Mock Button */}
              <a 
                href="https://maps.google.com/?q=154+Motijheel+Dhaka"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-brand-blue-600 hover:bg-brand-blue-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
              >
                Open Google Maps
              </a>
            </div>
            
            <div className="bg-brand-dark/95 text-white p-3.5 text-xs text-center z-10 font-medium">
              Motijheel Commercial District Parking Available
            </div>
          </div>

        </div>

        {/* Right Side: Inquiry Form */}
        <div className="lg:col-span-6">
          <InquiryForm prefilledDestination={prefilledDestination} />
        </div>

      </div>

    </div>
  );
}
