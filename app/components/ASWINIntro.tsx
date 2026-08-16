'use client';

import React, { useEffect, useState } from 'react';

// Development override: Set to true to force intro to play on every refresh during dev/testing
const FORCE_SHOW_INTRO = true;

export default function ASWINIntro() {
  const [phase, setPhase] = useState<'init' | 'loader' | 'brand' | 'hold' | 'exit' | 'done'>('init');
  const [destroy, setDestroy] = useState(false);

  useEffect(() => {
    // 1. Check session storage & reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const hasSeenIntro = sessionStorage.getItem('aswin_intro_seen');
    const urlParams = new URLSearchParams(window.location.search);
    const forceQuery = urlParams.get('intro') === 'true';

    if ((hasSeenIntro && !FORCE_SHOW_INTRO && !forceQuery) || mediaQuery.matches) {
      setDestroy(true);
      return;
    }

    // 2. Timing sequence timeline
    // 0.0s - 0.6s: Init solid black screen
    const tLoader = setTimeout(() => {
      setPhase('loader');
    }, 600);

    // 0.6s - 1.6s: Centered minimal loader phase
    const tBrand = setTimeout(() => {
      setPhase('brand');
    }, 1600);

    // 1.6s - 2.6s: ASWIN_S brand wordmark reveal
    const tHold = setTimeout(() => {
      setPhase('hold');
    }, 2600);

    // 2.6s - 3.4s: Hold phase, then initiate upward curtain slide
    const tExit = setTimeout(() => {
      setPhase('exit');
    }, 3400);

    // 3.4s - 4.4s: Complete exit transition and unmount component
    const tDone = setTimeout(() => {
      setPhase('done');
      setDestroy(true);
      sessionStorage.setItem('aswin_intro_seen', 'true');
    }, 4400);

    return () => {
      clearTimeout(tLoader);
      clearTimeout(tBrand);
      clearTimeout(tHold);
      clearTimeout(tExit);
      clearTimeout(tDone);
    };
  }, []);

  if (destroy) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[99999] bg-[#050505] text-white flex flex-col items-center justify-center select-none overflow-hidden transition-transform duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] ${
        phase === 'exit' ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      {/* Centered Content Container */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Phase 1: Minimal Centered Loader Spinner */}
        <div
          className={`transition-all duration-700 ease-out ${
            phase === 'loader' ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none absolute'
          }`}
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 border-2 sm:border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
        </div>

        {/* Phase 2 & 3: ASWIN_S Brand Wordmark Reveal */}
        <div
          className={`flex flex-col items-center gap-3 transition-all duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            phase === 'brand' || phase === 'hold' || phase === 'exit'
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-4 scale-95 pointer-events-none absolute'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="w-6 h-[1px] bg-white/40"></span>
            <span className="font-mono-label text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/60 font-semibold">
              FULL STACK DEVELOPER
            </span>
            <span className="w-6 h-[1px] bg-white/40"></span>
          </div>

          <h1 className="font-display-lg text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-white uppercase">
            ASWIN_S
          </h1>
        </div>
      </div>
    </div>
  );
}
