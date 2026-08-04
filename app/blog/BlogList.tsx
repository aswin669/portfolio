'use client';

import { useEffect, useState } from 'react';

export default function BlogList() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/blog')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data.filter((p: any) => p.published));
        } else {
          setPosts([]);
        }
        setLoading(false);
      })
      .catch(() => { setError('Failed to load posts'); setLoading(false); });
  }, []);

  if (loading) return (
    <main className="pt-32 max-w-container-max mx-auto px-gutter">
      <p className="font-mono-label text-mono-label text-secondary">Loading posts...</p>
    </main>
  );

  if (error) return (
    <main className="pt-32 max-w-container-max mx-auto px-gutter">
      <p className="font-mono-label text-mono-label text-error">{error}</p>
    </main>
  );

  return (
    <main className="pt-32 max-w-container-max mx-auto px-gutter">
      <header className="mb-section-gap">
        <span className="font-mono-label text-mono-label text-secondary block mb-stack-sm">INSIGHTS</span>
        <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg uppercase mb-stack-md">Blog</h1>
        <p className="font-body-lg text-body-lg text-secondary max-w-xl">Articles on web development, system architecture, and the MERN stack.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-section-gap">
        {posts.map((post) => (
          <a key={post.id} href={`/blog/${post.slug}`} className="group border border-outline-variant p-gutter hover:border-primary transition-colors">
            {post.image && (
              <div className="aspect-video mb-stack-md overflow-hidden bg-surface-container">
                <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105" src={post.image} alt="" />
              </div>
            )}
            <div className="flex items-center gap-3 mb-stack-sm">
              <span className="font-mono-label text-[11px] text-secondary">{post.createdAt}</span>
              {(post.tags || []).slice(0, 2).map((t: string) => (
                <span key={t} className="font-mono-label text-[10px] border border-primary px-2 py-0.5 uppercase">{t}</span>
              ))}
            </div>
            <h2 className="font-headline-md text-headline-md mb-2 group-hover:underline">{post.title}</h2>
            <p className="text-secondary font-body-md">{post.excerpt}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
