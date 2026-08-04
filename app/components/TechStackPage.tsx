'use client';

import { useEffect } from 'react';

export default function TechStackPage() {
  useEffect(() => {
    const reveal = () => {
      const reveals = document.querySelectorAll('.reveal');
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = (reveals[i] as HTMLElement).getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add('active');
        }
      }
    };
    window.addEventListener('scroll', reveal);
    window.addEventListener('load', reveal);
    return () => {
      window.removeEventListener('scroll', reveal);
    };
  }, []);

  const skillBadgeClass =
    'font-label-caps text-label-caps uppercase border border-primary px-3 py-1 transition-all duration-300 hover:bg-primary hover:text-on-primary';
  const darkBadgeClass =
    'font-label-caps text-label-caps uppercase border border-on-primary px-3 py-1 transition-all duration-300 hover:bg-surface hover:text-primary';

  return (
    <>
      <main id="skills" className="pt-32 pb-section-gap max-w-container-max mx-auto px-gutter">
        <section className="mb-section-gap reveal">
          <div className="grid grid-cols-12 gap-gutter items-end">
            <div className="col-span-12 md:col-span-8">
              <span className="font-mono-label text-mono-label uppercase mb-4 block tracking-widest">System Capabilities</span>
              <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-8">TECH STACK / INFRASTRUCTURE</h1>
            </div>
            <div className="col-span-12 md:col-span-4 border-l border-primary pl-8 pb-4">
              <p className="font-body-md text-body-md text-secondary">
                A focused selection of modern web technologies for building dynamic, full-stack applications.
              </p>
            </div>
          </div>
          <div className="drawing-line mt-12" style={{ background: '#000000' }}></div>
        </section>

        <div className="grid grid-cols-12 gap-gutter">
          <div className="col-span-12 md:col-span-6 lg:col-span-4 reveal" style={{ transitionDelay: '0ms' }}>
            <div className="border border-primary p-stack-lg h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-12">
                  <h3 className="font-headline-md text-headline-md">FRONTEND</h3>
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>terminal</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={skillBadgeClass}>React JS</span>
                  <span className={skillBadgeClass}>TypeScript</span>
                  <span className={skillBadgeClass}>JavaScript</span>
                  <span className={skillBadgeClass}>HTML</span>
                  <span className={skillBadgeClass}>CSS</span>
                  <span className={skillBadgeClass}>Bootstrap</span>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-outline-variant">
                <p className="font-mono-label text-mono-label text-secondary uppercase">Interface Architecture</p>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 lg:col-span-4 reveal" style={{ transitionDelay: '100ms' }}>
            <div className="border border-primary p-stack-lg h-full flex flex-col justify-between bg-primary text-on-primary">
              <div>
                <div className="flex justify-between items-start mb-12">
                  <h3 className="font-headline-md text-headline-md">BACKEND</h3>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>database</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={darkBadgeClass}>Node JS</span>
                  <span className={darkBadgeClass}>Express</span>
                  <span className={darkBadgeClass}>Fastify</span>
                  <span className={darkBadgeClass}>TypeScript</span>
                  <span className={darkBadgeClass}>REST APIs</span>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-on-tertiary-container">
                <p className="font-mono-label text-mono-label text-on-primary-container uppercase">Logic &amp; API Layers</p>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-12 lg:col-span-4 reveal" style={{ transitionDelay: '200ms' }}>
            <div className="border border-primary p-stack-lg h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-12">
                  <h3 className="font-headline-md text-headline-md">STORAGE</h3>
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>data_object</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={skillBadgeClass}>MongoDB</span>
                  <span className={skillBadgeClass}>PostgreSQL</span>
                  <span className={skillBadgeClass}>Prisma ORM</span>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-outline-variant">
                <p className="font-mono-label text-mono-label text-secondary uppercase">Data Integrity Systems</p>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-8 reveal" style={{ transitionDelay: '300ms' }}>
            <div className="border border-primary p-stack-lg h-full flex flex-col justify-between">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>cloud</span>
                    <h3 className="font-headline-md text-headline-md uppercase">Infrastructure</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={skillBadgeClass}>Firebase</span>
                    <span className={skillBadgeClass}>Vercel</span>
                    <span className={skillBadgeClass}>Cloudinary</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>settings_suggest</span>
                    <h3 className="font-headline-md text-headline-md uppercase">Automation</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={skillBadgeClass}>Git</span>
                    <span className={skillBadgeClass}>GitHub</span>
                    <span className={skillBadgeClass}>Swagger</span>
                    <span className={skillBadgeClass}>Postman</span>
                  </div>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-outline-variant flex justify-between items-center">
                <p className="font-mono-label text-mono-label text-secondary uppercase">Scale &amp; Deployment Pipeline</p>
                <span className="font-label-caps text-label-caps">STABLE_RELEASE_V2.4</span>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-4 reveal" style={{ transitionDelay: '400ms' }}>
            <div className="border border-outline-variant p-stack-lg h-full flex flex-col justify-between">
              <div>
                <h4 className="font-mono-label text-mono-label uppercase mb-8 tracking-widest text-secondary">Development Tools</h4>
                <ul className="space-y-4">
                  <li className="flex justify-between items-center border-b border-outline-variant pb-2">
                    <span className="font-body-md text-body-md">VS Code</span>
                    <span className="material-symbols-outlined scale-75">check_circle</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-outline-variant pb-2">
                    <span className="font-body-md text-body-md">Git / GitHub</span>
                    <span className="material-symbols-outlined scale-75">check_circle</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-outline-variant pb-2">
                    <span className="font-body-md text-body-md">Postman</span>
                    <span className="material-symbols-outlined scale-75">check_circle</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-outline-variant pb-2">
                    <span className="font-body-md text-body-md">Swagger / OpenAPI</span>
                    <span className="material-symbols-outlined scale-75">check_circle</span>
                  </li>
                </ul>
              </div>
              <div className="mt-12 text-center py-4 bg-surface-container">
                <span className="font-label-caps text-label-caps">99.9% RELIABILITY RATING</span>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-section-gap reveal overflow-hidden border border-primary relative group" style={{ transitionDelay: '500ms' }}>
          <div className="h-96 w-full relative">
            <div className="absolute inset-0 z-10 bg-black/10 group-hover:bg-black/0 transition-colors duration-700"></div>
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <div className="border border-on-primary bg-primary text-on-primary px-12 py-6">
                <p className="font-display-lg text-headline-md tracking-[0.2em]">ENGINEERING_EXCELLENCE</p>
              </div>
            </div>
            <div className="bg-cover bg-center w-full h-full grayscale hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC4e9rtdlE2uEgDE-8g2NjOufeIsxN_gB45qPbsL05OU0Ed9lntlnkEnwHNkYWF8yG1nw4_QFOWKDyhIp0HNuDy8kmS1SrSO1DG_l2sGqh4pu6ip11NJzrMBoPt7hUgtnlm0RapPp5u9mVcJNHBybjAgzgaTe7FipcLe13epSFM6dyTOjmIVHpoOYdAC2NCo-Zt0YrzO70DOih2gx1WqzwdwRnRDOkGVN8c3tgtbzXM1lXGo70Y7qXj')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          </div>
        </section>
      </main>

      <footer className="w-full py-stack-lg px-gutter flex flex-col md:flex-row justify-between items-center max-w-container-max mx-auto mt-section-gap border-t border-primary">
        <div className="font-display-lg text-headline-md text-primary mb-8 md:mb-0">ASWIN_S</div>
        <div className="flex flex-col items-center md:items-end gap-stack-sm">
          <nav className="flex gap-gutter mb-4">
            <a className="font-mono-label text-mono-label text-secondary hover:text-primary hover:underline transition-all duration-200 ease-in-out" href="/">Home</a>
            <a className="font-mono-label text-mono-label text-secondary hover:text-primary hover:underline transition-all duration-200 ease-in-out" href="/about">About</a>
            <a className="font-mono-label text-mono-label text-secondary hover:text-primary hover:underline transition-all duration-200 ease-in-out" href="/tech-stack">Skills</a>
            <a className="font-mono-label text-mono-label text-secondary hover:text-primary hover:underline transition-all duration-200 ease-in-out" href="/experience">Experience</a>
            <a className="font-mono-label text-mono-label text-secondary hover:text-primary hover:underline transition-all duration-200 ease-in-out" href="/projects">Projects</a>
            <a className="font-mono-label text-mono-label text-secondary hover:text-primary hover:underline transition-all duration-200 ease-in-out" href="/services">Services</a>
            <a className="font-mono-label text-mono-label text-secondary hover:text-primary hover:underline transition-all duration-200 ease-in-out" href="/contact">Contact</a>
          </nav>
          <p className="font-mono-label text-mono-label text-secondary uppercase tracking-widest">&copy; 2025 ASWIN S. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>

      <style>{`
        .drawing-line {
          height: 1px;
          background: #000000;
          width: 0;
          transition: width 1s cubic-bezier(0.65, 0, 0.35, 1);
        }
        .reveal.active .drawing-line {
          width: 100%;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </>
  );
}