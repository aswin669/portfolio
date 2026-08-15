'use client';

import React, { useEffect, useRef, useState } from 'react';
import LightboxModal, { ShowcaseItem } from './LightboxModal';

export default function AnimatedShowcase() {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Check reduced motion preference
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
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Compute total travel progress through viewport (0 = entering, 1 = exiting)
      const totalDistance = windowHeight + rect.height;
      const currentPos = windowHeight - rect.top;
      const rawProgress = currentPos / totalDistance;
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
      <section className="bg-black py-20 px-6 min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </section>
    );
  }

  if (items.length === 0) {
    return null; // Gracefully hide section if no showcase items exist
  }

  return (
    <section
      id="showcase"
      ref={sectionRef}
      className="bg-black text-white py-24 sm:py-32 lg:py-40 px-4 sm:px-8 md:px-12 relative overflow-hidden border-b border-neutral-900"
    >
      {/* Editorial Header */}
      <div className="max-w-6xl mx-auto mb-16 sm:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-neutral-700"></span>
            <span className="font-mono-label text-xs uppercase tracking-[0.3em] text-neutral-500 font-medium">
              FEATURED VISUALS
            </span>
          </div>
          <h3 className="font-display-lg text-2xl sm:text-4xl md:text-5xl font-extralight tracking-tight uppercase">
            ANIMATED SHOWCASE
          </h3>
        </div>
        <p className="font-body-md text-xs sm:text-sm text-neutral-400 max-w-sm">
          Scroll down to explore curated project visuals and interface compositions in motion.
        </p>
      </div>

      {/* Main Animated Composition / Grid Container */}
      <div className="max-w-7xl mx-auto min-h-[650px] md:min-h-[850px] relative">
        {reducedMotion ? (
          /* Reduced Motion Fallback: Clean Responsive Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setLightboxIndex(index)}
                className="group cursor-pointer bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="aspect-[16/10] w-full overflow-hidden bg-neutral-950">
                  <img
                    src={item.image_url}
                    alt={item.title || 'Showcase landscape image'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                {(item.title || item.category) && (
                  <div className="p-4 flex items-center justify-between border-t border-neutral-800">
                    <span className="font-display-lg text-sm font-semibold text-white">
                      {item.title}
                    </span>
                    {item.category && (
                      <span className="font-mono-label text-[10px] uppercase tracking-wider text-neutral-400 px-2 py-0.5 bg-neutral-800 rounded">
                        {item.category}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Cinematic Scroll-Linked Dynamic Parallax Composition */
          <div className="relative w-full h-[700px] md:h-[900px]">
            {items.map((item, index) => {
              const N = items.length;
              // Spread activation progress window across items
              const itemProgressOffset = index / N;
              
              // Deterministic spatial variation parameters per card
              const col = index % 3; // 0 (left), 1 (center), 2 (right)
              const baseRotations = [-4, 3.5, -2.5, 5, -3, 2, -5, 4];
              const rotation = baseRotations[index % baseRotations.length];

              // Base column left percentages
              const leftPositions = [5, 36, 67];
              const leftPos = leftPositions[col];

              // Top initial offsets
              const topOffsets = [5, 22, 12, 40, 55, 32, 70, 60];
              const baseTop = topOffsets[index % topOffsets.length];

              // Dynamic scroll transform calculations
              // Card vertical translation tied to scroll progress
              const yTranslate = (0.5 - scrollProgress) * (180 + (index % 4) * 60);

              // Scale expansion when centered in viewport
              const centerDist = Math.abs(scrollProgress - 0.5);
              const scale = 1.0 + (0.08 * (1 - Math.min(1, centerDist * 2))) * (index % 2 === 0 ? 1 : -0.5);

              // Opacity fading near viewport edges
              let cardOpacity = 1;
              if (scrollProgress < 0.1) {
                cardOpacity = scrollProgress / 0.1;
              } else if (scrollProgress > 0.9) {
                cardOpacity = (1 - scrollProgress) / 0.1;
              }

              return (
                <div
                  key={item.id}
                  onClick={() => setLightboxIndex(index)}
                  style={{
                    position: 'absolute',
                    left: `${leftPos}%`,
                    top: `${baseTop}%`,
                    width: '30%',
                    minWidth: '260px',
                    maxWidth: '420px',
                    transform: `translate3d(0, ${yTranslate}px, 0) scale(${scale.toFixed(3)}) rotate(${rotation}deg)`,
                    opacity: Math.max(0.2, Math.min(1, cardOpacity)),
                    zIndex: 10 + (index % 5),
                    willChange: 'transform, opacity',
                  }}
                  className="group cursor-pointer bg-neutral-900/90 backdrop-blur-sm border border-neutral-700/60 rounded-xl overflow-hidden shadow-2xl transition-shadow duration-300 hover:shadow-white/10 hover:border-white/40"
                >
                  {/* Landscape Image Container */}
                  <div className="aspect-[16/10] w-full overflow-hidden bg-black relative">
                    <img
                      src={item.image_url}
                      alt={item.title || item.category || 'Showcase image'}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity"></div>
                  </div>

                  {/* Card Info Overlay */}
                  {(item.title || item.category || item.subtitle) && (
                    <div className="p-3.5 sm:p-4 bg-neutral-950/90 border-t border-neutral-800 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-display-lg text-xs sm:text-sm font-semibold text-white group-hover:text-white transition-colors truncate">
                          {item.title || 'Visual Project'}
                        </span>
                        {item.category && (
                          <span className="font-mono-label text-[9px] uppercase tracking-wider text-neutral-300 px-2 py-0.5 bg-neutral-800 rounded">
                            {item.category}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p className="font-body-md text-[11px] text-neutral-400 line-clamp-1">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        items={items}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onSelectIndex={(newIdx) => setLightboxIndex(newIdx)}
      />
    </section>
  );
}
