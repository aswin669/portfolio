'use client';

import { useEffect, useState } from 'react';

export default function ProjectsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
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

      document.querySelectorAll('.project-card').forEach(card => {
        card.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-1000', 'ease-out');
        observer.observe(card);
      });

      return () => observer.disconnect();
    }
  }, [loading]);

  if (loading) return <main className="pt-32 pb-section-gap max-w-container-max mx-auto px-gutter"><p className="font-mono-label">Loading...</p></main>;

  return (
    <main id="projects" className="pt-32 pb-section-gap max-w-container-max mx-auto px-gutter overflow-hidden">
      <header className="mb-24 flex flex-col md:flex-row justify-between items-end gap-stack-lg border-b border-primary pb-stack-lg">
        <div className="max-w-2xl">
          <span className="font-mono-label text-mono-label uppercase tracking-widest text-secondary block mb-4">// SELECTED_WORKS_06</span>
          <h1 className="font-display-lg text-display-lg leading-none">MERN STACK<br/>PORTFOLIO.</h1>
        </div>
        <p className="font-body-lg text-body-lg text-secondary max-w-md text-right">
          A curated selection of full-stack web applications built with modern JavaScript technologies.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-y-32 gap-x-gutter">
        {items.map((project, i) => (
          <div key={project.id} className={`col-span-12 group project-card ${i % 2 === 1 ? 'md:col-start-2 md:col-span-10' : ''}`}>
            <div className="relative overflow-hidden aspect-[21/9] bg-surface-container mb-stack-lg border border-outline-variant">
              <div className="project-image w-full h-full bg-center bg-cover" style={{ backgroundImage: `url('${project.image || ''}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
              <div className="absolute top-4 right-4 bg-primary text-on-primary px-3 py-1 font-mono-label text-mono-label">{project.featured ? '[ FEATURED ]' : `[ ${project.status || 'DRAFT'} ]`}</div>
            </div>
            <div className="flex flex-col md:flex-row justify-between gap-stack-md">
              <div className="max-w-2xl">
                <div className="flex items-center gap-stack-sm mb-2">
                  <span className="font-label-caps text-label-caps text-primary border border-primary px-3 py-1">{project.type || project.category || 'GENERAL'}</span>
                  <span className="font-mono-label text-mono-label text-secondary">{project.year}</span>
                </div>
                <h2 className="font-headline-md text-headline-md mb-4 uppercase">{project.name}</h2>
                <p className="font-body-md text-secondary mb-6">{project.tagline}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {(project.tags || []).map((t: string) => (
                    <span key={t} className="font-mono-label text-[10px] border border-outline-variant px-3 py-1 uppercase">{t}</span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a href={`/projects/${project.slug}`} className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 font-label-caps text-label-caps hover:opacity-80 transition-opacity">
                    VIEW CASE
                    <span className="material-symbols-outlined text-[16px]">arrow_outward</span>
                  </a>
                  {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-primary text-primary px-6 py-3 font-label-caps text-label-caps hover:bg-primary hover:text-on-primary transition-all">WEB APP</a>}
                  {project.adminUrl && <a href={project.adminUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-primary text-primary px-6 py-3 font-label-caps text-label-caps hover:bg-primary hover:text-on-primary transition-all">ADMIN PANEL</a>}
                </div>
              </div>
              <div className="hidden md:block">
                <div className="flex flex-wrap gap-1 justify-end">{(project.stack || '').split('/').map((s: string, i: number) => <span key={i} className="border border-primary px-2 py-0.5 font-mono-label text-[10px] uppercase">{s.trim()}</span>)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
