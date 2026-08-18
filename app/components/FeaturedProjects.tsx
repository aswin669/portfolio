'use client';

import { useEffect, useState } from 'react';

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data.filter((p: any) => p.featured).slice(0, 3));
        } else {
          setProjects([]);
        }
      })
      .catch(() => setProjects([]));
  }, []);

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="max-w-container-max mx-auto px-gutter py-section-gap border-t border-outline-variant">
      <div className="flex justify-between items-end mb-stack-lg">
        <div>
          <span className="font-mono-label text-mono-label uppercase text-secondary">01 / Curated Works</span>
          <h2 className="font-headline-md text-headline-md uppercase mt-2">Featured Projects</h2>
        </div>
        <a className="font-label-caps text-label-caps border-b border-primary pb-1 hover:pb-2 transition-all" href="/projects">View All [{projects.length}]</a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {projects[0] && (
          <div className="md:col-span-12 group cursor-pointer border border-outline-variant p-gutter hover:border-primary transition-colors">
            <div className="flex flex-col md:flex-row gap-gutter">
              <div className="md:w-2/3 aspect-[16/10] relative overflow-hidden bg-[#0a0a0c] border border-outline-variant/60 rounded-md">
                <img className="w-full h-full object-contain object-top transition-transform duration-500 group-hover:scale-[1.02]" src={projects[0].image || ''} alt={projects[0].title || projects[0].name} />
              </div>
              <div className="md:w-1/3 flex flex-col justify-between py-stack-md">
                <div>
                  <h3 className="font-headline-md text-headline-md mb-2 uppercase">{projects[0].title || projects[0].name}</h3>
                  <p className="text-secondary font-body-md mb-stack-lg leading-relaxed">{projects[0].tagline || projects[0].description}</p>
                  <div className="flex flex-wrap gap-2 mb-stack-lg">
                    {projects[0].category && (
                      <span className="border border-primary px-3 py-1 text-[10px] font-mono-label uppercase">{projects[0].category}</span>
                    )}
                    {(projects[0].stack || '').split('/').map((s: string, i: number) => (
                      <span key={i} className="border border-primary px-3 py-1 text-[10px] font-mono-label uppercase">{s.trim()}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <a className="font-label-caps text-label-caps inline-flex items-center gap-2 group-hover:underline" href={`/projects/${projects[0].slug}`}>
                    View Details <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </a>
                  {projects[0].liveUrl && (
                    <a href={projects[0].liveUrl} target="_blank" rel="noopener noreferrer" className="font-label-caps text-label-caps inline-flex items-center gap-2 border border-primary px-3 py-1 hover:bg-primary hover:text-on-primary transition-all">
                      WEB APP <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  )}
                  {projects[0].adminUrl && (
                    <a href={projects[0].adminUrl} target="_blank" rel="noopener noreferrer" className="font-label-caps text-label-caps inline-flex items-center gap-2 border border-primary px-3 py-1 hover:bg-primary hover:text-on-primary transition-all">
                      ADMIN PANEL <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  )}
                  {projects[0].demoLinks && (() => {
                    try {
                      return JSON.parse(projects[0].demoLinks).map((link: any, idx: number) => (
                        <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="font-label-caps text-label-caps inline-flex items-center gap-2 border border-primary px-3 py-1 hover:bg-primary hover:text-on-primary transition-all uppercase">
                          {link.label} <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </a>
                      ));
                    } catch { return null; }
                  })()}
                </div>
              </div>
            </div>
          </div>
        )}
        {projects.slice(1).map((p) => (
          <a key={p.id} href={`/projects/${p.slug}`} className="md:col-span-6 block group cursor-pointer border border-outline-variant p-gutter hover:border-primary transition-colors">
            <div className="aspect-[16/10] mb-stack-md relative overflow-hidden bg-[#0a0a0c] border border-outline-variant/60 rounded-md">
              <img className="w-full h-full object-contain object-top transition-transform duration-500 group-hover:scale-[1.02]" src={p.image || ''} alt={p.title || p.name} />
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-headline-md text-headline-md text-[24px] mb-2 uppercase">{p.title || p.name}</h3>
                <p className="text-secondary font-body-md mb-stack-md">{p.tagline || p.description}</p>
              </div>
              <span className="material-symbols-outlined group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">north_east</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
