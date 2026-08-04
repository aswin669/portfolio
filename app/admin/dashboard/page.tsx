'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [chartDays, setChartDays] = useState(7);

  useEffect(() => {
    fetch('/api/projects').then((r) => r.json()).then((data) => setProjects(Array.isArray(data) ? data : []));
    fetch('/api/blog').then((r) => r.json()).then((data) => setBlogPosts(Array.isArray(data) ? data : []));
    fetch('/api/contact').then((r) => r.json()).then((data) => setContacts(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    fetch(`/api/analytics?days=${chartDays}`).then((r) => r.json()).then((data) => setAnalytics(data && !data.error ? data : null));
  }, [chartDays]);

  const totalProjects = projects.length;
  const published = Array.isArray(blogPosts) ? blogPosts.filter((p: any) => p.published).length : 0;
  const drafts = Array.isArray(blogPosts) ? blogPosts.filter((p: any) => !p.published).length : 0;
  const contactCount = contacts.length;

  const chartData = analytics?.daily || [];
  const maxCount = Math.max(1, ...chartData.map((d: any) => d.count));
  const pointCount = chartData.length;

  function chartPath(data: any[]) {
    if (data.length === 0) return '';
    const w = 1000, h = 300, pad = 40;
    const plotH = h - pad * 2;
    return data.map((d, i) => {
      const x = pointCount > 1 ? (i / (pointCount - 1)) * w : w / 2;
      const y = pad + plotH - (d.count / maxCount) * plotH;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');
  }

  function chartDots(data: any[]): { x: string; y: string }[] {
    if (data.length === 0) return [];
    const w = 1000, h = 300, pad = 40;
    const plotH = h - pad * 2;
    return data.map((d, i) => {
      const x = pointCount > 1 ? (i / (pointCount - 1)) * w : w / 2;
      const y = pad + plotH - (d.count / maxCount) * plotH;
      return { x: x.toFixed(1), y: y.toFixed(1) };
    }).filter((_, i) => chartData[i]?.count > 0);
  }

  const dots = chartDots(chartData);

  return (
    <>
      <section className="mb-stack-lg flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">SYSTEM_STATUS // RUNNING</p>
          <h2 className="font-display-lg text-4xl md:text-6xl font-bold tracking-tighter uppercase">Overview</h2>
        </div>
        <div className="flex gap-4">
          <a href="/admin/dashboard/projects/new" className="bg-primary text-on-primary px-8 py-4 font-label-caps text-label-caps flex items-center gap-3 hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined">add</span>
            ADD NEW PROJECT
          </a>
          <a href="/admin/dashboard/media" className="border border-primary text-primary px-8 py-4 font-label-caps text-label-caps flex items-center gap-3 hover:bg-primary hover:text-white transition-all">
            <span className="material-symbols-outlined">perm_media</span>
            MANAGE MEDIA
          </a>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
        <div className="metric-card border border-on-background p-6 flex flex-col justify-between hover:bg-on-background hover:text-white transition-all group cursor-default select-none">
          <div>
            <span className="font-mono-label text-label-caps uppercase opacity-60">Total Projects</span>
            <h3 className="text-5xl font-black mt-2">{totalProjects}</h3>
          </div>
          <div className="mt-8 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span className="font-mono-label text-[12px]">Across all categories</span>
          </div>
        </div>
        <div className="metric-card border border-on-background p-6 flex flex-col justify-between hover:bg-on-background hover:text-white transition-all group cursor-default select-none">
          <div>
            <span className="font-mono-label text-label-caps uppercase opacity-60">Published Posts</span>
            <h3 className="text-5xl font-black mt-2">{published}</h3>
          </div>
          <div className="mt-8">
            <div className="w-full bg-surface-container h-[2px]">
              <div className="bg-on-background group-hover:bg-white" style={{ width: `${blogPosts.length ? (published / blogPosts.length) * 100 : 0}%`, height: '100%' }}></div>
            </div>
            <span className="font-mono-label text-[12px] mt-2 block">Blog posts live</span>
          </div>
        </div>
        <div className="metric-card border border-on-background p-6 flex flex-col justify-between hover:bg-on-background hover:text-white transition-all group cursor-default select-none">
          <div>
            <span className="font-mono-label text-label-caps uppercase opacity-60">Drafts</span>
            <h3 className="text-5xl font-black mt-2">{String(drafts).padStart(2, '0')}</h3>
          </div>
          <div className="mt-8 flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">edit_note</span>
            <span className="font-mono-label text-[12px]">Requires review</span>
          </div>
        </div>
        <div className="metric-card border border-on-background p-6 flex flex-col justify-between hover:bg-on-background hover:text-white transition-all group cursor-default select-none">
          <div>
            <span className="font-mono-label text-label-caps uppercase opacity-60">Contact Requests</span>
            <h3 className="text-5xl font-black mt-2">{contactCount}</h3>
          </div>
          <div className="mt-8 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-on-background group-hover:bg-white"></span>
            <span className="font-mono-label text-[12px]">From contact form</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        <div className="lg:col-span-8 border border-on-background p-8 bg-surface-container-low">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h4 className="font-label-caps text-label-caps uppercase">Visitor Analytics</h4>
              <p className="font-mono-label text-xs opacity-60">
                {analytics ? `${analytics.thisWeek} visits this week · ${analytics.total} total` : 'Loading...'}
              </p>
            </div>
            <div className="flex gap-4">
              {[7, 30].map((n) => (
                <button
                  key={n}
                  onClick={() => setChartDays(n)}
                  className={`px-2 py-1 font-mono-label text-[10px] transition-all ${
                    chartDays === n
                      ? 'bg-on-background text-white'
                      : 'border border-on-background hover:bg-on-background hover:text-white'
                  }`}
                >
                  {n} DAYS
                </button>
              ))}
            </div>
          </div>
          <div className="h-64 w-full relative">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 300">
              {[50, 150, 250].map((y) => (
                <line key={y} stroke="#E5E5E5" strokeWidth="1" x1="0" x2="1000" y1={y} y2={y} />
              ))}
              {chartData.length > 0 && (
                <>
                  <path d={chartPath(chartData)} fill="none" stroke="#1a1c1c" strokeWidth="3" />
                  {dots.map((pt, i) => (
                    <rect key={i} fill="#1a1c1c" height="8" width="8" x={parseFloat(pt.x) - 4} y={parseFloat(pt.y) - 4} />
                  ))}
                </>
              )}
            </svg>
            {chartData.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 flex justify-between font-mono-label text-[10px] pt-4 uppercase opacity-40">
                {chartData.filter((_: any, i: number) => chartDays === 7 || i % Math.ceil(chartDays / 7) === 0 || i === chartData.length - 1).map((d: any, i: number, arr: any[]) => (
                  <span key={d.date}>{new Date(d.date + 'T00:00:00').toLocaleDateString('en-US', chartDays <= 7 ? { weekday: 'short' } : { month: 'short', day: 'numeric' })}</span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-4 border border-on-background p-8">
          <div className="flex items-center gap-3 mb-8">
            <span className="material-symbols-outlined">history</span>
            <h4 className="font-label-caps text-label-caps uppercase">Recent Contact Requests</h4>
          </div>
          <div className="relative pl-6">
            <div className="absolute left-1 top-2 bottom-2 w-[1px] bg-on-background"></div>
            <div className="space-y-8">
              {contacts.length === 0 && (
                <p className="font-mono-label text-xs opacity-40">No contacts yet</p>
              )}
              {contacts.slice(-4).reverse().map((item: any) => (
                <div key={item.id} className="relative">
                  <div className="absolute -left-[23px] top-1 w-2 h-2 bg-on-background"></div>
                  <p className="font-mono-label text-[12px] opacity-40 mb-1">{item.createdAt || 'Just now'}</p>
                  <p className="font-body-md text-sm font-semibold">{item.name} — {item.subject}</p>
                  <p className="font-body-md text-xs text-on-surface-variant">{item.message?.slice(0, 60)}...</p>
                </div>
              ))}
            </div>
          </div>
          <a href="/admin/dashboard/contacts" className="block w-full text-center mt-12 py-3 border border-on-background font-label-caps text-label-caps hover:bg-on-background hover:text-white transition-all">
            VIEW FULL LOGS
          </a>
        </div>
      </div>

      <section className="mt-stack-lg">
        <div className="flex items-center gap-3 mb-8">
          <span className="material-symbols-outlined">inventory</span>
          <h4 className="font-label-caps text-label-caps uppercase">Projects Overview</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {projects.slice(0, 6).map((project: any) => (
            <a key={project.id} href={`/admin/dashboard/projects/${project.slug || project.id}`} className="group block cursor-pointer">
              <div className="aspect-video border border-on-background overflow-hidden mb-4 relative">
                <img className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105" src={project.image || '/'} />
                <div className={`absolute top-4 right-4 px-3 py-1 font-mono-label text-[10px] uppercase ${project.status === 'Live' ? 'bg-primary text-on-primary' : 'border border-on-background bg-surface text-on-background'}`}>
                  {project.status || 'Draft'}
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-headline-md text-lg group-hover:underline underline-offset-4">{project.title}</h5>
                  <p className="font-mono-label text-xs opacity-60">{project.category || 'General'}</p>
                </div>
                <span className="material-symbols-outlined group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">arrow_outward</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
