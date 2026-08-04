'use client';

import { useEffect, useState } from 'react';

export default function AdminCategories() {
  const [cats, setCats] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => { setCats(data); setLoading(false); })
      .catch(() => { setError('Failed to load'); setLoading(false); });
  }, []);

  const add = async () => {
    if (!name.trim()) return;
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, slug }) });
    setName('');
    setCats(await (await fetch('/api/categories')).json());
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this category?')) return;
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    setCats(await (await fetch('/api/categories')).json());
  };

  if (loading) return <p className="font-mono-label text-mono-label text-secondary py-8 text-center">Loading...</p>;
  if (error) return <p className="font-mono-label text-mono-label text-error py-8 text-center">{error}</p>;

  return (
    <>
      <section className="mb-stack-lg">
        <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">SYSTEM_TAXONOMY // CATEGORIES</p>
        <h2 className="font-display-lg text-4xl md:text-6xl font-bold tracking-tighter uppercase">Categories</h2>
      </section>

      <div className="border border-on-background p-6 mb-stack-lg">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="font-mono-label text-[10px] uppercase opacity-40 block mb-1">Category Name</label>
            <input className="w-full border border-on-background p-3 font-body-md bg-transparent" placeholder="e.g. Web Development" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} />
          </div>
          <button onClick={add} className="bg-primary text-on-primary px-8 py-3 font-label-caps text-label-caps hover:opacity-80 transition-opacity">ADD</button>
        </div>
      </div>

      <div className="border border-on-background">
        <div className="grid grid-cols-12 gap-0">
          <div className="col-span-5 p-4 font-label-caps text-label-caps uppercase border-b border-r border-on-background bg-surface-container-low">Name</div>
          <div className="col-span-3 p-4 font-label-caps text-label-caps uppercase border-b border-r border-on-background bg-surface-container-low">Slug</div>
          <div className="col-span-2 p-4 font-label-caps text-label-caps uppercase border-b border-r border-on-background bg-surface-container-low">Projects</div>
          <div className="col-span-2 p-4 font-label-caps text-label-caps uppercase border-b border-on-background bg-surface-container-low">Actions</div>
          {cats.map((c: any) => (
            <div key={c.id} className="contents">
              <div className="col-span-5 p-4 border-b border-r border-on-background font-mono-label">{c.name}</div>
              <div className="col-span-3 p-4 border-b border-r border-on-background font-mono-label text-[12px] opacity-60">{c.slug}</div>
              <div className="col-span-2 p-4 border-b border-r border-on-background font-mono-label">{c.count}</div>
              <div className="col-span-2 p-4 border-b border-on-background">
                <button onClick={() => remove(c.id)} className="font-mono-label text-[11px] uppercase text-error hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
