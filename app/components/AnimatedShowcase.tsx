'use client';

import React, { useEffect, useRef, useState } from 'react';
import LightboxModal, { ShowcaseItem } from './LightboxModal';

// Roman numerals helper for Chapter progress tracker (CHAPTER I, CHAPTER II, etc.)
function toRoman(num: number): string {
  const lookup: [string, number][] = [
    ['M', 1000],
    ['CM', 900],
    ['D', 500],
    ['CD', 400],
    ['C', 100],
    ['XC', 90],
    ['L', 50],
    ['XL', 40],
    ['X', 10],
    ['IX', 9],
    ['V', 5],
    ['IV', 4],
    ['I', 1],
  ];
  let roman = '';
  for (const [letter, value] of lookup) {
    while (num >= value) {
      roman += letter;
      num -= value;
    }
  }
  return roman || 'I';
}

export default function AnimatedShowcase() {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const runwayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Detect reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    // Fetch public active showcase items
    fetch('/api/showcase/animated')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setItems(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setItems([]);
        setLoading(false);
      });

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion || items.length === 0) return;

    let animId: number;

    const handleScroll = () => {
      if (!runwayRef.current) return;
      const rect = runwayRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress (0 to 1) as sticky section runway scrolls through viewport
      const totalScrollable = rect.height - windowHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const rawProgress = currentScroll / totalScrollable;
      const clampedProgress = Math.max(0, Math.min(1, rawProgress));

      setScrollProgress(clampedProgress);
    };

    const onScroll = () => {
      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(animId);
    };
  }, [reducedMotion, items.length]);

  if (loading) {
    return (
      <section className="bg-[#f5f5f3] dark:bg-[#0a0a0a] py-20 px-6 min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </section>
    );
  }

  if (items.length === 0) {
    return null; // Gracefully hide if no active showcase items exist
  }

  const N = items.length;
  // Current focal index based on scroll progress
  const currentFocalIndex = Math.min(N - 1, Math.floor(scrollProgress * N));

  return (
    <section
      id="showcase"
      ref={runwayRef}
      className="relative w-full h-[380vh] bg-[#f5f5f3] dark:bg-[#080808] text-primary transition-colors border-y border-outline-variant/60"
    >
      {reducedMotion ? (
        /* Reduced Motion Fallback: Clean Responsive Grid */
        <div className="py-20 px-6 max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="font-mono-label text-xs uppercase tracking-[0.3em] text-secondary block mb-2">
              EDITORIAL VISUALS
            </span>
            <h2 className="font-display-lg text-3xl font-bold uppercase">Showcase Gallery</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setLightboxIndex(index)}
                className="group cursor-pointer bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[3/4] w-full overflow-hidden bg-black">
                  <img
                    src={item.image_url}
                    alt={item.title || 'Showcase portrait magazine cover'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm">{item.title}</h3>
                  {item.category && (
                    <span className="text-[10px] uppercase font-mono-label px-2 py-0.5 bg-surface-container rounded mt-1 inline-block">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Sticky Viewport Animation Engine: DIAGONAL (Bottom-Right ↖ Top-Left) */
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between p-6 md:p-10 select-none">
          {/* Top Bar Editorial Header */}
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between z-10 pt-2">
            <div className="flex items-center gap-3">
              <span className="w-6 h-[1px] bg-primary"></span>
              <span className="font-mono-label text-[11px] uppercase tracking-[0.25em] text-secondary font-semibold">
                EDITORIAL VISUALS
              </span>
            </div>
            <span className="font-mono-label text-[11px] uppercase tracking-widest text-secondary font-medium">
              SCROLL TO EXPLORE
            </span>
          </div>

          {/* Watermark Background Typography */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden select-none opacity-[0.04]">
            <span className="font-display-lg text-[13vw] font-black uppercase tracking-tighter whitespace-nowrap">
              EDITORIAL COVER SHOWCASE
            </span>
          </div>

          {/* Main Diagonal Cards Runway (Bottom-Right ↖ Top-Left Trajectory) */}
          <div className="relative w-full max-w-7xl mx-auto flex-1 flex items-center justify-center z-10 my-4">
            {items.map((item, index) => {
              // Calculate delta relative to scroll position
              // targetProgress for card i
              const targetProgress = N > 1 ? index / (N - 1) : 0;
              const delta = (scrollProgress - targetProgress) * (N > 1 ? N * 0.8 : 1);

              // DIAGONAL MOVEMENT VECTOR:
              // When delta < 0 (entering from bottom-right):
              // translateX is POSITIVE (+vw), translateY is POSITIVE (+vh)
              // When delta > 0 (exiting to top-left):
              // translateX is NEGATIVE (-vw), translateY is NEGATIVE (-vh)
              const baseDistX = 52; // vw distance
              const baseDistY = 52; // vh distance

              const varX = ((index % 3) - 1) * 8; // slight variation per card
              const varY = (index % 2 === 0 ? -6 : 6); // slight vertical offset

              const translateX = -delta * baseDistX + varX;
              const translateY = -delta * baseDistY + varY;

              // SCALE TRANSITION:
              // Small (0.58) at bottom-right -> Focal Large (1.12) at center -> Small (0.58) at top-left
              const absDelta = Math.abs(delta);
              const scale = Math.max(0.58, 1.12 - absDelta * 0.36);

              // ROTATION TRANSITION:
              // Dynamic subtle rotation: +3.5° (bottom-right) -> 0° (center) -> -3.5° (top-left)
              const baseAngle = index % 2 === 0 ? 3.5 : -2.5;
              const rotate = baseAngle * (1 - delta * 0.8);

              // Z-INDEX: Focal central card gets highest priority
              const zIndex = Math.max(1, 50 - Math.round(absDelta * 20));

              // OPACITY: Fades smoothly when entering/exiting offscreen
              const opacity = Math.max(0, Math.min(1, 1.3 - absDelta * 0.75));

              return (
                <div
                  key={item.id}
                  onClick={() => setLightboxIndex(index)}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: 'clamp(240px, 24vw, 380px)',
                    aspectRatio: '3/4',
                    transform: `translate3d(calc(-50% + ${translateX}vw), calc(-50% + ${translateY}vh), 0) scale(${scale.toFixed(3)}) rotate(${rotate.toFixed(2)}deg)`,
                    zIndex,
                    opacity,
                    willChange: 'transform, opacity',
                  }}
                  className="group cursor-pointer bg-surface border-2 border-white/90 dark:border-white/20 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-primary/30 hover:border-primary/60 flex flex-col justify-between"
                >
                  {/* Full Portrait Magazine Cover Container */}
                  <div className="relative w-full h-full bg-black overflow-hidden flex flex-col justify-between p-4">
                    <img
                      src={item.image_url}
                      alt={item.title || item.category || 'Showcase portrait magazine cover'}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60 group-hover:opacity-40 transition-opacity"></div>

                    {/* Top Tag Overlay */}
                    <div className="relative z-10 flex items-center justify-between">
                      {item.category ? (
                        <span className="font-mono-label text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 bg-black/60 backdrop-blur-md text-white border border-white/20 rounded-full">
                          {item.category}
                        </span>
                      ) : (
                        <span></span>
                      )}
                      <span className="font-mono-label text-[10px] text-white/70 font-semibold uppercase tracking-wider">
                        ISSUE #{index + 1}
                      </span>
                    </div>

                    {/* Bottom Metadata Overlay */}
                    {(item.title || item.subtitle) && (
                      <div className="relative z-10 pt-4 border-t border-white/20">
                        {item.title && (
                          <h4 className="font-display-lg text-lg sm:text-xl font-bold text-white tracking-tight leading-tight uppercase mb-0.5 truncate">
                            {item.title}
                          </h4>
                        )}
                        {item.subtitle && (
                          <p className="font-mono-label text-[11px] text-white/80 line-clamp-1 uppercase tracking-wider">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Bar Chapter Tracker & Progress Line (Matching Reference Images 1, 2, 3) */}
          <div className="w-full max-w-7xl mx-auto z-10 pb-2 flex flex-col gap-3">
            {/* Scroll Progress Bar */}
            <div className="w-full bg-outline-variant/40 h-[2px] rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-150 ease-out"
                style={{ width: `${(scrollProgress * 100).toFixed(1)}%` }}
              ></div>
            </div>

            {/* Chapter Items List */}
            <div className="flex items-center justify-between overflow-x-auto gap-6 py-1 no-scrollbar">
              <div className="flex items-center gap-6">
                {items.slice(0, 6).map((item, idx) => {
                  const isActive = idx === currentFocalIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        const targetPos = N > 1 ? idx / (N - 1) : 0;
                        if (runwayRef.current) {
                          const rect = runwayRef.current.getBoundingClientRect();
                          const totalScrollable = rect.height - window.innerHeight;
                          window.scrollTo({
                            top: window.scrollY + rect.top + targetPos * totalScrollable,
                            behavior: 'smooth',
                          });
                        }
                      }}
                      className={`flex items-center gap-2 font-mono-label text-xs uppercase transition-all ${
                        isActive
                          ? 'text-primary font-bold opacity-100 scale-105'
                          : 'text-secondary opacity-50 hover:opacity-80'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-primary' : 'bg-transparent'}`}></span>
                      <span>CHAPTER {toRoman(idx + 1)}</span>
                    </button>
                  );
                })}
              </div>

              <span className="font-mono-label text-[11px] text-secondary uppercase font-medium hidden sm:inline-block">
                {currentFocalIndex + 1} OF {N} EDITORIAL COVER{N > 1 ? 'S' : ''}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <LightboxModal
        items={items}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onSelectIndex={(newIdx) => setLightboxIndex(newIdx)}
      />
    </section>
  );
}
