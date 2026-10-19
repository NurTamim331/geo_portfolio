'use client';

import React from 'react';

// ISO 3166-1 alpha-2 codes for our key countries
const COUNTRY_CODES: Record<string, { code: string; name: string }> = {
  singapore: { code: 'sg', name: 'Singapore' },
  thailand: { code: 'th', name: 'Thailand' },
  malaysia: { code: 'my', name: 'Malaysia' },
  china: { code: 'cn', name: 'China' },
  canada: { code: 'ca', name: 'Canada' },
  australia: { code: 'au', name: 'Australia' },
  'saudi arabia': { code: 'sa', name: 'Saudi Arabia' },
  saudi: { code: 'sa', name: 'Saudi Arabia' },
  uae: { code: 'ae', name: 'United Arab Emirates' },
  dubai: { code: 'ae', name: 'Dubai / UAE' },
  indonesia: { code: 'id', name: 'Indonesia' },
  bali: { code: 'id', name: 'Bali / Indonesia' },
  bangladesh: { code: 'bd', name: 'Bangladesh' },
  turkey: { code: 'tr', name: 'Turkey' },
};

interface CountryFlagProps {
  country: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function CountryFlag({ country, size = 'md', className = '' }: CountryFlagProps) {
  const normalized = country.toLowerCase().trim();
  const info = COUNTRY_CODES[normalized] || { code: 'un', name: country };

  const dimensions = {
    sm: 'w-5 h-3.5',
    md: 'w-7 h-5',
    lg: 'w-9 h-6',
    xl: 'w-12 h-8',
  }[size];

  return (
    <span className={`inline-flex items-center justify-center shrink-0 overflow-hidden rounded shadow-sm border border-black/10 bg-slate-100 ${dimensions} ${className}`} title={info.name}>
      <img
        src={`https://flagcdn.com/w80/${info.code}.png`}
        srcSet={`https://flagcdn.com/w160/${info.code}.png 2x`}
        alt={`${info.name} flag`}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          // Fallback if network blocked
          const target = e.currentTarget;
          target.style.display = 'none';
          if (target.parentElement) {
            target.parentElement.innerText = info.code.toUpperCase();
          }
        }}
      />
    </span>
  );
}
