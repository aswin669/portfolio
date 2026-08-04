'use client';

import { useEffect, useState } from 'react';

export default function AdminProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [filter, setFilter] = useState<'All' | 'Live' | 'Draft'>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => fetch('/api/projects').then((r) => r.json()).then(setProjects);

  useEffect(() => {
    load().then(() => setLoading(false)).catch(() => { setError('Failed to load'); setLoading(false); });
  }, []);

  const remove = async (id: number) => {
    if (!confirm('Delete this project?')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    load();
  };

  const filtered = filter === 'All' ? projects : projects.filter((p) => (p.status || 'Draft') === filter);

  if (loading) return <p className="font-mono-label text-mono-label text-secondary py-8 text-center">Loading...</p>;
  if (error) return <p className="font-mono-label text-mono-label text-error py-8 text-center">{error}</p>;

  return (
    <>
      <section className="mb-stack-lg flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">SYSTEM_INVENTORY // PROJECTS</p>
          <h2 className="font-display-lg text-4xl md:text-6xl font-bold tracking-tighter uppercase">Projects</h2>
        </div>
        <div className="flex gap-4">
          <a href="/admin/dashboard/projects/new" className="bg-primary text-on-primary px-8 py-4 font-label-caps text-label-caps flex items-center gap-3 hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined">add</span>
            NEW PROJECT
          </a>
        </div>
      </section>

      <div className="flex gap-2 mb-stack-lg">
        {(['All', 'Live', 'Draft'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 font-label-caps text-label-caps uppercase transition-all ${
              filter === f
                ? 'bg-on-background text-white'
                : 'border border-on-background text-on-background hover:bg-on-background hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="border border-on-background">
        <div className="grid grid-cols-12 gap-0">
          <div className="col-span-4 p-4 font-label-caps text-label-caps uppercase border-b border-r border-on-background bg-surface-container-low">Project</div>
          <div className="col-span-2 p-4 font-label-caps text-label-caps uppercase border-b border-r border-on-background bg-surface-container-low">Category</div>
          <div className="col-span-3 p-4 font-label-caps text-label-caps uppercase border-b border-r border-on-background bg-surface-container-low">Tech Stack</div>
          <div className="col-span-1 p-4 font-label-caps text-label-caps uppercase border-b border-r border-on-background bg-surface-container-low">Status</div>
          <div className="col-span-2 p-4 font-label-caps text-label-caps uppercase border-b border-on-background bg-surface-container-low">Actions</div>

          {filtered.map((project) => (
            <div key={project.id} className="contents group">
              <div className="col-span-4 p-4 border-b border-r border-on-background flex items-center gap-3 group-hover:bg-surface-container-low transition-colors">
                <span className="font-mono-label text-mono-label">{project.name}</span>
              </div>
              <div className="col-span-2 p-4 border-b border-r border-on-background flex items-center font-body-md text-body-md">{project.category || '-'}</div>
              <div className="col-span-3 p-4 border-b border-r border-on-background flex items-center">
                <span className="font-mono-label text-[11px] opacity-60">{project.stack || '-'}</span>
              </div>
              <div className="col-span-1 p-4 border-b border-r border-on-background flex items-center">
                <span className={`px-3 py-1 font-mono-label text-[10px] uppercase ${(project.status || 'Draft') === 'Live' ? 'bg-primary text-on-primary' : 'border border-on-background'}`}>
                  {project.status || 'Draft'}
                </span>
              </div>
              <div className="col-span-2 p-4 border-b border-on-background flex items-center gap-3">
                <a href={`/admin/dashboard/projects/${project.slug || project.id}`} className="font-mono-label text-[11px] uppercase hover:underline">Edit</a>
                <button onClick={() => remove(project.id)} className="font-mono-label text-[11px] uppercase text-error hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="font-mono-label text-[12px] opacity-40">
          Showing {filtered.length} of {projects.length} projects
        </p>
      </div>
    </>
  );
}
