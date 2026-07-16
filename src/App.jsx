import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import VisaDetailModal from './components/VisaDetailModal';

// Pages
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Services from './pages/Services';
import VisaInfo from './pages/VisaInfo';
import WhyChooseUs from './pages/WhyChooseUs';
import Gallery from './pages/Gallery';
import Testimonials from './pages/Testimonials';
import FAQ from './pages/FAQ';
import ContactUs from './pages/ContactUs';

import { Phone, MessageSquare, ArrowUp, ChevronUp } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  
  // Visa Detailed Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVisa, setSelectedVisa] = useState(null);
  const [prefilledDestination, setPrefilledDestination] = useState('Singapore');

  // Handle navigating to contact form with prefilled visa selection
  const handleApplyVisa = (countryName) => {
    setPrefilledDestination(countryName);
    setActivePage('contact');
    window.scrollTo({ top: document.body.scrollHeight || 1000, behavior: 'smooth' });
  };

  const handleOpenVisaModal = (visaData) => {
    setSelectedVisa(visaData);
    setIsModalOpen(true);
  };

  // Scroll to Top helper
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render current page based on state
  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home onNavigate={setActivePage} onApply={handleApplyVisa} />;
      case 'about':
        return <AboutUs onNavigate={setActivePage} />;
      case 'services':
        return <Services onNavigate={setActivePage} />;
      case 'visa':
        return <VisaInfo onOpenModal={handleOpenVisaModal} onApply={handleApplyVisa} />;
      case 'why-choose-us':
        return <WhyChooseUs onNavigate={setActivePage} />;
      case 'gallery':
        return <Gallery />;
      case 'testimonials':
        return <Testimonials onNavigate={setActivePage} />;
      case 'faq':
        return <FAQ />;
      case 'contact':
        return <ContactUs prefilledDestination={prefilledDestination} />;
      default:
        return <Home onNavigate={setActivePage} onApply={handleApplyVisa} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 selection:bg-brand-green-200 selection:text-brand-dark">
      
      {/* Top Banner (Corporate Announcement) */}
      <div className="bg-brand-dark-light text-white text-[11px] py-2 px-4 border-b border-white/5 relative z-50 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center font-semibold tracking-wide">
          <div>
            <span>GEO Trips: Trusted corporate travel consultant & visa screening center for 25+ years.</span>
          </div>
          <div className="flex items-center gap-4 text-brand-green-500">
            <span>Direct Desk: +880 2-9876543</span>
            <span>Support: Sat - Thu (9AM - 6PM)</span>
          </div>
        </div>
      </div>

      {/* Navigation Header */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Page Area */}
      <main className="flex-grow">
        {renderPage()}
      </main>

      {/* Footer bar */}
      <Footer setActivePage={setActivePage} />

      {/* Visa Requirements Overlay Modal */}
      <VisaDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        visaData={selectedVisa}
        onApply={handleApplyVisa}
      />

      {/* Persistent Floating Quick Contacts (Mobile-first CTAs) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        
        {/* Scroll To Top */}
        <button
          onClick={scrollToTop}
          className="p-3 bg-white hover:bg-slate-50 text-gray-500 border border-gray-200 rounded-full shadow-lg transition duration-200 cursor-pointer hidden md:flex items-center justify-center hover:-translate-y-0.5"
          title="Scroll to Top"
        >
          <ChevronUp className="h-5 w-5" />
        </button>

        {/* WhatsApp Call Widget */}
        <a
          href="https://wa.me/8801712345678"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-xl transition duration-200 flex items-center justify-center hover:scale-105"
          title="WhatsApp Support"
        >
          <MessageSquare className="h-6 w-6" />
        </a>

        {/* Direct Call Widget */}
        <a
          href="tel:+8801712345678"
          className="p-3.5 bg-brand-blue-600 hover:bg-brand-blue-700 text-white rounded-full shadow-xl transition duration-200 flex items-center justify-center hover:scale-105"
          title="Call Hotline"
        >
          <Phone className="h-6 w-6" />
        </a>

      </div>

    </div>
  );
}
