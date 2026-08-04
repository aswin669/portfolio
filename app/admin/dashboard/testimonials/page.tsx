'use client';

import { useEffect, useState, useRef } from 'react';

export default function AdminTestimonials() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ name: '', role: '', company: '', quote: '', content: '', image: '', rating: 5 });
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => fetch('/api/testimonials').then((r) => r.json()).then(setItems);

  useEffect(() => {
    load().then(() => setLoading(false)).catch(() => { setError('Failed to load'); setLoading(false); });
  }, []);

  const startAdd = () => {
    setEditing({ _new: true });
    setForm({ name: '', role: '', company: '', quote: '', content: '', image: '', rating: 5 });
  };

  const startEdit = (item: any) => {
    setEditing(item);
    setForm({ name: item.name || '', role: item.role || '', company: item.company || '', quote: item.quote || '', content: item.content || '', image: item.image || '', rating: item.rating || 5 });
  };

  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editing._new) {
        await fetch('/api/testimonials', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      } else {
        await fetch(`/api/testimonials/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      }
      setEditing(null);
      setForm({ name: '', role: '', company: '', quote: '', content: '', image: '', rating: 5 });
      await load();
    } catch {
      alert('Failed to save');
    }
    setSaving(false);
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this testimonial?')) return;
    await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
    load();
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.url) setForm({ ...form, image: data.url });
    e.target.value = '';
  };

  if (loading) return <p className="font-mono-label text-mono-label text-secondary py-8 text-center">Loading...</p>;
  if (error) return <p className="font-mono-label text-mono-label text-error py-8 text-center">{error}</p>;

  return (
    <>
      <section className="mb-stack-lg flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">VERIFICATION // TESTIMONIALS</p>
          <h2 className="font-display-lg text-4xl md:text-6xl font-bold tracking-tighter uppercase">Testimonials</h2>
        </div>
        <button onClick={startAdd} className="bg-primary text-on-primary px-8 py-4 font-label-caps text-label-caps flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined">add</span>
          ADD TESTIMONIAL
        </button>
      </section>

      {(editing !== null) && (
        <div className="border border-primary p-8 mb-stack-lg bg-surface-container-low">
          <h3 className="font-label-caps text-label-caps uppercase mb-6">{editing._new ? 'NEW TESTIMONIAL' : 'EDIT TESTIMONIAL'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="font-mono-label text-[11px] uppercase opacity-60">Name</label>
              <input className="w-full border border-on-background bg-transparent p-3 font-mono-label text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="font-mono-label text-[11px] uppercase opacity-60">Role</label>
              <input className="w-full border border-on-background bg-transparent p-3 font-mono-label text-sm" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="font-mono-label text-[11px] uppercase opacity-60">Company</label>
              <input className="w-full border border-on-background bg-transparent p-3 font-mono-label text-sm" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </div>
            <div className="space-y-2">
              <label className="font-mono-label text-[11px] uppercase opacity-60">Image</label>
              <div className="flex gap-2">
                <input className="flex-1 border border-on-background bg-transparent p-3 font-mono-label text-sm" placeholder="https://..." value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                <label className="bg-primary text-on-primary px-4 py-3 font-label-caps text-label-caps cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">upload</span>
                  <input type="file" accept="image/*" className="hidden" ref={fileRef} onChange={uploadImage} />
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <label className="font-mono-label text-[11px] uppercase opacity-60">Rating</label>
              <div className="flex gap-1">
                {[1,2,3,4,5].map((star) => (
                  <button key={star} type="button" onClick={() => setForm({ ...form, rating: star })} className={`material-symbols-outlined text-2xl ${form.rating >= star ? 'text-primary' : 'opacity-20'}`} style={{ fontVariationSettings: "'FILL' 1" }}>star</button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-2 mb-6">
            <label className="font-mono-label text-[11px] uppercase opacity-60">Quote</label>
            <textarea className="w-full border border-on-background bg-transparent p-3 font-mono-label text-sm resize-none" rows={3} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
          </div>
          <div className="space-y-2 mb-6">
            <label className="font-mono-label text-[11px] uppercase opacity-60">Content (fallback if no quote)</label>
            <textarea className="w-full border border-on-background bg-transparent p-3 font-mono-label text-sm resize-none" rows={2} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </div>
          <div className="flex gap-4">
            <button onClick={save} disabled={saving || !form.name.trim()} className="bg-primary text-on-primary px-8 py-3 font-label-caps text-label-caps disabled:opacity-40">{saving ? 'SAVING...' : 'SAVE'}</button>
            <button onClick={() => setEditing(null)} className="border border-on-background px-8 py-3 font-label-caps text-label-caps hover:bg-on-background hover:text-white transition-all">CANCEL</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-gutter">
        {items.map((item: any) => (
          <div key={item.id} className="border border-on-background p-6 flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1">
              <p className="font-body-md text-body-md italic mb-3">&ldquo;{item.quote || item.content}&rdquo;</p>
              <div className="flex items-center gap-3">
                {item.image && <img className="w-10 h-10 object-cover grayscale border border-on-background" src={item.image} alt="" />}
                <div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <span key={s} className={`material-symbols-outlined text-[14px] ${(item.rating || 5) >= s ? 'text-primary' : 'opacity-20'}`} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="font-label-caps text-label-caps">{item.name}</p>
                  <p className="font-mono-label text-[11px] text-secondary">{item.role}{item.company ? `, ${item.company}` : ''}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 self-start">
              <button onClick={() => startEdit(item)} className="font-mono-label text-[11px] uppercase hover:underline">Edit</button>
              <button onClick={() => remove(item.id)} className="font-mono-label text-[11px] uppercase text-error hover:underline">Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="font-mono-label text-mono-label text-secondary text-center py-8">No testimonials yet</p>}
      </div>
    </>
  );
}
