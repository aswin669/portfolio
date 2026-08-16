'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useSettings } from '@/lib/useSettings';

export default function Footer() {
  const s = useSettings();
  const siteName = s.site_name || 'ASWIN_S';
  const tagline = s.site_tagline || 'MERN Stack Developer crafting dynamic, full-stack web applications.';
  const github = s.github_url || 'https://github.com/aswin669';
  const linkedin = s.linkedin_url || 'https://linkedin.com/in/aswin669';
  const email = s.email_address || 'Aswinsreedharan669@gmail.com';

  const footerRef = useRef<HTMLElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let animId: number;

    const handleScroll = () => {
      if (!footerRef.current) return;
      const rect = footerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate progress of footer entering viewport
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

  // Parallax translation for the oversized bottom wordmark (20px - 40px range)
  const wordmarkY = (1 - scrollProgress) * 35;
  const contentY = (1 - scrollProgress) * 20;

  return (
    <footer
      ref={footerRef}
      className="w-full relative bg-black text-white overflow-hidden select-none"
    >
      {/* 1. Sharp Geometric Diagonal Cut Top Transition */}
      <div className="w-full h-12 sm:h-20 bg-surface dark:bg-[#0d0f0f] relative overflow-hidden pointer-events-none">
        <svg
          className="absolute bottom-0 left-0 w-full h-full text-black fill-current preserve-3d"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <polygon points="0,120 1200,0 1200,120" />
        </svg>
      </div>

      {/* 2. Main Solid Black Editorial Footer Container */}
      <div className="w-full bg-black text-white pt-12 pb-6 px-6 sm:px-10 md:px-16 max-w-7xl mx-auto flex flex-col relative z-10">
        {/* Top Callout CTA Row */}
        <div
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16 sm:mb-20 pt-6 transition-all duration-300 ease-out"
          style={{ transform: `translate3d(0, ${contentY}px, 0)` }}
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-neutral-500 font-mono-label text-xs uppercase tracking-[0.3em] font-medium">
                ✦ CONNECT &amp; COLLABORATE
              </span>
              <span className="text-neutral-600">+</span>
            </div>
            <h2 className="font-display-lg text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight uppercase leading-tight text-white mb-4">
              LET&apos;S BUILD SOMETHING GREAT TOGETHER.
            </h2>
            <p className="font-body-md text-neutral-400 text-sm sm:text-base max-w-xl">
              Have a project in mind or looking for a MERN stack developer? Let&apos;s connect and turn your vision into reality.
            </p>
          </div>

          <div className="w-full sm:w-auto">
            <a
              className="group flex items-center justify-center gap-4 bg-white text-black px-8 sm:px-10 py-4 sm:py-5 min-h-[48px] font-mono-label text-xs uppercase font-bold tracking-widest hover:bg-neutral-200 transition-all shadow-lg rounded-sm w-full sm:w-auto"
              href="https://portfolio-flame-nu-21.vercel.app/contact"
            >
              LET&apos;S TALK
              <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </a>
          </div>
        </div>

        {/* Thin Divider Line with + and ✦ Symbols */}
        <div className="w-full border-t border-neutral-800 my-8 relative flex items-center justify-between text-neutral-600 font-mono text-xs">
          <span className="-translate-y-1/2 bg-black px-2">+</span>
          <span className="-translate-y-1/2 bg-black px-2">✦</span>
          <span className="-translate-y-1/2 bg-black px-2">+</span>
        </div>

        {/* Links & Information Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 my-12 transition-all duration-300 ease-out"
          style={{ transform: `translate3d(0, ${contentY}px, 0)` }}
        >
          {/* Site Tagline & Back to Top */}
          <div className="md:col-span-4 flex flex-col justify-between gap-6">
            <div>
              <div className="font-mono-label text-xs uppercase tracking-[0.25em] text-neutral-400 font-bold mb-2">
                {siteName} // CMS CORE
              </div>
              <p className="font-body-md text-xs sm:text-sm text-neutral-400 max-w-xs leading-relaxed">
                {tagline}
              </p>
            </div>

            <button
              className="flex items-center gap-2 group w-fit text-neutral-400 hover:text-white transition-colors min-h-[44px] py-2"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <span className="font-mono-label text-xs uppercase tracking-widest border-b border-neutral-700 pb-0.5 group-hover:border-white transition-colors">
                BACK TO TOP
              </span>
              <span className="material-symbols-outlined text-sm group-hover:-translate-y-1 transition-transform">
                arrow_upward
              </span>
            </button>
          </div>

          {/* Navigation Index */}
          <div className="md:col-span-4 grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <span className="font-mono-label text-xs uppercase tracking-[0.25em] text-neutral-500 font-bold mb-1">
                INDEX ✦ 01
              </span>
              <nav className="flex flex-col gap-2">
                <a className="font-mono-label text-xs text-neutral-400 hover:text-white transition-colors uppercase tracking-wider py-1" href="/">HOME</a>
                <a className="font-mono-label text-xs text-neutral-400 hover:text-white transition-colors uppercase tracking-wider py-1" href="/about">ABOUT</a>
                <a className="font-mono-label text-xs text-neutral-400 hover:text-white transition-colors uppercase tracking-wider py-1" href="/tech-stack">SKILLS</a>
                <a className="font-mono-label text-xs text-neutral-400 hover:text-white transition-colors uppercase tracking-wider py-1" href="/experience">EXPERIENCE</a>
              </nav>
            </div>
            <div className="flex flex-col gap-3 pt-0">
              <span className="font-mono-label text-xs uppercase tracking-[0.25em] text-neutral-500 font-bold mb-1">
                INDEX ✦ 02
              </span>
              <nav className="flex flex-col gap-2">
                <a className="font-mono-label text-xs text-neutral-400 hover:text-white transition-colors uppercase tracking-wider py-1" href="/projects">PROJECTS</a>
                <a className="font-mono-label text-xs text-neutral-400 hover:text-white transition-colors uppercase tracking-wider py-1" href="/gallery">GALLERY</a>
                <a className="font-mono-label text-xs text-neutral-400 hover:text-white transition-colors uppercase tracking-wider py-1" href="/services">SERVICES</a>
              </nav>
            </div>
          </div>

          {/* Socials & Connect */}
          <div className="md:col-span-4 flex flex-col gap-3">
            <span className="font-mono-label text-xs uppercase tracking-[0.25em] text-neutral-500 font-bold mb-1">
              CONNECT ✦ NETWORK
            </span>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <a className="font-mono-label text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 uppercase tracking-wider min-h-[36px]" href={github} target="_blank" rel="noopener noreferrer">
                GITHUB <span className="material-symbols-outlined text-[13px]">north_east</span>
              </a>
              <a className="font-mono-label text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 uppercase tracking-wider min-h-[36px]" href={linkedin} target="_blank" rel="noopener noreferrer">
                LINKEDIN <span className="material-symbols-outlined text-[13px]">north_east</span>
              </a>
              <a className="font-mono-label text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 uppercase tracking-wider min-h-[36px]" href={`mailto:${email}`}>
                EMAIL <span className="material-symbols-outlined text-[13px]">north_east</span>
              </a>
              <a
                className="font-mono-label text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 uppercase tracking-wider"
                href="/Aswin_S_Premium_ATS_Resume.pdf"
                download="Aswin_S_Premium_ATS_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                RESUME <span className="material-symbols-outlined text-[13px]">download</span>
              </a>
            </div>
          </div>
        </div>

        {/* Thin Divider Line with Copyright */}
        <div className="w-full border-t border-neutral-800 pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-label text-neutral-500">
          <span>&copy; {new Date().getFullYear()} {siteName}. ALL RIGHTS RESERVED.</span>
          <div className="flex items-center gap-6">
            <span className="uppercase tracking-widest hover:text-neutral-300 transition-colors cursor-pointer">PRIVACY</span>
            <span className="uppercase tracking-widest hover:text-neutral-300 transition-colors cursor-pointer">TERMS</span>
            <span className="uppercase tracking-widest hover:text-neutral-300 transition-colors cursor-pointer">SITEMAP</span>
          </div>
        </div>
      </div>

      {/* 3. Oversized ASWIN_S Wordmark at the Very Bottom with Scroll Parallax */}
      <div className="w-full bg-black overflow-hidden pt-6 pb-6 flex justify-center items-end pointer-events-none select-none border-t border-neutral-900/50">
        <div
          className="transition-transform duration-100 ease-out"
          style={{ transform: `translate3d(0, ${wordmarkY}px, 0)` }}
        >
          <h1 className="font-display-lg text-[13vw] sm:text-[15.5vw] md:text-[17vw] font-black tracking-tighter uppercase leading-[0.88] text-neutral-100/90 whitespace-nowrap text-center">
            {siteName}
          </h1>
        </div>
      </div>
    </footer>
  );
}
