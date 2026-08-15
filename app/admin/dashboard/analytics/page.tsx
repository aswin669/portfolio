'use client';

import { useEffect, useState, useCallback } from 'react';

export default function AdminAnalytics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [days, setDays] = useState(7);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'visitors' | 'location' | 'tech' | 'pages'>('overview');
  const [selectedVisitor, setSelectedVisitor] = useState<any | null>(null);

  const fetchAnalytics = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({
      days: String(days),
      page: String(page),
      limit: '15',
      search: search.trim(),
    });

    fetch(`/api/analytics?${params.toString()}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData && !resData.error) {
          setData(resData);
          setError('');
        } else {
          setError(resData.error || 'Failed to load analytics');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Network error fetching analytics');
        setLoading(false);
      });
  }, [days, page, search]);

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 10000); // Live poll every 10s
    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  const handleExportCSV = () => {
    window.open('/api/analytics/export', '_blank');
  };

  const maxDailyCount = Math.max(...(data?.daily?.map((d: any) => d.count) || [1]), 1);

  return (
    <>
      {/* Page Header */}
      <section className="mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-on-background pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-label-caps text-label-caps text-on-surface-variant">TRAFFIC // ANALYTICS</span>
            {data?.liveVisitors !== undefined && (
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 px-3 py-0.5 rounded-full font-mono-label text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{data.liveVisitors} LIVE NOW</span>
              </div>
            )}
          </div>
          <h2 className="font-display-lg text-4xl md:text-6xl font-bold tracking-tighter uppercase">Website Analytics</h2>
        </div>

        {/* Date Range & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex border border-on-background bg-surface-container">
            {[7, 30, 90, 365].map((d) => (
              <button
                key={d}
                onClick={() => { setDays(d); setPage(1); }}
                className={`px-4 py-2 font-mono-label text-xs uppercase transition-colors ${
                  days === d ? 'bg-primary text-on-primary font-bold' : 'hover:bg-surface-container-high'
                }`}
              >
                {d === 365 ? 'ALL TIME' : `${d}D`}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="border border-on-background bg-primary text-on-primary px-5 py-2.5 font-label-caps text-label-caps flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            EXPORT CSV
          </button>
        </div>
      </section>

      {/* KPI Overview Cards */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="border border-on-background p-4 bg-surface-container-low">
          <span className="font-mono-label text-[10px] uppercase text-secondary block mb-1">TOTAL VISITORS</span>
          <p className="font-display-lg text-2xl md:text-3xl font-bold">{data?.totalVisitors ?? '—'}</p>
          <span className="font-mono-label text-[10px] text-secondary mt-1 block">{data?.totalSessions ?? 0} sessions</span>
        </div>

        <div className="border border-on-background p-4 bg-surface-container-low">
          <span className="font-mono-label text-[10px] uppercase text-secondary block mb-1">PAGE VIEWS</span>
          <p className="font-display-lg text-2xl md:text-3xl font-bold">{data?.total ?? '—'}</p>
          <span className="font-mono-label text-[10px] text-secondary mt-1 block">{data?.today ?? 0} views today</span>
        </div>

        <div className="border border-on-background p-4 bg-surface-container-low">
          <span className="font-mono-label text-[10px] uppercase text-secondary block mb-1">ACTIVE NOW</span>
          <div className="flex items-center gap-2">
            <p className="font-display-lg text-2xl md:text-3xl font-bold text-emerald-500">{data?.liveVisitors ?? 0}</p>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <span className="font-mono-label text-[10px] text-secondary mt-1 block">In last 5 mins</span>
        </div>

        <div className="border border-on-background p-4 bg-surface-container-low">
          <span className="font-mono-label text-[10px] uppercase text-secondary block mb-1">THIS WEEK / MONTH</span>
          <p className="font-display-lg text-xl md:text-2xl font-bold">{data?.thisWeek ?? 0} / {data?.thisMonth ?? 0}</p>
          <span className="font-mono-label text-[10px] text-secondary mt-1 block">Traffic volume</span>
        </div>

        <div className="border border-on-background p-4 bg-surface-container-low">
          <span className="font-mono-label text-[10px] uppercase text-secondary block mb-1">AVG DURATION</span>
          <p className="font-display-lg text-2xl md:text-3xl font-bold">{data?.avgDuration ? `${data.avgDuration}s` : '0s'}</p>
          <span className="font-mono-label text-[10px] text-secondary mt-1 block">Time per session</span>
        </div>

        <div className="border border-on-background p-4 bg-surface-container-low">
          <span className="font-mono-label text-[10px] uppercase text-secondary block mb-1">NEW VS RETURNING</span>
          <p className="font-display-lg text-xl md:text-2xl font-bold">
            {data?.newVsReturning?.new ?? 0} / {data?.newVsReturning?.returning ?? 0}
          </p>
          <span className="font-mono-label text-[10px] text-secondary mt-1 block">New vs Return</span>
        </div>
      </section>

      {/* Analytics Tabs Navigation */}
      <section className="mb-6 border-b border-on-background/20 flex gap-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: 'Overview & Trends', icon: 'insights' },
          { id: 'visitors', label: 'Visitor Logs', icon: 'groups' },
          { id: 'location', label: 'Geographic Location', icon: 'public' },
          { id: 'tech', label: 'Devices & Tech', icon: 'devices' },
          { id: 'pages', label: 'Pages & Referrers', icon: 'table_chart' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-3 font-mono-label text-xs uppercase border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-primary text-primary font-bold bg-surface-container-low'
                : 'border-transparent text-secondary hover:text-on-background hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </section>

      {/* Search & Filter Toolbar */}
      <section className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-low p-4 border border-on-background">
        <div className="relative w-full md:w-96 flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-secondary text-[18px]">search</span>
          <input
            type="text"
            placeholder="Search path, visitor ID, location, browser..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-surface border border-on-background pl-10 pr-4 py-2 font-mono-label text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-4 font-mono-label text-xs uppercase text-secondary">
          <span>Showing {data?.pagination?.total ?? 0} visitor records</span>
          {loading && <span className="material-symbols-outlined text-primary animate-spin text-[16px]">sync</span>}
        </div>
      </section>

      {/* TAB 1: OVERVIEW & TRENDS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Traffic Trend Chart */}
          <div className="border border-on-background p-6 bg-surface-container-low">
            <div className="flex justify-between items-center mb-6 border-b border-on-background/10 pb-3">
              <div>
                <h3 className="font-label-caps text-label-caps uppercase">Traffic Trend ({days} Days)</h3>
                <p className="font-mono-label text-[11px] text-secondary">Daily page views and unique visitor volume</p>
              </div>
              <span className="font-mono-label text-xs text-primary font-bold">{data?.total ?? 0} TOTAL VIEWS</span>
            </div>

            {/* Bar Chart Container */}
            <div className="h-64 flex items-end gap-2 pt-6 pb-2 border-b border-on-background/20 px-2 overflow-x-auto">
              {data?.daily?.map((d: any, idx: number) => {
                const heightPct = Math.max(Math.round((d.count / maxDailyCount) * 100), 4);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group min-w-[24px]">
                    <div className="w-full bg-primary/20 hover:bg-primary transition-all relative flex flex-col justify-end rounded-xs overflow-hidden" style={{ height: `${heightPct}%` }}>
                      <div className="w-full bg-primary h-1/2 opacity-80"></div>
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white font-mono-label text-[10px] p-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none border border-white/20 shadow-xl">
                        <p className="font-bold">{d.date}</p>
                        <p>{d.count} views ({d.visitors} visitors)</p>
                      </div>
                    </div>
                    <span className="font-mono-label text-[9px] text-secondary truncate max-w-full">
                      {d.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Visited Pages */}
            <div className="border border-on-background p-6 bg-surface-container-low">
              <h3 className="font-label-caps text-label-caps uppercase mb-4 pb-2 border-b border-on-background/10 flex justify-between">
                <span>Top Visited Pages</span>
                <span className="text-secondary font-normal font-mono-label text-xs">VIEWS</span>
              </h3>
              <ul className="space-y-3">
                {data?.topPages?.map((p: any, idx: number) => (
                  <li key={idx} className="flex justify-between items-center font-mono-label text-xs border-b border-on-background/5 pb-2">
                    <span className="truncate max-w-[80%] hover:text-primary transition-colors">{p.path}</span>
                    <span className="font-bold bg-surface px-2 py-0.5 border border-on-background/20">{p.count}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Top Traffic Sources */}
            <div className="border border-on-background p-6 bg-surface-container-low">
              <h3 className="font-label-caps text-label-caps uppercase mb-4 pb-2 border-b border-on-background/10 flex justify-between">
                <span>Top Referrers / Traffic Sources</span>
                <span className="text-secondary font-normal font-mono-label text-xs">VISITS</span>
              </h3>
              <ul className="space-y-3">
                {data?.topReferrers?.map((r: any, idx: number) => (
                  <li key={idx} className="flex justify-between items-center font-mono-label text-xs border-b border-on-background/5 pb-2">
                    <span className="truncate max-w-[80%] hover:text-primary transition-colors">{r.referrer}</span>
                    <span className="font-bold bg-surface px-2 py-0.5 border border-on-background/20">{r.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VISITORS LOG TABLE */}
      {activeTab === 'visitors' && (
        <div className="border border-on-background bg-surface-container-low overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-on-background bg-surface font-mono-label text-xs uppercase text-secondary">
                  <th className="p-4">Visitor ID</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Path</th>
                  <th className="p-4">Device & OS</th>
                  <th className="p-4">Browser</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Date / Time</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-on-background/10 font-mono-label text-xs">
                {data?.logs?.map((log: any) => (
                  <tr key={log.id} className="hover:bg-surface-container transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-primary">{log.visitorId}</span>
                      <span className="block text-[10px] text-secondary opacity-60">{log.sessionId}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold">{log.country}</span>
                      <span className="block text-[10px] text-secondary">{log.city ? `${log.city}, ${log.region}` : log.region}</span>
                    </td>
                    <td className="p-4 font-mono font-semibold max-w-[200px] truncate" title={log.path}>
                      {log.path}
                    </td>
                    <td className="p-4">
                      <span className="capitalize">{log.deviceType}</span>
                      <span className="block text-[10px] text-secondary">{log.os}</span>
                    </td>
                    <td className="p-4">
                      {log.browser}
                      <span className="block text-[10px] text-secondary">{log.screenRes}</span>
                    </td>
                    <td className="p-4">{log.durationSeconds}s</td>
                    <td className="p-4 text-[11px] text-secondary">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedVisitor(log)}
                        className="bg-primary text-on-primary px-3 py-1 font-label-caps text-[10px] hover:opacity-80 transition-opacity"
                      >
                        INSPECT
                      </button>
                    </td>
                  </tr>
                ))}
                {(!data?.logs || data.logs.length === 0) && (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-secondary font-mono-label">
                      No visitor records found matching query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="p-4 border-t border-on-background flex justify-between items-center font-mono-label text-xs">
            <span className="text-secondary">
              Page {data?.pagination?.page} of {data?.pagination?.totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="border border-on-background px-4 py-1.5 disabled:opacity-30 hover:bg-surface-container"
              >
                PREV
              </button>
              <button
                disabled={page >= (data?.pagination?.totalPages || 1)}
                onClick={() => setPage((p) => p + 1)}
                className="border border-on-background px-4 py-1.5 disabled:opacity-30 hover:bg-surface-container"
              >
                NEXT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LOCATION ANALYTICS */}
      {activeTab === 'location' && (
        <div className="space-y-6">
          <div className="border border-on-background p-6 bg-surface-container-low">
            <h3 className="font-label-caps text-label-caps uppercase mb-4 pb-2 border-b border-on-background/10">Geographic Visitor Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.locations?.map((loc: any, idx: number) => (
                <div key={idx} className="border border-on-background/20 p-4 bg-surface flex justify-between items-center">
                  <div>
                    <p className="font-mono-label text-sm font-bold">{loc.country}</p>
                    <p className="font-mono-label text-[10px] text-secondary">{loc.city ? `${loc.city}, ${loc.region}` : loc.region}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-display-lg text-lg font-bold text-primary">{loc.count}</span>
                    <span className="block font-mono-label text-[10px] text-secondary">VISITS</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DEVICES & TECH */}
      {activeTab === 'tech' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Device Type */}
          <div className="border border-on-background p-6 bg-surface-container-low">
            <h3 className="font-label-caps text-label-caps uppercase mb-4 pb-2 border-b border-on-background/10">Device Types</h3>
            <ul className="space-y-3">
              {data?.devices?.map((d: any, idx: number) => (
                <li key={idx} className="flex justify-between items-center font-mono-label text-xs border-b border-on-background/5 pb-2">
                  <span>{d.type}</span>
                  <span className="font-bold bg-surface px-2 py-0.5 border border-on-background/20">{d.count}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Operating Systems */}
          <div className="border border-on-background p-6 bg-surface-container-low">
            <h3 className="font-label-caps text-label-caps uppercase mb-4 pb-2 border-b border-on-background/10">Operating Systems</h3>
            <ul className="space-y-3">
              {data?.operatingSystems?.map((os: any, idx: number) => (
                <li key={idx} className="flex justify-between items-center font-mono-label text-xs border-b border-on-background/5 pb-2">
                  <span>{os.name}</span>
                  <span className="font-bold bg-surface px-2 py-0.5 border border-on-background/20">{os.count}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Browsers */}
          <div className="border border-on-background p-6 bg-surface-container-low">
            <h3 className="font-label-caps text-label-caps uppercase mb-4 pb-2 border-b border-on-background/10">Browsers</h3>
            <ul className="space-y-3">
              {data?.browsers?.map((b: any, idx: number) => (
                <li key={idx} className="flex justify-between items-center font-mono-label text-xs border-b border-on-background/5 pb-2">
                  <span>{b.name}</span>
                  <span className="font-bold bg-surface px-2 py-0.5 border border-on-background/20">{b.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* TAB 5: PAGES & REFERRERS */}
      {activeTab === 'pages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-on-background p-6 bg-surface-container-low">
            <h3 className="font-label-caps text-label-caps uppercase mb-4 pb-2 border-b border-on-background/10">Page Popularity Ranking</h3>
            <ul className="space-y-3">
              {data?.topPages?.map((p: any, idx: number) => (
                <li key={idx} className="flex justify-between items-center font-mono-label text-xs border-b border-on-background/5 pb-2">
                  <span className="font-mono text-primary truncate max-w-[80%]">{p.path}</span>
                  <span className="font-bold bg-surface px-2 py-0.5 border border-on-background/20">{p.count} views</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-on-background p-6 bg-surface-container-low">
            <h3 className="font-label-caps text-label-caps uppercase mb-4 pb-2 border-b border-on-background/10">Inbound Traffic Referrers</h3>
            <ul className="space-y-3">
              {data?.topReferrers?.map((r: any, idx: number) => (
                <li key={idx} className="flex justify-between items-center font-mono-label text-xs border-b border-on-background/5 pb-2">
                  <span className="truncate max-w-[80%]">{r.referrer}</span>
                  <span className="font-bold bg-surface px-2 py-0.5 border border-on-background/20">{r.count} visits</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* VISITOR INSPECTION MODAL */}
      {selectedVisitor && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-on-background max-w-2xl w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-on-background pb-3">
              <div>
                <span className="font-mono-label text-[10px] text-secondary uppercase">VISITOR INSPECTOR</span>
                <h3 className="font-headline-md text-xl font-bold uppercase">{selectedVisitor.visitorId}</h3>
              </div>
              <button
                onClick={() => setSelectedVisitor(null)}
                className="material-symbols-outlined hover:text-primary text-2xl"
              >
                close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 font-mono-label text-xs">
              <div className="bg-surface-container-low p-3 border border-on-background/10">
                <span className="text-[10px] text-secondary uppercase block mb-1">Session ID</span>
                <p className="font-bold">{selectedVisitor.sessionId}</p>
              </div>
              <div className="bg-surface-container-low p-3 border border-on-background/10">
                <span className="text-[10px] text-secondary uppercase block mb-1">Visit Time</span>
                <p className="font-bold">{new Date(selectedVisitor.timestamp).toLocaleString()}</p>
              </div>
              <div className="bg-surface-container-low p-3 border border-on-background/10">
                <span className="text-[10px] text-secondary uppercase block mb-1">Current Path</span>
                <p className="font-bold text-primary">{selectedVisitor.path}</p>
              </div>
              <div className="bg-surface-container-low p-3 border border-on-background/10">
                <span className="text-[10px] text-secondary uppercase block mb-1">Session Duration</span>
                <p className="font-bold">{selectedVisitor.durationSeconds} seconds</p>
              </div>
              <div className="bg-surface-container-low p-3 border border-on-background/10">
                <span className="text-[10px] text-secondary uppercase block mb-1">Location</span>
                <p className="font-bold">{selectedVisitor.country} ({selectedVisitor.city || selectedVisitor.region})</p>
              </div>
              <div className="bg-surface-container-low p-3 border border-on-background/10">
                <span className="text-[10px] text-secondary uppercase block mb-1">Anonymized IP</span>
                <p className="font-bold">{selectedVisitor.ip}</p>
              </div>
              <div className="bg-surface-container-low p-3 border border-on-background/10">
                <span className="text-[10px] text-secondary uppercase block mb-1">Device & OS</span>
                <p className="font-bold">{selectedVisitor.deviceType} — {selectedVisitor.os}</p>
              </div>
              <div className="bg-surface-container-low p-3 border border-on-background/10">
                <span className="text-[10px] text-secondary uppercase block mb-1">Browser & Screen</span>
                <p className="font-bold">{selectedVisitor.browser} ({selectedVisitor.screenRes})</p>
              </div>
            </div>

            <div className="bg-surface-container-low p-4 border border-on-background/10 font-mono-label text-xs">
              <span className="text-[10px] text-secondary uppercase block mb-1">Referrer URL</span>
              <p className="truncate font-semibold">{selectedVisitor.referrer}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedVisitor(null)}
                className="bg-primary text-on-primary px-6 py-2 font-label-caps text-label-caps hover:opacity-80"
              >
                CLOSE INSPECTOR
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
