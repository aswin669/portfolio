'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function AdminBlogEditor() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const isNew = slug === 'new';

  const [form, setForm] = useState<any>({
    id: null, title: '', slug: '', excerpt: '', content: '', author: 'Admin',
    tags: [] as string[], published: false, image: '', metaTitle: '', metaDesc: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [lastSaved, setLastSaved] = useState('');
  const [error, setError] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/blog/${slug}`)
        .then((r) => r.json())
        .then((data) => {
          if (data && (data.id || data.slug)) setForm(data);
          setLoading(false);
        })
        .catch(() => { setError('Failed to load post'); setLoading(false); });
    }
  }, [slug, isNew]);

  useEffect(() => {
    if (contentRef.current && form.content !== undefined) {
      if (contentRef.current.innerHTML !== form.content) {
        contentRef.current.innerHTML = form.content || '';
      }
    }
  }, [loading, form.content]);

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    if (contentRef.current) setForm({ ...form, content: contentRef.current.innerHTML });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.url) exec('insertImage', data.url);
    setUploading(false);
    e.target.value = '';
  };

  const handleImage = () => {
    if (fileRef.current) fileRef.current.click();
  };

  const handleCode = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      exec('insertHTML', `<pre><code>${selection.toString()}</code></pre>`);
    }
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setForm({ ...form, tags: [...(form.tags || []), tagInput.trim().toUpperCase()] });
      setTagInput('');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const content = contentRef.current ? contentRef.current.innerHTML : (form.content || '');
    const payload = { ...form, content };
    const targetId = form.id || slug;
    const url = isNew ? '/api/blog' : `/api/blog/${targetId}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        alert(`Save failed: ${errData.error || res.statusText}`);
      } else {
        const saved = await res.json();
        if (saved && saved.id) setForm((prev: any) => ({ ...prev, ...saved }));
        setLastSaved(new Date().toLocaleString());
        const toast = document.getElementById('saveToast');
        if (toast) {
          toast.classList.remove('translate-y-32');
          toast.classList.add('translate-y-0');
          setTimeout(() => { toast.classList.remove('translate-y-0'); toast.classList.add('translate-y-32'); }, 3000);
        }
        if (isNew) router.push('/admin/dashboard/blog');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Save failed due to network or server error.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center font-mono-label text-mono-label text-secondary">Loading...</div>;
  if (error) return <div className="p-12 text-center font-mono-label text-mono-label text-error">{error}</div>;

  return (
    <div className="selection:bg-primary selection:text-on-primary">
      <div className="p-12 max-w-4xl mx-auto">
        <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
          <section className="space-y-6">
            <div className="space-y-2">
              <label className="font-mono-label text-mono-label text-secondary uppercase block">Post Title</label>
              <input className="w-full font-headline-md text-headline-md font-bold form-underline py-2 placeholder:opacity-20" placeholder="Enter post title..." type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="font-mono-label text-mono-label text-secondary uppercase block">Slug</label>
                <input className="w-full font-mono-label text-mono-label form-underline py-1" type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="font-mono-label text-mono-label text-secondary uppercase block">Author</label>
                <input className="w-full font-mono-label text-mono-label form-underline py-1 opacity-50" type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <label className="font-mono-label text-mono-label text-secondary uppercase block">Excerpt</label>
            <textarea className="w-full font-body-md text-body-md form-underline py-2 resize-none placeholder:opacity-30" placeholder="Brief description..." rows={3} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          </section>

          <section className="border border-on-background bg-surface-container-lowest p-0">
            <div className="flex items-center gap-2 p-2 border-b border-on-background bg-surface-container-low">
              <button type="button" className="p-1 hover:bg-surface-container-highest transition-colors material-symbols-outlined text-[20px]" onClick={() => exec('bold')}>format_bold</button>
              <button type="button" className="p-1 hover:bg-surface-container-highest transition-colors material-symbols-outlined text-[20px]" onClick={() => exec('italic')}>format_italic</button>
              <button type="button" className="p-1 hover:bg-surface-container-highest transition-colors material-symbols-outlined text-[20px]" onClick={() => exec('insertUnorderedList')}>format_list_bulleted</button>
              <div className="w-px h-4 bg-outline-variant mx-1"></div>
              <button type="button" className="p-1 hover:bg-surface-container-highest transition-colors material-symbols-outlined text-[20px]" onClick={() => { const u = prompt('URL:'); if (u) exec('createLink', u); }}>link</button>
              <button type="button" className={`p-1 hover:bg-surface-container-highest transition-colors material-symbols-outlined text-[20px] ${uploading ? 'animate-pulse opacity-50' : ''}`} onClick={handleImage}>{uploading ? 'hourglass_top' : 'image'}</button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              <button type="button" className="p-1 hover:bg-surface-container-highest transition-colors material-symbols-outlined text-[20px]" onClick={handleCode}>code_blocks</button>
            </div>
            <div
              ref={contentRef}
              className="p-8 min-h-[400px] font-body-lg text-body-lg leading-relaxed focus:outline-none"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => setForm({ ...form, content: e.currentTarget.innerHTML })}
              dangerouslySetInnerHTML={{ __html: form.content || '<p>Start writing your blog post here...</p>' }}
            />
          </section>

          <section className="pt-12 border-t border-secondary-fixed">
            <div className="flex items-center gap-4 mb-8">
              <span className="material-symbols-outlined">search</span>
              <h3 className="font-headline-md text-headline-md tracking-tight uppercase">SEO Meta</h3>
            </div>
            <div className="space-y-8 bg-surface-container-low p-6">
              <div className="space-y-2">
                <label className="font-mono-label text-mono-label text-secondary uppercase block">Meta Title</label>
                <input className="w-full font-body-md text-body-md form-underline py-1" placeholder="SEO title..." type="text" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="font-mono-label text-mono-label text-secondary uppercase block">Meta Description</label>
                <textarea className="w-full font-body-md text-body-md form-underline py-1 resize-none" placeholder="SEO description..." rows={2} value={form.metaDesc} onChange={(e) => setForm({ ...form, metaDesc: e.target.value })} />
              </div>
            </div>
          </section>
        </form>
        <div className="h-40"></div>
      </div>

      <aside className="fixed right-0 top-16 h-[calc(100%-4rem)] w-80 bg-surface border-l border-on-background overflow-y-auto z-40">
        <div className="p-8 space-y-10">
          <div className="space-y-4">
            <h4 className="font-label-caps text-label-caps text-secondary uppercase">Publishing Control</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-surface-container p-4 border border-on-background">
                <span className="font-mono-label text-mono-label">STATUS</span>
                <span className={`font-label-caps text-label-caps px-2 py-0.5 border ${form.published ? 'bg-primary text-on-primary border-primary' : 'border-on-background'}`}>
                  {form.published ? 'PUBLISHED' : 'DRAFT'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={handleSave} className="w-full py-4 border border-on-background font-label-caps text-label-caps hover:bg-on-background hover:text-surface transition-all">
                  {saving ? 'SAVING...' : 'SAVE'}
                </button>
                <button onClick={() => { setForm({ ...form, published: true }); handleSave(); }} className="w-full py-4 bg-on-background text-on-primary font-label-caps text-label-caps hover:bg-opacity-80 transition-all">
                  PUBLISH
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between py-4 border-y border-secondary-fixed">
              <label className="font-label-caps text-label-caps uppercase">Published</label>
              <button type="button" onClick={() => setForm({ ...form, published: !form.published })} className={`w-10 h-5 rounded-full p-0.5 transition-colors relative ${form.published ? 'bg-primary' : 'bg-surface-container-highest'}`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${form.published ? 'translate-x-5' : ''}`}></div>
              </button>
            </div>

            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-secondary uppercase block">Category</label>
              <input className="w-full border border-on-background bg-surface p-3 font-body-md" type="text" value={form.category || ''} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-secondary uppercase block">Tags (Enter to add)</label>
              <input className="w-full border border-on-background bg-surface p-3 font-body-md" type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag} />
              <div className="flex flex-wrap gap-2 mt-2">
                {form.tags.map((t: string) => (
                  <span key={t} className="text-[10px] font-mono-label border border-on-background px-2 py-0.5 flex items-center gap-1">
                    {t}
                    <button onClick={() => setForm({ ...form, tags: form.tags.filter((x: string) => x !== t) })}>&times;</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="font-label-caps text-label-caps text-secondary uppercase block">Featured Image</label>
              {form.image && (
                <div className="aspect-video w-full bg-surface-container-low border border-on-background overflow-hidden mb-2 relative">
                  <img className="w-full h-full object-cover" src={form.image} alt="" />
                  <button type="button" onClick={() => setForm({ ...form, image: '' })} className="absolute top-2 right-2 bg-on-background text-on-primary w-6 h-6 flex items-center justify-center text-[12px]">&times;</button>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  className="flex-1 border border-on-background bg-transparent p-3 font-mono-label text-sm"
                  placeholder="Paste image URL..."
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                />
                <label className="bg-primary text-on-primary px-4 py-3 font-label-caps text-label-caps cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">upload</span>
                  UPLOAD
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const fd = new FormData();
                    fd.append('file', file);
                    const res = await fetch('/api/upload', { method: 'POST', body: fd });
                    const data = await res.json();
                    if (data.url) setForm({ ...form, image: data.url });
                    e.target.value = '';
                  }} />
                </label>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-secondary-fixed space-y-2">
            <div className="flex justify-between font-mono-label text-[10px] text-secondary">
              <span>CONTENT LENGTH</span>
              <span>{(form.content || '').replace(/<[^>]*>/g, '').length} chars</span>
            </div>
            <div className="flex justify-between font-mono-label text-[10px] text-secondary">
              <span>LAST SAVED</span>
              <span>{lastSaved || 'NOT YET'}</span>
            </div>
          </div>
        </div>
      </aside>

      <div id="saveToast" className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-on-background text-on-primary px-8 py-4 flex items-center gap-4 border border-white transform translate-y-32 transition-transform duration-500 ease-out z-[100]">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        <span className="font-label-caps text-label-caps">Saved Successfully</span>
      </div>
    </div>
  );
}
