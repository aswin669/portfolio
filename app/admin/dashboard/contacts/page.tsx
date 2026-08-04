'use client';

import { useEffect, useState } from 'react';

export default function AdminContacts() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = () => fetch('/api/contact').then((r) => r.json()).then(setItems);

  useEffect(() => {
    load().then(() => setLoading(false)).catch(() => { setError('Failed to load'); setLoading(false); });
  }, []);

  const remove = async (id: number) => {
    if (!confirm('Delete this contact submission?')) return;
    await fetch(`/api/contact/${id}`, { method: 'DELETE' });
    load();
  };

  if (loading) return <p className="font-mono-label text-mono-label text-secondary py-8 text-center">Loading...</p>;
  if (error) return <p className="font-mono-label text-mono-label text-error py-8 text-center">{error}</p>;

  return (
    <>
      <section className="mb-stack-lg flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">INBOX // CONTACT</p>
          <h2 className="font-display-lg text-4xl md:text-6xl font-bold tracking-tighter uppercase">Contact Submissions</h2>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-gutter">
        {items.map((item: any) => (
          <div key={item.id} className="border border-on-background p-6 flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-4 mb-2 flex-wrap">
                <h3 className="font-label-caps text-label-caps uppercase">{item.name}</h3>
                <span className="font-mono-label text-[11px] opacity-60">{item.email}</span>
                <span className="font-mono-label text-[10px] text-secondary ml-auto">{item.createdAt || ''}</span>
              </div>
              <p className="font-mono-label text-[12px] text-primary mb-2">{item.subject || '(No subject)'}</p>
              <p className="font-body-md text-sm text-secondary">
                {expanded === item.id ? item.message : `${(item.message || '').slice(0, 120)}...`}
                {(item.message || '').length > 120 && (
                  <button onClick={() => setExpanded(expanded === item.id ? null : item.id)} className="font-mono-label text-[11px] text-primary hover:underline ml-2">
                    {expanded === item.id ? 'LESS' : 'MORE'}
                  </button>
                )}
              </p>
            </div>
            <div className="flex gap-3 self-start shrink-0">
              <button onClick={() => remove(item.id)} className="font-mono-label text-[11px] uppercase text-error hover:underline">Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="font-mono-label text-mono-label text-secondary text-center py-8">No contact submissions yet</p>}
      </div>
    </>
  );
}
