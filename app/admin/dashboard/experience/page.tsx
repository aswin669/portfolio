'use client';

import { useEffect, useState } from 'react';

export default function AdminExperience() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ title: '', company: '', startDate: '', endDate: '', highlights: '' });
  const [saving, setSaving] = useState(false);

  const load = () => fetch('/api/experience').then((r) => r.json()).then(setItems);

  useEffect(() => {
    load().then(() => setLoading(false)).catch(() => { setError('Failed to load'); setLoading(false); });
  }, []);

  const startAdd = () => {
    setEditing({ _new: true });
    setForm({ title: '', company: '', startDate: '', endDate: '', highlights: '' });
  };

  const startEdit = (item: any) => {
    setEditing(item);
    setForm({ title: item.title || '', company: item.company || '', startDate: item.startDate || '', endDate: item.endDate || '', highlights: (item.highlights || []).join('\n') });
  };

  const save = async () => {
    if (!form.title.trim()) return;
    const highlightsList = typeof form.highlights === 'string' ? form.highlights.split('\n') : (Array.isArray(form.highlights) ? form.highlights : []);
    const payload = { ...form, highlights: highlightsList.map((l: string) => String(l).trim()).filter(Boolean) };
    try {
      if (editing._new) {
        await fetch('/api/experience', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      } else {
        await fetch(`/api/experience/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      }
      setEditing(null);
      setForm({ title: '', company: '', startDate: '', endDate: '', highlights: '' });
      await load();
    } catch {
      alert('Failed to save');
    }
    setSaving(false);
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this experience entry?')) return;
    await fetch(`/api/experience/${id}`, { method: 'DELETE' });
    load();
  };

  if (loading) return <p className="font-mono-label text-mono-label text-secondary py-8 text-center">Loading...</p>;
  if (error) return <p className="font-mono-label text-mono-label text-error py-8 text-center">{error}</p>;

  return (
    <>
      <section className="mb-stack-lg flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">CAREER // EXPERIENCE</p>
          <h2 className="font-display-lg text-4xl md:text-6xl font-bold tracking-tighter uppercase">Experience</h2>
        </div>
        <button onClick={startAdd} className="bg-primary text-on-primary px-8 py-4 font-label-caps text-label-caps flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined">add</span>
          ADD EXPERIENCE
        </button>
      </section>

      {(editing !== null) && (
        <div className="border border-primary p-8 mb-stack-lg bg-surface-container-low">
          <h3 className="font-label-caps text-label-caps uppercase mb-6">{editing._new ? 'NEW EXPERIENCE' : 'EDIT EXPERIENCE'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="font-mono-label text-[11px] uppercase opacity-60">Title</label>
              <input className="w-full border border-on-background bg-transparent p-3 font-mono-label text-sm" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="font-mono-label text-[11px] uppercase opacity-60">Company</label>
              <input className="w-full border border-on-background bg-transparent p-3 font-mono-label text-sm" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="font-mono-label text-[11px] uppercase opacity-60">Start Date</label>
              <input className="w-full border border-on-background bg-transparent p-3 font-mono-label text-sm" placeholder="e.g. SEP 2025" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="font-mono-label text-[11px] uppercase opacity-60">End Date</label>
              <input className="w-full border border-on-background bg-transparent p-3 font-mono-label text-sm" placeholder="e.g. PRESENT" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2 mb-6">
            <label className="font-mono-label text-[11px] uppercase opacity-60">Highlights (one per line)</label>
            <textarea className="w-full border border-on-background bg-transparent p-3 font-mono-label text-sm resize-none" rows={6} value={form.highlights} onChange={(e) => setForm({ ...form, highlights: e.target.value })} />
          </div>
          <div className="flex gap-4">
            <button onClick={save} disabled={saving || !form.title.trim()} className="bg-primary text-on-primary px-8 py-3 font-label-caps text-label-caps disabled:opacity-40">{saving ? 'SAVING...' : 'SAVE'}</button>
            <button onClick={() => setEditing(null)} className="border border-on-background px-8 py-3 font-label-caps text-label-caps hover:bg-on-background hover:text-white transition-all">CANCEL</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-gutter">
        {items.map((item: any) => (
          <div key={item.id} className="border border-on-background p-6 flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-baseline gap-4 mb-2">
                <h3 className="font-label-caps text-label-caps uppercase">{item.title}</h3>
                <span className="font-mono-label text-[11px] text-secondary">{item.company}</span>
              </div>
              <p className="font-mono-label text-[11px] text-secondary mb-3">{item.startDate} — {item.endDate}</p>
              <ul className="space-y-1">
                {(item.highlights || []).map((h: string, i: number) => (
                  <li key={i} className="font-mono-label text-[12px] text-secondary flex items-start gap-2">
                    <span className="mt-1.5 w-1 h-1 bg-primary flex-shrink-0"></span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-3 self-start">
              <button onClick={() => startEdit(item)} className="font-mono-label text-[11px] uppercase hover:underline">Edit</button>
              <button onClick={() => remove(item.id)} className="font-mono-label text-[11px] uppercase text-error hover:underline">Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="font-mono-label text-mono-label text-secondary text-center py-8">No experience entries yet</p>}
      </div>
    </>
  );
}
