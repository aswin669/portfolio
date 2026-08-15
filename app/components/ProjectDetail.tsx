'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';

function LandscapeImage({
  src,
  alt = '',
  className = '',
  containerClassName = '',
  onClick,
}: {
  src: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  onClick?: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`relative w-full aspect-video bg-neutral-950 border border-outline-variant overflow-hidden flex items-center justify-center rounded-xs transition-all ${
        onClick ? 'cursor-pointer group hover:border-primary' : ''
      } ${containerClassName}`}
    >
      {loading && !error && (
        <div className="absolute inset-0 bg-surface-container-highest animate-pulse flex flex-col items-center justify-center gap-2">
          <span className="material-symbols-outlined text-3xl text-secondary opacity-40 animate-spin">progress_activity</span>
          <span className="font-mono-label text-[10px] text-secondary opacity-50 uppercase">Loading image...</span>
        </div>
      )}
      {error ? (
        <div className="flex flex-col items-center justify-center text-secondary opacity-40 p-4 text-center gap-1">
          <span className="material-symbols-outlined text-4xl">broken_image</span>
          <span className="font-mono-label text-[11px] uppercase tracking-wider">Image Unavailable</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoading(false)}
          onError={() => { setLoading(false); setError(true); }}
          className={`w-full h-full object-contain transition-all duration-500 ${
            loading ? 'opacity-0' : 'opacity-100 group-hover:scale-[1.02]'
          } ${className}`}
        />
      )}
      {onClick && !loading && !error && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-white text-3xl drop-shadow-md">fullscreen</span>
          <span className="font-mono-label text-xs text-white uppercase tracking-widest bg-black/60 px-3 py-1 border border-white/20">Expand View</span>
        </div>
      )}
    </div>
  );
}

