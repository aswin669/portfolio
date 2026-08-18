'use client';

import React, { useEffect, useState } from 'react';
import LightboxModal, { ShowcaseItem } from './LightboxModal';

const DEFAULT_SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    subtitle: 'MERN Stack & Stripe Integration',
    category: 'Full-Stack App',
    description: 'High-performance MERN stack online store with stripe integration, real-time inventory management, and custom checkout pipeline.',
    image_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    display_order: 1,
    active: true,
  },
  {
    id: 2,
    title: 'SaaS Analytics Dashboard',
    subtitle: 'Next.js & Real-Time Telemetry',
    category: 'Web Application',
    description: 'Real-time telemetry dashboard featuring interactive charts, export engine, automated reporting, and user role management.',
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    display_order: 2,
    active: true,
  },
  {
    id: 3,
    title: 'Editorial Creative Canvas',
    subtitle: 'Interactive 3D UI Engine',
    category: 'Interactive UI',
    description: 'Cinematic case-study gallery featuring scroll-driven 3D depth, responsive magazine layouts, and fluid WebGL-inspired motion.',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    display_order: 3,
    active: true,
  },
  {
    id: 4,
    title: 'AI Prompt Platform',
    subtitle: 'LLM Integration & Fastify',
    category: 'AI Application',
    description: 'Full-stack AI assistant interface powered by LLM endpoints, streaming tokens, context window management, and custom prompt templates.',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    display_order: 4,
    active: true,
  },
  {
    id: 5,
    title: 'Task & Workflow OS',
    subtitle: 'Real-Time Sync Engine',
    category: 'Productivity',
    description: 'Collaborative workspace featuring kanban boards, real-time sync, notification dispatch, and timeline view.',
    image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    display_order: 5,
    active: true,
  },
];

export default function AnimatedShowcase() {
  const [items, setItems] = useState<ShowcaseItem[]>(DEFAULT_SHOWCASE_ITEMS);
  const [activeId, setActiveId] = useState<number>(1);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    fetch('/api/showcase/animated')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          if (data.length < 5) {
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
  }, []);

  // Spotlight mouse tracking handler
  const handleSectionMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSpotlightPos({ x, y });
  };

  return (
    <section 
      id="showcase" 
      onMouseMove={handleSectionMouseMove}
      className="relative w-full py-12 sm:py-20 md:py-28 bg-white dark:bg-[#0d0f0f] text-gray-900 dark:text-gray-100 overflow-hidden border-y border-gray-200 dark:border-gray-800 select-none"
    >
      {/* Interactive Radial Spotlight Background */}
      <div 
        style={{
          background: `radial-gradient(600px circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(0,0,0,0.03), transparent 60%)`,
        }}
        className="absolute inset-0 pointer-events-none transition-all duration-150 ease-out"
      ></div>

      {/* Grid Background Watermark */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden max-w-full">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:3rem_3rem]"></div>
        <div className="absolute text-black/[0.03] dark:text-white/[0.02] font-display-lg text-[14vw] sm:text-[12vw] font-black tracking-tighter uppercase whitespace-nowrap top-1/2 left-4 sm:left-10 -translate-y-1/2 pointer-events-none max-w-full overflow-hidden">
          EDITORIAL GALLERY
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 z-10 flex flex-col items-center">
        
        {/* Header Title Bar */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12 border-b border-gray-200 dark:border-gray-800 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-6 h-[1px] bg-gray-900 dark:bg-gray-100"></span>
              <span className="font-mono-label text-[11px] sm:text-xs uppercase tracking-[0.25em] text-gray-600 dark:text-gray-400 font-semibold">
                EDITORIAL VISUAL GALLERY
              </span>
            </div>
            <h2 className="font-display-lg text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-gray-900 dark:text-white">
              Interactive Accordion Showcase
            </h2>
          </div>
          <p className="font-mono-label text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 hidden sm:block">
            {items.length} ISSUES PUBLISHED
          </p>
        </div>

        {/* Expanding Accordion Horizontal/Vertical Track */}
        <div className="w-full flex flex-col md:flex-row gap-3 md:gap-4 h-auto md:h-[540px] my-2 sm:my-4">
          {items.map((item, index) => {
            const isExpanded = item.id === activeId;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setActiveId(item.id)}
                onClick={() => {
                  if (isExpanded) {
                    setLightboxIndex(items.findIndex((i) => i.id === item.id));
                  } else {
                    setActiveId(item.id);
                  }
                }}
                className={`relative rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer border transition-all duration-500 ease-out flex flex-col justify-between p-4 sm:p-6 bg-black ${
                  isExpanded
                    ? 'min-h-[280px] sm:min-h-[340px] md:min-h-0 md:flex-[4] flex-1 border-gray-900 dark:border-gray-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]'
                    : 'min-h-[90px] sm:min-h-[110px] md:min-h-0 md:flex-[0.9] flex-1 border-gray-800 hover:border-gray-500 opacity-85 hover:opacity-100'
                }`}
              >
                {/* Background Magazine Cover Artwork */}
                <img
                  src={item.image_url}
                  alt={item.title || item.category || 'Showcase magazine cover'}
                  className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ${
                    isExpanded ? 'scale-105' : 'scale-100'
                  }`}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80';
                  }}
                />

                {/* Dark Vignette Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/40 transition-opacity duration-500 ${
                    isExpanded ? 'opacity-80' : 'opacity-85'
                  }`}
                ></div>

                {/* Top Badge Metadata */}
                <div className="relative z-10 flex items-center justify-between">
                  {item.category ? (
                    <span className="font-mono-label text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.2em] px-2.5 sm:px-3 py-1 bg-black/70 backdrop-blur-md text-white/90 border border-white/20 rounded-full">
                      {item.category}
                    </span>
                  ) : (
                    <span></span>
                  )}
                  <span className="font-mono-label text-[9px] sm:text-[10px] text-white/80 font-bold uppercase tracking-[0.2em]">
                    ISSUE #{String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Bottom Content Metadata */}
                <div className="relative z-10 pt-3 sm:pt-4 border-t border-white/20 flex flex-col justify-end">
                  {/* Expanded Full Content View */}
                  {isExpanded ? (
                    <div className="animate-fadeIn">
                      {item.title && (
                        <h3 className="font-display-lg text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight uppercase mb-1 drop-shadow-md">
                          {item.title}
                        </h3>
                      )}
                      {item.subtitle && (
                        <p className="font-mono-label text-[10px] sm:text-[11px] text-white/80 uppercase tracking-widest mb-2 sm:mb-3">
                          {item.subtitle}
                        </p>
                      )}
                      {item.description && (
                        <p className="font-body-md text-xs sm:text-sm text-white/70 leading-relaxed max-w-xl line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-2 text-[10px] font-mono-label text-white/90 uppercase tracking-wider font-semibold">
                        <span>TAP FOR FULLSCREEN LIGHTBOX</span>
                        <span className="material-symbols-outlined text-xs">open_in_full</span>
                      </div>
                    </div>
                  ) : (
                    /* Compressed Title View (Both Mobile & Desktop) */
                    <div className="flex flex-col">
                      <h4 className="font-display-lg text-sm sm:text-base md:text-lg font-bold text-white uppercase tracking-tight truncate">
                        {item.title}
                      </h4>
                      <p className="font-mono-label text-[9px] sm:text-[10px] text-white/60 uppercase tracking-wider truncate">
                        {item.subtitle || item.category}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

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

