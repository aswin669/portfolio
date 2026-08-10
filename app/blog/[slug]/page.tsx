'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setPost(data);
      })
      .catch(() => setError('Failed to load post'));
  }, [slug]);

  if (error || (post && post.error)) {
    return (
      <main className="pt-32 max-w-container-max mx-auto px-gutter">
        <p className="font-mono-label text-mono-label text-error">{error || post?.error}</p>
        <a href="/blog" className="font-label-caps text-label-caps inline-flex items-center gap-2 mt-4 hover:underline">
          <span className="material-symbols-outlined">arrow_back</span>
          Back to blog
        </a>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="pt-32 max-w-container-max mx-auto px-gutter">
        <p className="font-mono-label text-mono-label text-secondary">Loading...</p>
      </main>
    );
  }

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 border-b border-outline-variant px-gutter h-20 flex justify-between items-center max-w-container-max mx-auto left-1/2 -translate-x-1/2 bg-surface">
        <a className="font-display-lg text-headline-md tracking-tighter text-primary" href="/">ASWIN_S</a>
        <a className="font-label-caps text-label-caps text-primary uppercase tracking-widest hover:opacity-70 transition-opacity" href="/blog">Back to Blog</a>
      </nav>

      <main className="pt-32 max-w-3xl mx-auto px-gutter mb-section-gap">
        <header className="mb-stack-lg">
          <div className="flex items-center gap-3 mb-stack-sm">
            <span className="font-mono-label text-mono-label text-secondary">
              {post.createdAt ? (isNaN(new Date(post.createdAt).getTime()) ? post.createdAt : new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })) : ''}
            </span>
            {(post.tags || []).map((t: string) => (
              <span key={t} className="font-mono-label text-[10px] border border-primary px-2 py-0.5 uppercase">{t}</span>
            ))}
          </div>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg uppercase mb-stack-md text-primary">{post.title}</h1>
          {post.excerpt && <p className="font-body-lg text-body-lg text-secondary leading-relaxed mb-stack-md">{post.excerpt}</p>}
        </header>

        {post.image && (
          <div className="aspect-video w-full overflow-hidden border border-outline-variant bg-surface-container mb-stack-lg">
            <img className="w-full h-full object-cover grayscale-hover" src={post.image} alt="" />
          </div>
        )}

        <article
          className="font-body-lg text-body-lg leading-relaxed prose dark:prose-invert prose-headings:text-primary prose-p:text-on-surface prose-strong:text-primary prose-a:text-primary max-w-none text-on-surface"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-section-gap pt-stack-lg border-t border-primary">
          <a className="font-label-caps text-label-caps inline-flex items-center gap-2 hover:underline" href="/blog">
            <span className="material-symbols-outlined">arrow_back</span>
            Back to all posts
          </a>
        </div>
      </main>

      <footer className="w-full py-stack-lg px-gutter flex flex-col md:flex-row justify-between items-center max-w-container-max mx-auto border-t border-primary">
        <div className="font-display-lg text-headline-md text-primary mb-stack-md md:mb-0">ASWIN_S</div>
        <div className="flex gap-stack-lg mb-stack-md md:mb-0">
          <a className="font-mono-label text-mono-label text-secondary hover:text-primary hover:underline transition-all" href="https://github.com/aswin669">GitHub</a>
          <a className="font-mono-label text-mono-label text-secondary hover:text-primary hover:underline transition-all" href="https://linkedin.com/in/aswin669">LinkedIn</a>
          <a className="font-mono-label text-mono-label text-secondary hover:text-primary hover:underline transition-all" href="mailto:Aswinsreedharan669@gmail.com">Email</a>
        </div>
        <div className="font-mono-label text-mono-label text-secondary">&copy; 2025 ASWIN S. ALL RIGHTS RESERVED.</div>
      </footer>
    </>
  );
}