function ImageLightbox({
  images,
  selectedIndex,
  onClose,
  onNavigate,
}: {
  images: string[];
  selectedIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const [imgLoading, setImgLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  const total = images.length;
  const currentUrl = images[selectedIndex];

  const handlePrev = useCallback(() => {
    if (total > 1) onNavigate((selectedIndex - 1 + total) % total);
  }, [total, selectedIndex, onNavigate]);

  const handleNext = useCallback(() => {
    if (total > 1) onNavigate((selectedIndex + 1) % total);
  }, [total, selectedIndex, onNavigate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, handlePrev, handleNext]);

  useEffect(() => {
    setImgLoading(true);
    setImgError(false);
  }, [selectedIndex]);

  if (selectedIndex < 0 || selectedIndex >= total || !currentUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-6 select-none animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top Bar */}
      <div className="flex justify-between items-center z-20 text-white pb-3 border-b border-white/10 max-w-7xl mx-auto w-full">
        <div className="font-mono-label text-xs uppercase tracking-widest text-secondary flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-primary">photo_library</span>
          <span>FULLSCREEN VIEWER</span>
          <span className="opacity-40">//</span>
          <span className="text-white">IMAGE {selectedIndex + 1} OF {total}</span>
        </div>
        <button
          onClick={onClose}
          className="bg-white/10 hover:bg-primary hover:text-black text-white p-2 rounded-full transition-colors flex items-center justify-center"
          title="Close (Esc)"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
      </div>

      {/* Center Image Stage */}
      <div className="relative flex-1 flex items-center justify-center w-full h-full max-h-[80vh] my-auto overflow-hidden py-2">
        {total > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 md:left-6 z-30 bg-black/75 hover:bg-primary hover:text-black text-white p-3 md:p-4 rounded-full border border-white/20 transition-all flex items-center justify-center shadow-2xl"
            title="Previous (Left Arrow)"
          >
            <span className="material-symbols-outlined text-2xl md:text-3xl">chevron_left</span>
          </button>
        )}

        <div className="relative max-w-full max-h-full flex items-center justify-center p-2">
          {imgLoading && !imgError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
              <span className="font-mono-label text-xs text-white/50 uppercase">Loading full image...</span>
            </div>
          )}
          {imgError ? (
            <div className="flex flex-col items-center justify-center text-white/50 p-8 text-center gap-2">
              <span className="material-symbols-outlined text-5xl text-error">broken_image</span>
              <p className="font-mono-label text-sm uppercase tracking-wider">Failed to load high-res image</p>
            </div>
          ) : (
            <img
              src={currentUrl}
              alt=""
              onLoad={() => setImgLoading(false)}
              onError={() => { setImgLoading(false); setImgError(true); }}
              className={`max-w-full max-h-[76vh] md:max-h-[80vh] object-contain transition-all duration-300 drop-shadow-2xl ${
                imgLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
            />
          )}
        </div>

        {total > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 md:right-6 z-30 bg-black/75 hover:bg-primary hover:text-black text-white p-3 md:p-4 rounded-full border border-white/20 transition-all flex items-center justify-center shadow-2xl"
            title="Next (Right Arrow)"
          >
            <span className="material-symbols-outlined text-2xl md:text-3xl">chevron_right</span>
          </button>
        )}
      </div>

      {/* Bottom Thumbnails */}
      {total > 1 && (
        <div className="z-20 pt-3 border-t border-white/10 overflow-x-auto flex justify-center items-center gap-2 max-w-5xl mx-auto w-full px-2 scrollbar-none">
          {images.map((url, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate(idx)}
              className={`relative aspect-video w-16 md:w-24 bg-neutral-950 border overflow-hidden transition-all rounded-xs flex-shrink-0 ${
                idx === selectedIndex
                  ? 'border-primary scale-105 ring-2 ring-primary/50 opacity-100'
                  : 'border-white/20 opacity-40 hover:opacity-100'
              }`}
            >
              <img src={url} alt="" className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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

  if (loading) return <main className="pt-32 max-w-container-max mx-auto px-gutter"><p className="font-mono-label">Loading project...</p></main>;
  if (!project || project.error) return <main className="pt-32 max-w-container-max mx-auto px-gutter"><p className="font-mono-label text-error">Project not found</p></main>;

  let features: any[] = [];
  try { if (project.features) features = JSON.parse(project.features); } catch {}

  let journey: any[] = [];
  try { if (project.journey) journey = JSON.parse(project.journey); } catch {}

  let archFlow: any[] = [];
  try { if (project.architectureFlow) archFlow = JSON.parse(project.architectureFlow); } catch {}

  // Consolidate all uploaded project images (Hero image + Gallery images) dynamically
  const rawGallery: string[] = Array.isArray(project.gallery)
    ? project.gallery
    : typeof project.gallery === 'string'
    ? project.gallery.split('\n').map((s: string) => s.trim()).filter(Boolean)
    : [];

  const allImages: string[] = [];
  if (project.image && typeof project.image === 'string' && project.image.trim()) {
    allImages.push(project.image.trim());
  }
  rawGallery.forEach((url: string) => {
    if (url && typeof url === 'string' && url.trim() && !allImages.includes(url.trim())) {
      allImages.push(url.trim());
    }
  });

  const heroImage = allImages.length > 0 ? allImages[0] : null;
  const galleryImages = allImages.length > 1 ? allImages.slice(1) : allImages;

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
            <div className="flex flex-wrap gap-4 mb-4">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-primary px-6 py-3 font-label-caps text-label-caps hover:bg-primary hover:text-on-primary transition-all">
                  WEB APP <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                </a>
              )}
              {project.adminUrl && (
                <a href={project.adminUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-primary px-6 py-3 font-label-caps text-label-caps hover:bg-primary hover:text-on-primary transition-all">
                  ADMIN PANEL <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                </a>
              )}
              {project.demoLinks && (() => {
                try {
                  return JSON.parse(project.demoLinks).map((link: any, idx: number) => (
                    <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-primary px-6 py-3 font-label-caps text-label-caps hover:bg-primary hover:text-on-primary transition-all uppercase">
                      {link.label} <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                    </a>
                  ));
                } catch { return null; }
              })()}
            </div>
          </div>
        </header>

        {/* Main Hero Project Image (Landscape Orientation with object-contain) */}
        {heroImage && (
          <section className="mb-section-gap animate-on-scroll">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center font-mono-label text-xs uppercase text-secondary">
                <span>PROJECT PREVIEW</span>
                <span>LANDSCAPE ORIENTATION</span>
              </div>
              <LandscapeImage
                src={heroImage}
                alt={project.name}
                onClick={() => setLightboxIndex(0)}
                containerClassName="shadow-lg"
              />
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

        {/* Dynamic Project Image Gallery (All Uploaded Landscape Images) */}
        {allImages.length > 0 && (
          <section className="mb-section-gap space-y-gutter animate-on-scroll">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 border-b border-primary pb-4">
              <div>
                <span className="font-mono-label text-mono-label text-secondary block mb-1">MEDIA_GALLERY</span>
                <h2 className="font-headline-md text-headline-md uppercase">Project Showcase Gallery</h2>
              </div>
              <span className="font-mono-label text-xs text-secondary uppercase">
                {allImages.length} {allImages.length === 1 ? 'LANDSCAPE IMAGE' : 'LANDSCAPE IMAGES'} // CLICK TO EXPAND
              </span>
            </div>

            {/* Responsive Landscape Grid Supporting 10+ Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
              {allImages.map((url: string, index: number) => (
                <div key={index} className="flex flex-col gap-2">
                  <LandscapeImage
                    src={url}
                    alt={`${project.name} Screenshot ${index + 1}`}
                    onClick={() => setLightboxIndex(index)}
                  />
                  <div className="flex justify-between items-center font-mono-label text-[10px] text-secondary opacity-70 px-1">
                    <span>SCREENSHOT {String(index + 1).padStart(2, '0')}</span>
                    <span>16:9 LANDSCAPE</span>
                  </div>
                </div>
              ))}
            </div>
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

      {/* Fullscreen Interactive Lightbox Modal */}
      {lightboxIndex !== null && (
        <ImageLightbox
          images={allImages}
          selectedIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(index) => setLightboxIndex(index)}
        />
      )}

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
