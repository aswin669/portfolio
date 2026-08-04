'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/projects/${slug}`)
      .then((r) => r.json())
      .then((data) => { setProject(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!loading && project) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.animate-on-scroll').forEach(section => {
        section.classList.add('transition-all', 'duration-700', 'ease-out', 'opacity-0', 'translate-y-10');
        observer.observe(section);
      });

      return () => observer.disconnect();
    }
  }, [loading, project]);

  if (loading) return <main className="pt-32 max-w-container-max mx-auto px-gutter"><p className="font-mono-label">Loading...</p></main>;
  if (!project || project.error) return <main className="pt-32 max-w-container-max mx-auto px-gutter"><p className="font-mono-label text-error">Project not found</p></main>;

  let features: any[] = [];
  try { if (project.features) features = JSON.parse(project.features); } catch {}

  let journey: any[] = [];
  try { if (project.journey) journey = JSON.parse(project.journey); } catch {}

  let archFlow: any[] = [];
  try { if (project.architectureFlow) archFlow = JSON.parse(project.architectureFlow); } catch {}

  const gallery: string[] = Array.isArray(project.gallery) ? project.gallery : [];

  return (
    <>
      <main id="projects" className="pt-32 max-w-container-max mx-auto px-gutter">
        <header className="mb-section-gap animate-on-scroll">
          <div className="flex flex-col md:flex-row justify-between items-end gap-stack-lg border-b border-primary pb-stack-lg">
            <div className="max-w-2xl">
              <span className="font-mono-label text-mono-label text-secondary block mb-stack-sm">{project.caseNo || 'CASE STUDY'}</span>
              <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg uppercase mb-stack-md">{project.name}</h1>
              <p className="font-body-lg text-body-lg text-secondary">{project.tagline}</p>
            </div>
            {project.liveUrl && (
              <div className="flex gap-4 mb-4">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-primary px-6 py-3 font-label-caps text-label-caps hover:bg-primary hover:text-on-primary transition-all">
                  LIVE SITE <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                </a>
              </div>
            )}
          </div>
        </header>

        {project.image && (
          <section className="mb-section-gap animate-on-scroll">
            <div className="aspect-video w-full overflow-hidden border border-outline-variant bg-surface-container">
              <img className="w-full h-full object-cover grayscale-hover" src={project.image} alt="" />
            </div>
          </section>
        )}

        {(project.problem || project.solution) && (
          <section className="grid grid-cols-1 md:grid-cols-12 gap-y-stack-lg md:gap-x-gutter mb-section-gap animate-on-scroll">
            <div className="md:col-span-4 sticky top-24 h-fit">
              <h2 className="font-label-caps text-label-caps uppercase text-secondary mb-stack-md">Project Specs</h2>
              <ul className="space-y-stack-md font-mono-label text-mono-label border-t border-outline-variant pt-stack-md">
                {project.year && <li className="flex justify-between"><span>YEAR</span><span>{project.year}</span></li>}
                {project.stack && <li className="flex flex-col gap-1"><span>STACK</span><div className="flex flex-wrap gap-1">{(project.stack || '').split('/').map((s: string, i: number) => <span key={i} className="border border-primary px-2 py-0.5 text-[10px]">{s.trim()}</span>)}</div></li>}
                {project.type && <li className="flex justify-between"><span>TYPE</span><span>{project.type}</span></li>}
                {project.status && <li className="flex justify-between"><span>STATUS</span><span>{project.status}</span></li>}
              </ul>
            </div>
            <div className="md:col-span-8 space-y-stack-lg">
              {project.problem && (
                <div>
                  <h3 className="font-headline-md text-headline-md mb-stack-md">The Problem</h3>
                  <p className="font-body-lg text-body-lg text-secondary">{project.problem}</p>
                </div>
              )}
              {project.solution && (
                <div>
                  <h3 className="font-headline-md text-headline-md mb-stack-md">The Solution</h3>
                  <p className="font-body-lg text-body-lg text-secondary">{project.solution}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {(archFlow.length > 0 || project.architecture) && (
          <section className="mb-section-gap border border-primary p-gutter animate-on-scroll">
            <h2 className="font-label-caps text-label-caps uppercase mb-stack-lg">System Architecture (Logical Flow)</h2>
            {archFlow.length > 0 && (
              <div className="aspect-[16/7] w-full bg-surface-container flex items-center justify-center border border-outline-variant relative overflow-hidden mb-stack-md">
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                </div>
                <div className="z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 text-center">
                  {archFlow.map((node: any, i: number) => (
                    <div key={i} className="flex items-center gap-8 md:gap-12">
                      {i > 0 && <span className="material-symbols-outlined rotate-90 md:rotate-0 hidden md:block">arrow_forward</span>}
                      <div className="border border-primary bg-white p-6 w-44">
                        <span className="font-mono-label text-[12px] block">{node.name}</span>
                        <div className="h-[1px] bg-primary my-2"></div>
                        <span className="text-[10px]">{node.tech}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {project.architecture && (
              <p className="font-body-lg text-body-lg text-secondary whitespace-pre-line">{project.architecture}</p>
            )}
          </section>
        )}

        {features.length > 0 && (
          <section className="mb-section-gap animate-on-scroll">
            <h2 className="font-headline-md text-headline-md mb-stack-lg">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {features.map((f: any, i: number) => (
                <div key={i} className="bg-surface-container p-stack-lg border border-outline-variant hover:border-primary transition-colors group">
                  {f.icon && <span className="material-symbols-outlined text-[32px] mb-stack-md group-hover:scale-110 transition-transform">{f.icon}</span>}
                  <h4 className="font-label-caps text-label-caps uppercase mb-stack-sm">{f.title}</h4>
                  <p className="text-secondary font-body-md">{f.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {journey.length > 0 && (
          <section className="mb-section-gap max-w-4xl mx-auto animate-on-scroll">
            <h2 className="font-headline-md text-headline-md mb-stack-lg text-center">Development Journey</h2>
            <div className="relative">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-primary"></div>
              <div className="space-y-24">
                {journey.map((j: any, i: number) => (
                  <div key={i} className="relative flex flex-col md:flex-row items-center md:justify-between w-full">
                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-primary border-4 border-surface z-10"></div>
                    {i % 2 === 0 ? (
                      <>
                        <div className="w-full md:w-[42%] text-center md:text-right">
                          {j.phase && <span className="font-mono-label text-mono-label text-secondary">{j.phase}</span>}
                          <h4 className="font-label-caps text-label-caps mb-2">{j.title}</h4>
                          <p className="text-secondary">{j.description}</p>
                        </div>
                        <div className="hidden md:block md:w-[42%]"></div>
                      </>
                    ) : (
                      <>
                        <div className="hidden md:block md:w-[42%]"></div>
                        <div className="w-full md:w-[42%] text-center md:text-left">
                          {j.phase && <span className="font-mono-label text-mono-label text-secondary">{j.phase}</span>}
                          <h4 className="font-label-caps text-label-caps mb-2">{j.title}</h4>
                          <p className="text-secondary">{j.description}</p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {(gallery.length > 0) && (
          <section className="mb-section-gap space-y-gutter animate-on-scroll">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              {gallery.slice(0, 2).map((url: string, i: number) => (
                <div key={i} className="aspect-square bg-surface-container border border-outline-variant overflow-hidden">
                  <img className="w-full h-full object-cover grayscale-hover" src={url} alt="" />
                </div>
              ))}
            </div>
            {gallery.slice(2).map((url: string, i: number) => (
              <div key={i + 2} className="aspect-video bg-surface-container border border-outline-variant overflow-hidden">
                <img className="w-full h-full object-cover grayscale-hover" src={url} alt="" />
              </div>
            ))}
          </section>
        )}

        <section className="py-section-gap border-t border-primary text-center animate-on-scroll">
          <h2 className="font-display-lg text-headline-md md:text-display-lg uppercase mb-stack-lg">Build Something Like This</h2>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <a className="bg-primary text-on-primary px-12 py-4 font-label-caps text-label-caps hover:opacity-90 transition-opacity flex items-center justify-center gap-2" href="/contact">
              START A PROJECT <span className="material-symbols-outlined">north_east</span>
            </a>
            <a className="border border-primary text-primary px-12 py-4 font-label-caps text-label-caps hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2" href="/projects">
              VIEW MORE PROJECTS <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="w-full py-stack-lg px-gutter flex flex-col md:flex-row justify-between items-center max-w-container-max mx-auto mt-section-gap border-t border-primary">
        <div className="font-display-lg text-headline-md text-primary mb-stack-md md:mb-0">ASWIN_S</div>
        <div className="font-mono-label text-mono-label text-secondary text-center md:text-left mb-stack-md md:mb-0 uppercase tracking-widest">
          &copy; 2025 ASWIN S. ALL RIGHTS RESERVED.
        </div>
        <div className="flex gap-stack-lg">
          <a className="font-mono-label text-mono-label text-secondary hover:text-primary hover:underline transition-all" href="https://github.com/aswin669">GitHub</a>
          <a className="font-mono-label text-mono-label text-secondary hover:text-primary hover:underline transition-all" href="https://linkedin.com/in/aswin669">LinkedIn</a>
          <a className="font-mono-label text-mono-label text-secondary hover:text-primary hover:underline transition-all" href="mailto:Aswinsreedharan669@gmail.com">Email</a>
        </div>
      </footer>
    </>
  );
}
