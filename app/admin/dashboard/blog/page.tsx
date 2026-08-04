'use client';

import { useEffect, useState } from 'react';

export default function AdminBlogList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/blog')
      .then((r) => r.json())
      .then((data) => { setPosts(data); setLoading(false); })
      .catch(() => { setError('Failed to load posts'); setLoading(false); });
  }, []);

  const togglePublish = async (post: any) => {
    await fetch(`/api/blog/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !post.published }),
    });
    setPosts(await (await fetch('/api/blog')).json());
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this post?')) return;
    await fetch(`/api/blog/${id}`, { method: 'DELETE' });
    setPosts(await (await fetch('/api/blog')).json());
  };

  return (
    <>
      <section className="mb-stack-lg flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">SYSTEM_CONTENT // BLOG</p>
          <h2 className="font-display-lg text-4xl md:text-6xl font-bold tracking-tighter uppercase">Blog Posts</h2>
        </div>
        <a href="/admin/dashboard/blog/new" className="bg-primary text-on-primary px-8 py-4 font-label-caps text-label-caps flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined">add</span>
          NEW POST
        </a>
      </section>

      {loading && <p className="font-mono-label text-mono-label text-secondary py-8 text-center">Loading...</p>}
      {error && <p className="font-mono-label text-mono-label text-error py-8 text-center">{error}</p>}
      {!loading && !error && (
      <div className="border border-on-background">
        <div className="grid grid-cols-12 gap-0">
          <div className="col-span-4 p-4 font-label-caps text-label-caps uppercase border-b border-r border-on-background bg-surface-container-low">Title</div>
          <div className="col-span-2 p-4 font-label-caps text-label-caps uppercase border-b border-r border-on-background bg-surface-container-low">Date</div>
          <div className="col-span-2 p-4 font-label-caps text-label-caps uppercase border-b border-r border-on-background bg-surface-container-low">Status</div>
          <div className="col-span-2 p-4 font-label-caps text-label-caps uppercase border-b border-r border-on-background bg-surface-container-low">Tags</div>
          <div className="col-span-2 p-4 font-label-caps text-label-caps uppercase border-b border-on-background bg-surface-container-low">Actions</div>
          {posts.map((p: any) => (
            <div key={p.id} className="contents group">
              <div className="col-span-4 p-4 border-b border-r border-on-background flex items-center gap-3">
                <span className="font-mono-label">{p.title}</span>
              </div>
              <div className="col-span-2 p-4 border-b border-r border-on-background font-mono-label text-[12px] opacity-60">{p.createdAt}</div>
              <div className="col-span-2 p-4 border-b border-r border-on-background">
                <span className={`px-3 py-1 font-mono-label text-[10px] uppercase ${p.published ? 'bg-primary text-on-primary' : 'border border-on-background'}`}>
                  {p.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="col-span-2 p-4 border-b border-r border-on-background">
                <div className="flex gap-1 flex-wrap">
                  {(p.tags || []).map((t: string) => (
                    <span key={t} className="font-mono-label text-[9px] uppercase border px-1">{t}</span>
                  ))}
                </div>
              </div>
              <div className="col-span-2 p-4 border-b border-on-background flex gap-3">
                <a href={`/admin/dashboard/blog/${p.slug}`} className="font-mono-label text-[11px] uppercase hover:underline">Edit</a>
                <button onClick={() => togglePublish(p)} className="font-mono-label text-[11px] uppercase hover:underline">{p.published ? 'Unpublish' : 'Publish'}</button>
                <button onClick={() => remove(p.id)} className="font-mono-label text-[11px] uppercase text-error hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      <div className="mt-8 text-center">
        <p className="font-mono-label text-[12px] opacity-40">Showing {posts.length} posts</p>
      </div>
    </>
  );
}
