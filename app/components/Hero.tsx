'use client';

import { useSettings } from '@/lib/useSettings';

export default function Hero() {
  const settings = useSettings();
  const heroImage = settings.hero_image || '/hero-image.jpg';
  const techStack = ['React', 'Next.js', 'Node.js', 'MongoDB', 'TypeScript', 'Tailwind CSS'];

  return (
    <section id="home" className="max-w-container-max mx-auto px-4 sm:px-6 md:px-10 py-10 md:py-16 lg:py-20 min-h-[calc(100vh-4rem)] flex items-center">
      <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
        {/* Left Column: Text Content & Actions */}
        <div className="flex-1 w-full lg:w-1/2 order-2 lg:order-1 flex flex-col justify-center">
          {/* Availability Status Badge */}
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-surface-container-high border border-outline-variant rounded-full w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="font-mono-label text-xs uppercase tracking-widest text-secondary font-medium">
              Available for Hire
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display-lg text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-primary leading-tight mb-4">
            MERN Stack Developer Building Scalable Web Experiences
          </h1>

          {/* Subtitle Description */}
          <p className="font-body-lg text-secondary text-base sm:text-lg leading-relaxed max-w-2xl mb-6">
            Specializing in modern JavaScript technologies to craft dynamic front-end interfaces and robust back-end solutions with clean architecture.
          </p>

          {/* Key Metrics / Experience Highlights */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6 py-3 border-y border-outline-variant/60">
            <div>
              <span className="font-display-lg text-xl sm:text-2xl font-bold text-primary block leading-none">2+</span>
              <span className="font-mono-label text-[11px] uppercase tracking-wider text-secondary">Years Experience</span>
            </div>
            <div className="w-px h-8 bg-outline-variant"></div>
            <div>
              <span className="font-display-lg text-xl sm:text-2xl font-bold text-primary block leading-none">10+</span>
              <span className="font-mono-label text-[11px] uppercase tracking-wider text-secondary">Projects Built</span>
            </div>
            <div className="w-px h-8 bg-outline-variant"></div>
            <div>
              <span className="font-display-lg text-xl sm:text-2xl font-bold text-primary block leading-none">100%</span>
              <span className="font-mono-label text-[11px] uppercase tracking-wider text-secondary">Full-Stack Focus</span>
            </div>
          </div>

          {/* Technology Stack Badges */}
          <div className="mb-8">
            <span className="font-mono-label text-[11px] uppercase tracking-widest text-secondary block mb-2 font-medium">
              Core Tech Stack:
            </span>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="font-mono-label text-[11px] font-semibold px-2.5 py-1 border border-primary/30 bg-surface-container-low text-primary rounded-sm uppercase tracking-wider hover:border-primary transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Buttons & Social Media Links */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex flex-wrap gap-3">
              <a
                className="bg-primary text-on-primary px-7 py-3.5 text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity text-center rounded-sm shadow-sm"
                href="#projects"
              >
                View My Work
              </a>
              <a
                className="border border-primary text-primary px-7 py-3.5 text-xs font-semibold uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-all text-center rounded-sm"
                href="/contact"
              >
                Get In Touch
              </a>
            </div>

            {/* Social Media Links (GitHub, LinkedIn, Email) */}
            <div className="flex items-center gap-3 pt-2 sm:pt-0 sm:ml-4 sm:border-l sm:border-outline-variant sm:pl-4">
              <a
                href="https://github.com/aswin669"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-2 border border-outline-variant text-secondary hover:text-primary hover:border-primary transition-all rounded-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/in/aswin669"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 border border-outline-variant text-secondary hover:text-primary hover:border-primary transition-all rounded-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="mailto:Aswinsreedharan669@gmail.com"
                aria-label="Email"
                className="p-2 border border-outline-variant text-secondary hover:text-primary hover:border-primary transition-all rounded-sm"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Portrait Image */}
        <div className="flex-1 w-full lg:w-1/2 order-1 lg:order-2 flex justify-center items-center">
          <div className="w-full max-w-md aspect-square md:aspect-[4/5] relative overflow-hidden rounded-2xl border border-outline-variant shadow-2xl group">
            <img
              className="w-full h-full object-cover grayscale transition-transform duration-700 group-hover:scale-105"
              alt="ASWIN S - MERN Stack Developer"
              src={heroImage}
            />
            {/* Dark overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
            
            {/* Bottom floating badge on image */}
            <div className="absolute bottom-4 left-4 right-4 bg-surface/90 backdrop-blur-md p-3.5 border border-primary/20 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-display-lg text-sm font-bold text-primary block">ASWIN S</span>
                <span className="font-mono-label text-[10px] uppercase tracking-wider text-secondary">Full-Stack Engineer</span>
              </div>
              <span className="font-mono-label text-[10px] px-2.5 py-1 bg-primary text-on-primary rounded uppercase font-semibold">
                Kerala, IN
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}