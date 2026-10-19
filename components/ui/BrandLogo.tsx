'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  linkHref?: string;
  variant?: 'image' | 'badge' | 'full';
}

export function BrandLogo({
  className,
  size = 'md',
  showTagline = true,
  linkHref = '/',
  variant = 'image',
}: BrandLogoProps) {
  const dimensions = {
    sm: { width: 120, height: 42, imgClass: 'h-9 w-auto' },
    md: { width: 150, height: 52, imgClass: 'h-11 w-auto' },
    lg: { width: 200, height: 70, imgClass: 'h-16 w-auto' },
    xl: { width: 280, height: 98, imgClass: 'h-24 w-auto' },
  }[size];

  const content = (
    <div className={cn('inline-flex items-center gap-3 select-none group', className)}>
      <div className="relative overflow-hidden rounded-xl border border-sky-400/30 bg-[#0104c3] shadow-md shadow-[#0104c3]/30 p-1 transition-all duration-300 group-hover:border-amber-400/60 group-hover:shadow-amber-400/20 group-hover:scale-102">
        <Image
          src="/logo.jpg"
          alt="GEO Trips – 1 Stop multiple Service Travel Agent"
          width={dimensions.width}
          height={dimensions.height}
          priority
          className={cn('object-contain rounded-lg', dimensions.imgClass)}
        />
      </div>

      {showTagline && size !== 'sm' && (
        <div className="hidden sm:flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-black text-xl tracking-wider text-amber-400 drop-shadow-sm">
              GEO<span className="text-sky-400">TRIPS</span>
            </span>
          </div>
          <span className="text-[10px] font-bold text-amber-300/90 tracking-wide uppercase flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            1 Stop Multiple Service
          </span>
          <span className="text-[9px] font-semibold text-sky-200 tracking-widest uppercase">
            Travel Agent
          </span>
        </div>
      )}
    </div>
  );

  if (linkHref) {
    return (
      <Link href={linkHref} className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-xl">
        {content}
      </Link>
    );
  }

  return content;
}
