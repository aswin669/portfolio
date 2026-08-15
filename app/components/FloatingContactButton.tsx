'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function FloatingContactButton() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return (
    <Link
      href="/contact"
      aria-label="Contact us"
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[9000] group flex items-center justify-center select-none outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
    >
      <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
        {/* Layer 1: Outer Rotating Circular Text Ring */}
        <div
          className={`absolute inset-0 w-full h-full pointer-events-none transition-transform ${
            reducedMotion ? '' : 'animate-spin-slow'
          }`}
          style={{
            animation: reducedMotion ? 'none' : 'spin 12s linear infinite',
          }}
        >
          <svg className="w-full h-full" viewBox="0 0 160 160">
            <path
              id="contactCirclePath"
              d="M 80, 80 m -62, 0 a 62,62 0 1,1 124,0 a 62,62 0 1,1 -124,0"
              fill="none"
            />
            <text className="fill-current text-primary font-mono-label text-[10.5px] uppercase tracking-[0.24em] font-semibold">
              <textPath href="#contactCirclePath" startOffset="0%">
                CONTACT ✦ CONTACT ✦ CONTACT ✦ CONTACT ✦
              </textPath>
            </text>
          </svg>
        </div>

        {/* Layer 2: Stationary Primary Theme Center Circle */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary text-on-primary border border-outline-variant/60 rounded-full flex items-center justify-center shadow-xl transition-transform duration-300 ease-out group-hover:scale-105">
          {/* Layer 3: Stationary Minimalist Envelope Icon */}
          <svg
            className="w-7 h-7 sm:w-9 sm:h-9 text-current"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="4" width="20" height="16" rx="4" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
