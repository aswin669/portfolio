'use client';

import React, { useEffect, useRef, useState } from 'react';
import LightboxModal, { ShowcaseItem } from './LightboxModal';

const DEFAULT_SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    subtitle: 'MERN Stack & Stripe',
    category: 'Full-Stack App',
    description: 'High-performance MERN stack online store with stripe integration and real-time inventory management.',
    image_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    display_order: 1,
    active: true,
  },
  {
    id: 2,
    title: 'SaaS Analytics Dashboard',
    subtitle: 'Next.js & Telemetry',
    category: 'Web Application',
    description: 'Real-time telemetry dashboard featuring interactive charts, export engine, and user role management.',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    display_order: 2,
    active: true,
  },
  {
    id: 3,
    title: 'Editorial Creative Canvas',
    subtitle: 'Interactive UI Engine',
    category: 'Interactive UI',
    description: 'Cinematic horizontal case-study gallery with scroll-driven diagonal card transitions.',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    display_order: 3,
    active: true,
  },
  {
    id: 4,
    title: 'AI Prompt Platform',
    subtitle: 'LLM & Fastify',
    category: 'AI Application',
    description: 'Full-stack AI assistant interface powered by LLM endpoints and streaming responses.',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    display_order: 4,
    active: true,
  },
  {
    id: 5,
    title: 'Task & Workflow OS',
    subtitle: 'Real-Time Sync',
    category: 'Productivity Tool',
    description: 'Collab workspace with kanban boards, real-time sync, and notification dispatch.',
    image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    display_order: 5,
    active: true,
  },
];

export default function AnimatedShowcase() {
  const [items, setItems] = useState<ShowcaseItem[]>(DEFAULT_SHOWCASE_ITEMS);
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
        if (Array.isArray(data) && data.length > 0) {
          if (data.length < 5) {
            // Merge database items with default showcase cards to guarantee a minimum 5-card deck
            const merged = [...data];
            DEFAULT_SHOWCASE_ITEMS.forEach((def, idx) => {
              if (merged.length < 5 && !merged.some((i) => i.title === def.title)) {
                merged.push({ ...def, id: 1000 + idx });
              }
            });
            setItems(merged);
          } else {
            setItems(data);
          }
        }
      })
      .catch(() => {});

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

  const N = items.length;

  return (
    <section
      id="showcase"
      ref={runwayRef}
      className="relative w-full h-[200vh] bg-[#f5f5f3] dark:bg-[#080808] text-primary transition-colors border-y border-outline-variant/60"
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
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between z-10 pt-2 shrink-0">
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

          {/* Background Parallax Typography */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
            <div 
              className="absolute text-primary opacity-[0.03] dark:opacity-[0.025] font-display-lg text-[13vw] font-black tracking-tighter uppercase whitespace-nowrap transition-transform duration-75 ease-out"
              style={{
                left: '10%',
                top: '15%',
                transform: `translate3d(${-scrollProgress * 25}vw, ${-scrollProgress * 25}vh, 0)`,
              }}
            >
              SELECTED WORK
            </div>
            <div 
              className="absolute text-primary opacity-[0.03] dark:opacity-[0.025] font-display-lg text-[13vw] font-black tracking-tighter uppercase whitespace-nowrap transition-transform duration-75 ease-out"
              style={{
                left: '42%',
                top: '55%',
                transform: `translate3d(${-scrollProgress * 32}vw, ${-scrollProgress * 32}vh, 0)`,
              }}
            >
              DIGITAL EXPERIENCES
            </div>
            <div 
              className="absolute text-primary opacity-[0.03] dark:opacity-[0.025] font-display-lg text-[13vw] font-black tracking-tighter uppercase whitespace-nowrap transition-transform duration-75 ease-out"
              style={{
                left: '18%',
                top: '75%',
                transform: `translate3d(${-scrollProgress * 20}vw, ${-scrollProgress * 20}vh, 0)`,
              }}
            >
              BUILT WITH PURPOSE
            </div>
          </div>

          {/* Main Diagonal Cards Runway (Bottom-Right ↖ Top-Left Trajectory) */}
          <div className="relative w-full max-w-7xl mx-auto flex-1 flex items-center justify-center z-10 my-4">
            {items.map((item, index) => {
              // Calculate target progress mapping (focal point centers from 0.0 to 1.0)
              // The last card centers exactly when the sticky section un-sticks
              const targetProgress = N > 1 ? index / (N - 1) : 0;
              const delta = (scrollProgress - targetProgress) * (N > 1 ? 1.6 : 1);

              // DIAGONAL MOVEMENT VECTOR:
              // When delta < 0 (entering from bottom-right):
              // translateX is POSITIVE (+vw), translateY is POSITIVE (+vh)
              // When delta > 0 (exiting to top-left):
              // translateX is NEGATIVE (-vw), translateY is NEGATIVE (-vh)
              const baseDistX = 65; // vw distance
              const baseDistY = 65; // vh distance

              const varX = ((index % 3) - 1) * 6; // slight variation per card
              const varY = (index % 2 === 0 ? -4 : 4); // slight vertical offset

              const translateX = -delta * baseDistX + varX;
              const translateY = -delta * baseDistY + varY;

              // SCALE TRANSITION:
              // Small (0.58) at bottom-right -> Focal Large (1.12) at center -> Small (0.58) at top-left
              const absDelta = Math.abs(delta);
              const scale = Math.max(0.58, 1.12 - absDelta * 0.45);

              // ROTATION TRANSITION:
              // Dynamic subtle rotation: +3.5° (bottom-right) -> 0° (center) -> -3.5° (top-left)
              const baseAngle = index % 2 === 0 ? 3.5 : -2.5;
              const rotate = baseAngle * (1 - delta * 0.8);

              // Z-INDEX: Focal central card gets highest priority
              const zIndex = Math.max(1, 50 - Math.round(absDelta * 25));

              // OPACITY: Fades smoothly when entering/exiting offscreen
              const opacity = Math.max(0, Math.min(1, 1.3 - absDelta * 1.0));

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
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80';
                      }}
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
