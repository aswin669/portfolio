'use client';

import { useEffect, useState } from 'react';
import Footer from './Footer';

export default function GalleryPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/media')
      .then((r) => r.json())
      .then((data) => { setAssets(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setError('Failed to load gallery'); setLoading(false); });
  }, []);

  return (
    <>
      <main className="pt-32 pb-section-gap max-w-container-max mx-auto px-gutter">
        <header className="mb-section-gap">
          <span className="font-mono-label text-mono-label text-secondary block mb-stack-sm">PORTFOLIO</span>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg uppercase mb-stack-md">Gallery</h1>
          <p className="font-body-lg text-body-lg text-secondary max-w-xl">Visual collection of projects, designs, and creative work.</p>
        </header>

        {loading && <p className="font-mono-label text-mono-label text-secondary py-12 text-center">Loading gallery...</p>}
        {error && <p className="font-mono-label text-mono-label text-error py-12 text-center">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {assets.map((a: any) => (
              <div key={a.id} className="group border border-outline-variant overflow-hidden">
                <div className="aspect-square bg-surface-container-low overflow-hidden">
                  {a.url && (a.url.startsWith('/') || a.url.startsWith('http')) ? (
                    <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" src={a.url} alt={a.name} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-6xl opacity-20">image</span>
                    </div>
                  )}
                </div>
                <div className="p-6 border-t border-outline-variant">
                  <p className="font-mono-label text-sm truncate">{a.name}</p>
                  <p className="font-mono-label text-[10px] opacity-40 uppercase mt-1">{a.type} — {a.uploadedAt}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
