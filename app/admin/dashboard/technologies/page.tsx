'use client';

import { useEffect, useState } from 'react';

export default function AdminTechnologies() {
  const [techs, setTechs] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', category: 'Frontend', proficiency: 80 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/technologies')
      .then((r) => r.json())
      .then((data) => { setTechs(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setError('Failed to load'); setLoading(false); });
  }, []);

  const add = async () => {
    await fetch('/api/technologies', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ name: '', category: 'Frontend', proficiency: 80 });
    const data = await (await fetch('/api/technologies')).json();
    setTechs(Array.isArray(data) ? data : []);
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this technology?')) return;
    await fetch(`/api/technologies/${id}`, { method: 'DELETE' });
    const data = await (await fetch('/api/technologies')).json();
    setTechs(Array.isArray(data) ? data : []);
  };

  if (loading) return <p className="font-mono-label text-mono-label text-secondary py-8 text-center">Loading...</p>;
  if (error) return <p className="font-mono-label text-mono-label text-error py-8 text-center">{error}</p>;

  return (
    <>
      <section className="mb-stack-lg">
        <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">SYSTEM_CORE // TECHNOLOGIES</p>
        <h2 className="font-display-lg text-4xl md:text-6xl font-bold tracking-tighter uppercase">Technologies</h2>
      </section>

      <div className="border border-on-background p-6 mb-stack-lg">
        <h3 className="font-label-caps text-label-caps uppercase mb-4">Add Technology</h3>
        <div className="grid grid-cols-3 gap-4">
          <input className="border border-on-background p-3 font-body-md bg-transparent" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <select className="border border-on-background p-3 font-body-md bg-surface" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {['Frontend', 'Backend', 'Database', 'Tools', 'DevOps'].map((c) => <option key={c}>{c}</option>)}
          </select>
          <div className="flex gap-3">
            <input type="number" className="border border-on-background p-3 font-body-md bg-transparent w-24" min={0} max={100} value={form.proficiency} onChange={(e) => setForm({ ...form, proficiency: Number(e.target.value) })} />
            <button onClick={add} className="bg-primary text-on-primary px-6 font-label-caps text-label-caps hover:opacity-80 transition-opacity">ADD</button>
          </div>
        </div>
      </div>

      <div className="border border-on-background">
        <div className="grid grid-cols-12 gap-0">
          <div className="col-span-4 p-4 font-label-caps text-label-caps uppercase border-b border-r border-on-background bg-surface-container-low">Name</div>
          <div className="col-span-3 p-4 font-label-caps text-label-caps uppercase border-b border-r border-on-background bg-surface-container-low">Category</div>
          <div className="col-span-3 p-4 font-label-caps text-label-caps uppercase border-b border-r border-on-background bg-surface-container-low">Proficiency</div>
          <div className="col-span-2 p-4 font-label-caps text-label-caps uppercase border-b border-on-background bg-surface-container-low">Actions</div>
          {techs.map((t: any) => (
            <div key={t.id} className="contents">
              <div className="col-span-4 p-4 border-b border-r border-on-background font-mono-label">{t.name}</div>
              <div className="col-span-3 p-4 border-b border-r border-on-background">{t.category}</div>
              <div className="col-span-3 p-4 border-b border-r border-on-background">
                <div className="w-full bg-surface-container h-2">
                  <div className="bg-primary h-full" style={{ width: `${t.proficiency}%` }}></div>
                </div>
              </div>
              <div className="col-span-2 p-4 border-b border-on-background">
                <button onClick={() => remove(t.id)} className="font-mono-label text-[11px] uppercase text-error hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
