'use client';

import { useEffect, useState } from 'react';

export default function Experience() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/experience')
      .then((r) => r.json())
      .then((data) => { setItems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      document.querySelectorAll('.experience-card').forEach(card => {
        card.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-700');
        observer.observe(card);
      });

      return () => observer.disconnect();
    }
  }, [loading]);

  if (loading) return <main className="pt-40 pb-section-gap max-w-container-max mx-auto px-gutter"><p className="font-mono-label">Loading...</p></main>;

  return (
    <main id="experience" className="max-w-container-max mx-auto px-gutter pt-40 pb-section-gap">
      <header className="mb-stack-lg lg:mb-24">
        <div className="font-label-caps text-label-caps text-primary mb-stack-sm">CURRICULUM VITAE</div>
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-stack-md">Professional Experience.</h1>
        <p className="font-body-lg text-body-lg text-secondary max-w-2xl">
          A chronological record of backend development, full-stack engineering, and continuous growth in modern web technologies.
        </p>
        <div className="mt-8">
          <a
            href="/Aswin_S_Premium_ATS_Resume.pdf"
            download="Aswin_S_Premium_ATS_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-4 font-label-caps text-label-caps hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>download</span>
            DOWNLOAD RESUME
          </a>
        </div>
      </header>

      <section className="relative">
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 -translate-x-1/2" style={{ width: '1px', background: '#000000' }}></div>
        <div className="space-y-24">
          {items.map((item) => (
            <div key={item.id} className="relative flex flex-col md:flex-row items-start md:items-center">
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-primary border-4 border-surface z-10"></div>
              <div className="md:w-1/2 md:pr-16 text-left md:text-right mb-4 md:mb-0 pl-10 md:pl-0">
                <span className="font-mono-label text-mono-label text-primary font-semibold">{item.startDate} — {item.endDate}</span>
              </div>
              <div className="md:w-1/2 md:pl-16 pl-10">
                <div className="experience-card bg-surface-container-lowest border border-outline-variant p-stack-lg hover:border-primary">
                  <h3 className="font-headline-md text-headline-md mb-1 uppercase tracking-tight">{item.title}</h3>
                  <div className="font-label-caps text-label-caps text-secondary mb-stack-md">{item.company}</div>
                  <ul className="space-y-3 font-body-md text-secondary">
                    {(item.highlights || []).map((h: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-2 w-1.5 h-1.5 bg-primary flex-shrink-0"></span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
