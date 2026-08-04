'use client';

import { useEffect, useState } from 'react';

export default function TestimonialsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/testimonials')
      .then((r) => r.json())
      .then((data) => { setItems(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <main className="pt-32 pb-section-gap max-w-container-max mx-auto px-gutter"><p className="font-mono-label">Loading...</p></main>;

  return (
    <main className="pt-32 pb-section-gap max-w-container-max mx-auto px-gutter">
      <header className="mb-20">
        <div className="font-mono-label text-mono-label uppercase tracking-widest text-secondary mb-4">Verification // Validation</div>
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-8 leading-none">Client Feedback.</h1>
        <div className="w-full h-px bg-primary mb-8"></div>
        <p className="font-body-lg text-body-lg max-w-2xl text-secondary">A record of high-stakes technical collaborations, performance-driven engineering solutions, and the architectural impact of precision code.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {items.map((item, i) => (
          <article key={item.id} className={`testimonial-card p-stack-lg border flex flex-col justify-between min-h-[400px] ${
            i === 0 ? 'md:col-span-12 lg:col-span-8 border-primary' :
            i === 3 ? 'md:col-span-12 lg:col-span-8 border-outline-variant' :
            'md:col-span-6 lg:col-span-4 border-outline-variant'
          }`}>
            <div>
              <span className="material-symbols-outlined quote-icon text-primary text-4xl mb-stack-md" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
              <p className={`mb-12 ${i === 0 ? 'font-body-lg text-2xl md:text-3xl leading-relaxed italic' : 'font-body-md text-body-md'}`}>{item.quote}</p>
            </div>
            <div>
              <div className="divider border-t border-outline-variant mb-stack-md"></div>
              <div className="flex items-center gap-stack-md">
                <div className="w-12 h-12 border border-outline-variant overflow-hidden shrink-0">
                  <img className="w-full h-full object-cover" src={item.image} alt="" />
                </div>
                <div className="client-details">
                  <div className="flex gap-0.5 mb-1">
                    {[1,2,3,4,5].map((s) => (
                      <span key={s} className={`material-symbols-outlined text-[16px] ${(item.rating || 5) >= s ? 'text-primary' : 'opacity-20'}`} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <h4 className="font-label-caps text-label-caps font-bold">{item.name}</h4>
                  <p className="font-mono-label text-mono-label text-secondary text-[10px] uppercase">{item.role}, {item.company}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-section-gap grid grid-cols-2 md:grid-cols-4 border-y border-primary">
        <div className="p-stack-lg border-r border-outline-variant text-center">
          <div className="font-display-lg text-headline-md mb-2">98%</div>
          <p className="font-mono-label text-mono-label uppercase text-secondary">Client Retention</p>
        </div>
        <div className="p-stack-lg border-r border-outline-variant text-center">
          <div className="font-display-lg text-headline-md mb-2">10+</div>
          <p className="font-mono-label text-mono-label uppercase text-secondary">Deployments</p>
        </div>
        <div className="p-stack-lg border-r border-outline-variant text-center">
          <div className="font-display-lg text-headline-md mb-2">2+</div>
          <p className="font-mono-label text-mono-label uppercase text-secondary">Years Active</p>
        </div>
        <div className="p-stack-lg text-center">
          <div className="font-display-lg text-headline-md mb-2">100%</div>
          <p className="font-mono-label text-mono-label uppercase text-secondary">Deadline Hit</p>
        </div>
      </section>
    </main>
  );
}
