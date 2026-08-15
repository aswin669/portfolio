'use client';

import React, { useEffect, useRef, useState } from 'react';

const QUOTE_TEXT = "CODE IS NOT JUST ABOUT MAKING THINGS WORK. IT IS ABOUT MAKING THINGS WORK WELL, WITH CLARITY AND PURPOSE.";

export default function Philosophy() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let animId: number;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate relative position of section within viewport (0 = entering, 1 = leaving)
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
  }, []);

  const words = QUOTE_TEXT.split(' ');
  const totalWords = words.length;

  // Parallax Y displacement (moves text upward smoothly as user scrolls)
  const translateY = (0.5 - scrollProgress) * 50;

  return (
    <section
      id="philosophy"
      ref={containerRef}
      className="bg-black text-white py-24 sm:py-32 md:py-44 px-6 sm:px-10 md:px-16 overflow-hidden relative border-y border-neutral-900"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Editorial Subheader Label */}
        <div className="flex items-center gap-3 mb-8 sm:mb-12">
          <span className="w-8 h-[1px] bg-neutral-700"></span>
          <span className="font-mono-label text-xs sm:text-sm uppercase tracking-[0.3em] text-neutral-500 font-medium">
            MANIFESTO
          </span>
        </div>

        {/* Oversized Ultra-Thin Scroll-Linked Typography */}
        <div
          className="transition-transform duration-75 ease-out"
          style={{ transform: `translate3d(0, ${translateY}px, 0)` }}
        >
          <h2 className="font-display-lg text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[84px] font-extralight tracking-tight uppercase leading-[1.12] sm:leading-[1.15] text-left flex flex-wrap gap-x-[0.25em] gap-y-[0.1em]">
            {words.map((word, index) => {
              // Target activation window for each word based on its index
              const startWindow = 0.22 + (index / totalWords) * 0.52;
              const endWindow = startWindow + 0.12;

              let wordOpacity = 0.2; // default dark gray
              if (scrollProgress >= startWindow && scrollProgress <= endWindow) {
                // Peak illumination at middle of active window
                const localProgress = (scrollProgress - startWindow) / (endWindow - startWindow);
                wordOpacity = 0.2 + Math.sin(localProgress * Math.PI) * 0.8;
              } else if (scrollProgress > endWindow) {
                // After word has been passed, maintain clean readable state
                wordOpacity = 0.85;
              }

              return (
                <span
                  key={index}
                  className="transition-opacity duration-150 ease-out inline-block select-none"
                  style={{
                    color: `rgba(255, 255, 255, ${wordOpacity})`,
                    textShadow: wordOpacity > 0.75 ? '0 0 24px rgba(255, 255, 255, 0.3)' : 'none',
                  }}
                >
                  {word}
                </span>
              );
            })}
          </h2>
        </div>

        {/* Author / Designation Footer */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-neutral-900 flex items-center justify-between">
          <span className="font-mono-label text-xs sm:text-sm uppercase tracking-[0.25em] text-neutral-500 font-medium">
            &mdash; ASWIN S &bull; FULL-STACK DEVELOPER
          </span>
          <span className="font-mono-label text-[11px] text-neutral-600 uppercase tracking-widest hidden sm:inline-block">
            PHILOSOPHY 01 // 01
          </span>
        </div>
      </div>
    </section>
  );
}