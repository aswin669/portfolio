'use client';

import { useSettings } from '@/lib/useSettings';

export default function CTASection() {
  const s = useSettings();
  const email = (s.email_address || 'Aswinsreedharan669@gmail.com').toUpperCase();
  const github = s.github_url || 'https://github.com/aswin669';
  const linkedin = s.linkedin_url || 'https://linkedin.com/in/aswin669';

  return (
    <section id="contact" className="max-w-container-max mx-auto px-gutter py-section-gap border-t border-outline-variant text-center">
      <div className="flex flex-col items-center">
        <span className="font-mono-label text-mono-label uppercase tracking-widest mb-stack-md">Next Step</span>
        <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-stack-lg uppercase">Start Your Project</h2>
        <a className="group relative inline-block" href="/contact">
          <span className="font-display-lg text-headline-md md:text-display-lg-mobile border-b-2 border-primary hover:border-transparent transition-all">{email}</span>
          <div className="h-1 bg-primary w-0 group-hover:w-full transition-all duration-500"></div>
        </a>
        <div className="flex gap-8 mt-section-gap">
          <a className="font-label-caps text-label-caps uppercase hover:line-through" href={linkedin}>LinkedIn</a>
          <a className="font-label-caps text-label-caps uppercase hover:line-through" href={github}>GitHub</a>
        </div>
      </div>
    </section>
  );
}
