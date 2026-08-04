'use client';

import { useEffect, useState } from 'react';

export default function AdminMedia() {
  const [assets, setAssets] = useState<any[]>([]);
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/media')
      .then((r) => r.json())
      .then((data) => { setAssets(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setError('Failed to load'); setLoading(false); });
  }, []);

  const remove = async (id: number) => {
    if (!confirm('Delete this asset?')) return;
    await fetch(`/api/media/${id}`, { method: 'DELETE' });
    const data = await (await fetch('/api/media')).json();
    setAssets(Array.isArray(data) ? data : []);
  };

  const upload = async () => {
    if (!url.trim()) return;
    setUploading(true);
    const name = url.split('/').pop() || 'Untitled';
    await fetch('/api/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, url, type: 'image/jpeg', size: 0 }),
    });
    setUrl('');
    setUploading(false);
    setAssets(await (await fetch('/api/media')).json());
  };

  if (loading) return <p className="font-mono-label text-mono-label text-secondary py-8 text-center">Loading...</p>;
  if (error) return <p className="font-mono-label text-mono-label text-error py-8 text-center">{error}</p>;

  return (
    <>
      <section className="mb-stack-lg">
        <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">SYSTEM_ASSETS // MEDIA</p>
        <h2 className="font-display-lg text-4xl md:text-6xl font-bold tracking-tighter uppercase">Media Library</h2>
      </section>

      <div className="border border-dashed border-on-background p-8 mb-stack-lg space-y-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="font-mono-label text-[11px] opacity-60 block mb-2">UPLOAD FROM COMPUTER</label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                const fd = new FormData();
                fd.append('file', file);
                const res = await fetch('/api/upload', { method: 'POST', body: fd });
                if (res.ok) setAssets(await (await fetch('/api/media')).json());
                setUploading(false);
              }}
              className="w-full border border-on-background bg-transparent p-3 font-mono-label text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-primary file:text-on-primary file:font-label-caps file:text-label-caps"
            />
          </div>
        </div>
        <div className="w-full h-px bg-on-background opacity-20"></div>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="font-mono-label text-[11px] opacity-60 block mb-2">OR PASTE IMAGE URL</label>
            <input
              className="w-full border border-on-background bg-transparent p-3 font-mono-label text-sm"
              placeholder="https://example.com/image.jpg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && upload()}
            />
          </div>
          <button
            onClick={upload}
            disabled={uploading || !url.trim()}
            className="bg-primary text-on-primary px-8 py-3 font-label-caps text-label-caps disabled:opacity-40 hover:opacity-80 transition-opacity"
          >
            {uploading ? 'Uploading...' : 'Upload URL'}
          </button>
        </div>
        <p className="font-mono-label text-[11px] opacity-40">Supported: JPG, PNG, SVG, WebP</p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-gutter">
        {assets.map((a: any) => (
          <div key={a.id} className="group border border-on-background overflow-hidden">
            <div className="aspect-square bg-surface-container-low relative overflow-hidden">
              {a.url && (a.url.startsWith('/') || a.url.startsWith('http')) ? (
                <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" src={a.url} alt={a.name} />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl opacity-20">image</span>
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="font-mono-label text-[11px] truncate">{a.name}</p>
              <p className="font-mono-label text-[9px] opacity-40 uppercase">{a.type}</p>
              <button onClick={() => remove(a.id)} className="font-mono-label text-[9px] uppercase text-error hover:underline mt-1">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
