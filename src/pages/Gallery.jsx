import React, { useState } from 'react';
import { Camera, MapPin, Tag } from 'lucide-react';

export default function Gallery() {
  const [filter, setFilter] = useState('all');

  const galleryItems = [
    {
      id: 1,
      category: 'destinations',
      title: 'Marina Bay Sands, Singapore',
      desc: 'One of the leading corporate tourism destinations in Southeast Asia.',
      imgSrc: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80',
      tag: 'Singapore'
    },
    {
      id: 2,
      category: 'destinations',
      title: 'Grand Palace, Bangkok',
      desc: 'Cultural sights and tour package destinations across Thailand.',
      imgSrc: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=600&q=80',
      tag: 'Thailand'
    },
    {
      id: 3,
      category: 'corporate',
      title: 'Apex Pharmaceuticals Retreat',
      desc: 'Corporate outbound tour managed by GEO Trips for 120 executives in Bangkok.',
      imgSrc: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80',
      tag: 'Outbound MICE'
    },
    {
      id: 4,
      category: 'office',
      title: 'Dhaka Headquarters Boardroom',
      desc: 'Our modern corporate office where personalized visa dossiers are constructed.',
      imgSrc: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
      tag: 'Dhaka Office'
    },
    {
      id: 5,
      category: 'destinations',
      title: 'Petronas Twin Towers, Kuala Lumpur',
      desc: 'Corporate business and leisure travel packages to Malaysia.',
      imgSrc: 'https://images.unsplash.com/photo-1596422846543-75c6fc18a51b?auto=format&fit=crop&w=600&q=80',
      tag: 'Malaysia'
    },
    {
      id: 6,
      category: 'corporate',
      title: 'Standard Chartered Team Outing',
      desc: 'Team building and accommodation coordination in Singapore.',
      imgSrc: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
      tag: 'Team Building'
    },
    {
      id: 7,
      category: 'destinations',
      title: 'Taj Mahal, Agra',
      desc: 'Cultural travel and historical tour coordination for groups in India.',
      imgSrc: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&q=80',
      tag: 'India'
    },
    {
      id: 8,
      category: 'office',
      title: 'Visa Documentation Library',
      desc: 'Strictly secure record keeping to protect user passport scans and financial sheets.',
      imgSrc: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80',
      tag: 'Security Desk'
    }
  ];

  const filteredItems = filter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

  return (
    <div className="space-y-12 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-brand-green-600 tracking-widest uppercase bg-brand-green-500/10 px-3.5 py-1.5 rounded-full">
          Photo Gallery
        </span>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-brand-dark tracking-tight">
          Visual Insights of <span className="text-brand-green-500">Our Operations</span>
        </h1>
        <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
          Take a look at destinations we guide, corporate outings we manage, and our secure office settings in Dhaka.
        </p>
      </div>

      {/* Filter Menu */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-gray-100 pb-6">
        {[
          { id: 'all', label: 'All Photos' },
          { id: 'destinations', label: 'Destinations' },
          { id: 'corporate', label: 'Corporate Events' },
          { id: 'office', label: 'Office & Security' }
        ].map((btn) => (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
              filter === btn.id
                ? 'bg-brand-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition duration-300 flex flex-col justify-between"
          >
            {/* Image Wrapper */}
            <div className="relative aspect-video overflow-hidden bg-slate-100">
              <img 
                src={item.imgSrc} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                onError={(e) => {
                  // Fallback to high quality styling if unsplash block
                  e.target.style.display = 'none';
                  e.target.parentNode.className = "w-full h-full bg-gradient-to-br from-brand-dark to-brand-blue-900 flex items-center justify-center p-6 text-center text-white";
                }}
              />
              <div className="absolute top-3 left-3 bg-brand-dark/80 backdrop-blur-sm text-brand-green-500 text-[10px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-full flex items-center gap-1">
                <Tag className="h-3 w-3" />
                <span>{item.tag}</span>
              </div>
            </div>

            {/* Description details */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div className="space-y-1">
                <h3 className="font-display font-extrabold text-sm sm:text-base text-brand-dark leading-tight group-hover:text-brand-blue-600 transition">
                  {item.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
