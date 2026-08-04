'use client';

import { useSettings } from '@/lib/useSettings';

export default function Footer() {
  const s = useSettings();
  const siteName = s.site_name || 'ASWIN S';
  const tagline = s.site_tagline || 'MERN Stack Developer crafting dynamic, full-stack web applications.';
  const github = s.github_url || 'https://github.com/aswin669';
  const linkedin = s.linkedin_url || 'https://linkedin.com/in/aswin669';
  const email = s.email_address || 'Aswinsreedharan669@gmail.com';

  return (
    <footer className="w-full bg-surface border-t-2 border-primary">
      <div className="max-w-container-max mx-auto px-gutter py-20 flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-24">
          <div className="max-w-2xl">
            <h2 className="font-display-lg text-[48px] md:text-[64px] leading-tight text-primary mb-6">Let&apos;s Build Something Great Together.</h2>
            <p className="font-body-lg text-secondary max-w-xl">Have a project in mind or looking for a MERN stack developer? Let&apos;s connect and turn your ideas into reality.</p>
          </div>
          <div>
            <a
              className="group flex items-center gap-4 bg-primary text-on-primary px-10 py-5 font-label-caps text-label-caps uppercase tracking-widest hover:bg-transparent hover:text-primary border border-primary transition-all duration-300"
              href="/contact"
            >
              Let&apos;s Talk
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="font-display-lg text-headline-md tracking-tighter text-primary">{siteName}</div>
            <p className="font-body-md text-secondary max-w-xs">{tagline}</p>
            <button className="mt-4 flex items-center gap-2 group w-fit" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <span className="font-label-caps text-label-caps uppercase border-b border-primary pb-1">Back to Top</span>
              <span className="material-symbols-outlined text-[18px] group-hover:-translate-y-1 transition-transform">arrow_upward</span>
            </button>
          </div>

          <div className="md:col-span-4 grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="font-label-caps text-label-caps text-primary uppercase tracking-widest opacity-40">Index</h3>
              <nav className="flex flex-col gap-3">
                <a className="font-mono-label text-secondary hover:text-primary transition-colors" href="/">Home</a>
                <a className="font-mono-label text-secondary hover:text-primary transition-colors" href="/about">About</a>
                <a className="font-mono-label text-secondary hover:text-primary transition-colors" href="/tech-stack">Skills</a>
                <a className="font-mono-label text-secondary hover:text-primary transition-colors" href="/experience">Experience</a>
              </nav>
            </div>
            <div className="flex flex-col gap-4 pt-8 md:pt-8">
              <nav className="flex flex-col gap-3">
                <a className="font-mono-label text-secondary hover:text-primary transition-colors" href="/projects">Projects</a>
                <a className="font-mono-label text-secondary hover:text-primary transition-colors" href="/gallery">Gallery</a>
                <a className="font-mono-label text-secondary hover:text-primary transition-colors" href="/services">Services</a>
              </nav>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col gap-4">
            <h3 className="font-label-caps text-label-caps text-primary uppercase tracking-widest opacity-40">Connect With Me</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <a className="font-mono-label text-secondary hover:text-primary transition-colors flex items-center gap-2" href={github}>GitHub <span className="material-symbols-outlined text-[14px]">north_east</span></a>
              <a className="font-mono-label text-secondary hover:text-primary transition-colors flex items-center gap-2" href={linkedin}>LinkedIn <span className="material-symbols-outlined text-[14px]">north_east</span></a>
              <a className="font-mono-label text-secondary hover:text-primary transition-colors flex items-center gap-2" href={`mailto:${email}`}>Email <span className="material-symbols-outlined text-[14px]">north_east</span></a>
              <a
                className="font-mono-label text-secondary hover:text-primary transition-colors flex items-center gap-2"
                href="/Aswin_S_Premium_ATS_Resume.pdf"
                download="Aswin_S_Premium_ATS_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume <span className="material-symbols-outlined text-[14px]">download</span>
              </a>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-primary mb-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-mono-label text-secondary">&copy; {new Date().getFullYear()} {siteName}. All rights reserved.</span>
          <div className="flex items-center gap-8">
            <span className="font-mono-label text-[12px] text-secondary uppercase tracking-widest">Privacy Policy</span>
            <span className="font-mono-label text-[12px] text-secondary uppercase tracking-widest">Terms</span>
            <span className="font-mono-label text-[12px] text-secondary uppercase tracking-widest">Sitemap</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
