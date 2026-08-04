'use client';

import { useEffect, useState } from 'react';

export default function Testimonial() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data.slice(0, 6) : []))
      .catch(() => setItems([]));
  }, []);

  if (items.length === 0) return null;

  return (
    <section id="testimonials" className="max-w-container-max mx-auto px-gutter py-section-gap border-t border-outline-variant">
      <div className="flex justify-between items-end mb-stack-lg">
        <div>
          <span className="font-mono-label text-mono-label uppercase text-secondary">02 / Social Proof</span>
          <h2 className="font-headline-md text-headline-md uppercase mt-2">Testimonials</h2>
        </div>
        <a className="font-label-caps text-label-caps border-b border-primary pb-1 hover:pb-2 transition-all" href="/testimonials">View All [{items.length}]</a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        {items.map((item) => (
          <div key={item.id} className="border border-outline-variant p-gutter flex flex-col bg-surface-container-low">
            <div className="flex gap-0.5 mb-stack-md">
              {[1,2,3,4,5].map((s) => (
                <span key={s} className={`material-symbols-outlined text-[16px] ${(item.rating || 5) >= s ? 'text-primary' : 'opacity-20'}`} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              ))}
            </div>
            <p className="font-body-md text-secondary leading-relaxed mb-stack-md flex-1 italic">
              &ldquo;{item.quote || item.content}&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-stack-md border-t border-outline-variant">
              {item.image && (
                <img src={item.image} alt="" className="w-10 h-10 rounded-full object-cover grayscale" />
              )}
              <div>
                <p className="font-label-caps text-label-caps uppercase text-primary">{item.name}</p>
                <p className="font-mono-label text-mono-label text-secondary">{item.role}{item.company ? `, ${item.company}` : ''}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
