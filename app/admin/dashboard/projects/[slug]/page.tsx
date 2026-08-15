'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';

const emptyForm = {
  name: '', slug: '', tagline: '', year: '', stack: '', type: '', status: 'DRAFT',
  problem: '', solution: '', content: '', metaTitle: '', metaDesc: '', category: '',
  tags: [] as string[], featured: false, noIndex: false, canonical: false, image: '',
  liveUrl: '', adminUrl: '', demoLinks: '[]', architecture: '', architectureFlow: '', features: '', journey: '', gallery: '',
};

export default function AdminProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const isNew = slug === 'new';

  const [form, setForm] = useState<any>(emptyForm);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [lastSaved, setLastSaved] = useState('');

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/projects/${slug}`)
        .then((r) => r.json())
        .then((data) => {
          if (data && (data.id || data.slug)) {
            setForm({
              ...emptyForm,
              ...data,
              name: data.name || data.title || '',
              tagline: data.tagline || data.description || '',
              stack: data.stack || data.tech || '',
              problem: data.problem || '',
              solution: data.solution || '',
              content: data.content || '',
              architecture: data.architecture || '',
              tags: Array.isArray(data.tags) ? data.tags : [],
              gallery: Array.isArray(data.gallery) ? data.gallery.join('\n') : (typeof data.gallery === 'string' ? data.gallery : ''),
              demoLinks: typeof data.demoLinks === 'object' ? JSON.stringify(data.demoLinks, null, 2) : (data.demoLinks || '[]'),
              architectureFlow: typeof data.architectureFlow === 'object' ? JSON.stringify(data.architectureFlow, null, 2) : (data.architectureFlow || ''),
              features: typeof data.features === 'object' ? JSON.stringify(data.features, null, 2) : (data.features || ''),
              journey: typeof data.journey === 'object' ? JSON.stringify(data.journey, null, 2) : (data.journey || ''),
            });
            if (data.id) setProjectId(data.id);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [slug, isNew]);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && form.content !== undefined) {
      if (contentRef.current.innerHTML !== form.content) {
        contentRef.current.innerHTML = form.content || '';
      }
    }
  }, [loading, form.content]);

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setForm({ ...form, tags: [...(form.tags || []), tagInput.trim().toUpperCase()] });
      setTagInput('');
    }
  };

  const removeTag = (t: string) => setForm({ ...form, tags: (form.tags || []).filter((x: string) => x !== t) });
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

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

  const handleSave = async (action: 'draft' | 'publish') => {
    setSaving(true);
    const content = contentRef.current ? contentRef.current.innerHTML : (form.content || '');
    const payload = {
      ...form,
      content,
      status: action === 'publish' ? 'LIVE' : 'DRAFT',
      gallery: (form.gallery || '').split('\n').map((u: string) => u.trim()).filter(Boolean),
    };
    const targetId = projectId || form?.id || slug;
    try {
      const res = isNew
        ? await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          })
        : await fetch(`/api/projects/${targetId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        alert(`Save failed: ${errData.error || res.statusText}`);
      } else {
        const savedData = await res.json();
        if (savedData && savedData.id) {
          setProjectId(savedData.id);
          setForm((prev: any) => ({ ...prev, ...savedData }));
        }
        setLastSaved(new Date().toLocaleString());
        const toast = document.getElementById('saveToast');
        if (toast) {
          toast.classList.remove('translate-y-32');
          toast.classList.add('translate-y-0');
          setTimeout(() => {
            toast.classList.remove('translate-y-0');
            toast.classList.add('translate-y-32');
          }, 3000);
        }
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('Save failed due to network or server error.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center font-mono-label text-mono-label text-secondary">Loading...</div>;

  return (
    <div className="selection:bg-primary selection:text-on-primary">
      <div className="p-12 max-w-4xl mr-80">
        <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
          <section className="space-y-6">
            <div className="space-y-2">
              <label className="font-mono-label text-mono-label text-secondary uppercase block">Project Name</label>
              <input
                className="w-full font-headline-md text-headline-md font-bold form-underline py-2 placeholder:opacity-20"
                placeholder="Enter project name..."
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="font-mono-label text-mono-label text-secondary uppercase block">Slug</label>
                <input className="w-full font-mono-label text-mono-label form-underline py-1" type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="font-mono-label text-mono-label text-secondary uppercase block">Case Label</label>
                <input className="w-full font-mono-label text-mono-label form-underline py-1" type="text" value={form.caseNo || 'CASE STUDY'} onChange={(e) => setForm({ ...form, caseNo: e.target.value })} />
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="font-mono-label text-mono-label text-secondary uppercase block">Live Demo URL (Web)</label>
              <input className="w-full font-mono-label text-mono-label form-underline py-1" type="url" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <label className="font-mono-label text-mono-label text-secondary uppercase block">Admin Panel URL</label>
              <input className="w-full font-mono-label text-mono-label form-underline py-1" type="url" value={form.adminUrl} onChange={(e) => setForm({ ...form, adminUrl: e.target.value })} placeholder="https://..." />
            </div>
          </section>

          <section className="space-y-2">
            <label className="font-mono-label text-mono-label text-secondary uppercase block">Extra Demo Links <span className="text-secondary opacity-60">(JSON: [{'{'}label, url{'}'}])</span></label>
            <textarea
              className="w-full font-body-md text-body-md form-underline py-2 resize-none font-mono text-sm"
              rows={3}
              placeholder='[{&quot;label&quot;:&quot;iOS App&quot;,&quot;url&quot;:&quot;...&quot;}]'
              value={form.demoLinks}
              onChange={(e) => setForm({ ...form, demoLinks: e.target.value })}
            />
          </section>

          <section className="space-y-2">
            <label className="font-mono-label text-mono-label text-secondary uppercase block">Tagline / Brief</label>
            <textarea
              className="w-full font-body-md text-body-md form-underline py-2 resize-none placeholder:opacity-30"
              placeholder="A short description of the project..."
              rows={3}
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            />
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
              className="p-8 min-h-[300px] font-body-lg text-body-lg leading-relaxed focus:outline-none"
              contentEditable
              suppressContentEditableWarning
              dangerouslySetInnerHTML={{ __html: form.content || '<p>Start documenting the project details here...</p><p>Describe the problem, solution, architecture, and key implementation details of this project.</p>' }}
              onBlur={(e) => setForm({ ...form, content: e.currentTarget.innerHTML })}
            ></div>
          </section>

          <section className="space-y-2">
            <label className="font-mono-label text-mono-label text-secondary uppercase block">The Problem</label>
            <textarea
              className="w-full font-body-md text-body-md form-underline py-2 resize-none"
              rows={3}
              value={form.problem}
              onChange={(e) => setForm({ ...form, problem: e.target.value })}
            />
          </section>

          <section className="space-y-2">
            <label className="font-mono-label text-mono-label text-secondary uppercase block">The Solution</label>
            <textarea
              className="w-full font-body-md text-body-md form-underline py-2 resize-none"
              rows={3}
              value={form.solution}
              onChange={(e) => setForm({ ...form, solution: e.target.value })}
            />
          </section>

          <section className="space-y-2">
            <label className="font-mono-label text-mono-label text-secondary uppercase block">Architecture Flow <span className="text-secondary opacity-60">(JSON: [{'{'}name, tech{'}'}])</span></label>
            <textarea
              className="w-full font-body-md text-body-md form-underline py-2 resize-none font-mono text-sm"
              rows={4}
              placeholder='[{&quot;name&quot;:&quot;FRONTEND&quot;,&quot;tech&quot;:&quot;REACT JS&quot;},{&quot;name&quot;:&quot;API LAYER&quot;,&quot;tech&quot;:&quot;NODE JS / EXPRESS&quot;},{&quot;name&quot;:&quot;DATABASE&quot;,&quot;tech&quot;:&quot;MONGO DB&quot;}]'
              value={form.architectureFlow}
              onChange={(e) => setForm({ ...form, architectureFlow: e.target.value })}
            />
          </section>

          <section className="space-y-2">
            <label className="font-mono-label text-mono-label text-secondary uppercase block">Architecture Description</label>
            <textarea
              className="w-full font-body-md text-body-md form-underline py-2 resize-none"
              rows={3}
              placeholder="Caption or description below the flow chart..."
              value={form.architecture}
              onChange={(e) => setForm({ ...form, architecture: e.target.value })}
            />
          </section>

          <section className="space-y-2">
            <label className="font-mono-label text-mono-label text-secondary uppercase block">Key Features <span className="text-secondary opacity-60">(JSON: [{'{'}icon, title, description{'}'}])</span></label>
            <textarea
              className="w-full font-body-md text-body-md form-underline py-2 resize-none font-mono text-sm"
              rows={6}
              placeholder='[{&quot;icon&quot;:&quot;shopping_bag&quot;,&quot;title&quot;:&quot;Product Catalog&quot;,&quot;description&quot;:&quot;...&quot;}]'
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
            />
          </section>

          <section className="space-y-2">
            <label className="font-mono-label text-mono-label text-secondary uppercase block">Development Journey <span className="text-secondary opacity-60">(JSON: [{'{'}phase, title, description{'}'}])</span></label>
            <textarea
              className="w-full font-body-md text-body-md form-underline py-2 resize-none font-mono text-sm"
              rows={6}
              placeholder='[{&quot;phase&quot;:&quot;PHASE 01&quot;,&quot;title&quot;:&quot;PLANNING&quot;,&quot;description&quot;:&quot;...&quot;}]'
              value={form.journey}
              onChange={(e) => setForm({ ...form, journey: e.target.value })}
            />
          </section>

          <section className="space-y-4">
            <label className="font-mono-label text-mono-label text-secondary uppercase block">Gallery Images</label>
            <div className="grid grid-cols-3 gap-2">
              {(form.gallery || '').split('\n').filter(Boolean).map((url: string, i: number) => (
                <div key={i} className="aspect-square bg-surface-container-low border border-on-background overflow-hidden relative group">
                  <img className="w-full h-full object-cover" src={url} alt="" />
                  <button type="button" onClick={() => {
                    const arr = (form.gallery || '').split('\n').filter(Boolean);
                    arr.splice(i, 1);
                    setForm({ ...form, gallery: arr.join('\n') });
                  }} className="absolute top-1 right-1 bg-on-background text-on-primary w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="flex-1 border border-on-background bg-transparent p-3 font-mono-label text-sm"
                placeholder="Paste image URL..."
                value={''}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val) {
                    const arr = (form.gallery || '').split('\n').filter(Boolean);
                    arr.push(val);
                    setForm({ ...form, gallery: arr.join('\n') });
                    e.target.value = '';
                  }
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const input = e.target as HTMLInputElement;
                    if (input.value.trim()) {
                      const arr = (form.gallery || '').split('\n').filter(Boolean);
                      arr.push(input.value.trim());
                      setForm({ ...form, gallery: arr.join('\n') });
                      input.value = '';
                    }
                  }
                }}
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
                  if (data.url) {
                    const arr = (form.gallery || '').split('\n').filter(Boolean);
                    arr.push(data.url);
                    setForm({ ...form, gallery: arr.join('\n') });
                  }
                  e.target.value = '';
                }} />
              </label>
            </div>
          </section>

          <section className="pt-12 border-t border-secondary-fixed">
            <div className="flex items-center gap-4 mb-8">
              <span className="material-symbols-outlined">search</span>
              <h3 className="font-headline-md text-headline-md tracking-tight uppercase">SEO Meta Configuration</h3>
            </div>
            <div className="space-y-8 bg-surface-container-low p-6">
              <div className="space-y-2">
                <label className="font-mono-label text-mono-label text-secondary uppercase block">Meta Title</label>
                <input className="w-full font-body-md text-body-md form-underline py-1" placeholder="SEO optimized title..." type="text" value={form.metaTitle} onChange={(e) => setForm({ ...form, metaTitle: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="font-mono-label text-mono-label text-secondary uppercase block">Meta Description</label>
                <textarea className="w-full font-body-md text-body-md form-underline py-1 resize-none" placeholder="Brief description for search engines..." rows={2} value={form.metaDesc} onChange={(e) => setForm({ ...form, metaDesc: e.target.value })} />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-primary border-on-background focus:ring-0 rounded-none" checked={!!form.noIndex} onChange={(e) => setForm({ ...form, noIndex: e.target.checked })} />
                  <span className="font-mono-label text-mono-label uppercase">No-Index</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-primary border-on-background focus:ring-0 rounded-none" checked={!!form.canonical} onChange={(e) => setForm({ ...form, canonical: e.target.checked })} />
                  <span className="font-mono-label text-mono-label uppercase">Canonical Link</span>
                </label>
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
                <span className="font-label-caps text-label-caps px-2 py-0.5 border border-primary bg-primary text-on-primary">
                  {(form.status || 'DRAFT') as string}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => handleSave('draft')} className="w-full py-4 border border-on-background font-label-caps text-label-caps hover:bg-on-background hover:text-surface transition-all">
                  {saving ? 'SAVING...' : 'SAVE DRAFT'}
                </button>
                <button onClick={() => handleSave('publish')} className="w-full py-4 bg-on-background text-on-primary font-label-caps text-label-caps hover:bg-opacity-80 transition-all">
                  PUBLISH
                </button>
              </div>
              <button onClick={() => router.push('/admin/dashboard/projects')} className="w-full py-2 text-error font-mono-label text-[12px] uppercase text-center hover:underline">
                Discard Changes
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-secondary uppercase block">Project Specs</label>
              <div className="space-y-3">
                {[
                  { label: 'YEAR', key: 'year' },
                  { label: 'STACK', key: 'stack' },
                  { label: 'TYPE', key: 'type' },
                  { label: 'STATUS', key: 'status' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="font-mono-label text-[10px] uppercase opacity-40 block mb-1">{field.label}</label>
                    <input
                      className="w-full border border-on-background bg-surface p-3 font-body-md focus:ring-0 focus:border-primary"
                      value={(form as any)[field.key] || ''}
                      onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-secondary uppercase block">Category</label>
              <select
                className="w-full border border-on-background bg-surface p-3 font-body-md"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Select category</option>
                <option>E-Commerce</option>
                <option>Database Tool</option>
                <option>Streaming</option>
                <option>Portfolio</option>
                <option>Real-Time</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="font-label-caps text-label-caps text-secondary uppercase block">Tags (Enter to add)</label>
              <input
                className="w-full border border-on-background bg-surface p-3 font-body-md focus:ring-0 focus:border-primary"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {(form.tags || []).map((t: string) => (
                  <span key={t} className="text-[10px] font-mono-label border border-on-background px-2 py-0.5 flex items-center gap-1">
                    {t}
                    <button onClick={() => removeTag(t)} className="cursor-pointer hover:opacity-60">&times;</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between py-4 border-y border-secondary-fixed">
              <label className="font-label-caps text-label-caps uppercase">Featured Project</label>
              <button
                type="button"
                onClick={() => setForm({ ...form, featured: !form.featured })}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors relative ${form.featured ? 'bg-primary' : 'bg-surface-container-highest'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${form.featured ? 'translate-x-5' : ''}`}></div>
              </button>
            </div>

            <div className="space-y-4">
              <label className="font-label-caps text-label-caps text-secondary uppercase block">Hero Image</label>
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
                  value={form.image || ''}
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
              <span>WORD COUNT</span>
              <span>{form.problem.length + form.solution.length + form.tagline.length}</span>
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
