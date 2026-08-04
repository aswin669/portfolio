'use client';

import { useEffect, useState, useCallback } from 'react';

const LOG_TYPES = [
  { value: '', label: 'All' },
  { value: 'auth', label: 'Authentication' },
  { value: 'user', label: 'User Activity' },
  { value: 'admin', label: 'Admin Activity' },
  { value: 'api', label: 'API Requests' },
  { value: 'database', label: 'Database' },
  { value: 'email', label: 'Email' },
  { value: 'file_upload', label: 'File Upload' },
  { value: 'security', label: 'Security' },
  { value: 'server', label: 'Server' },
];

const SEVERITIES = ['', 'success', 'info', 'warning', 'error', 'critical', 'debug'];

const DATE_PRESETS = [
  { label: 'All', value: '' },
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last Month', value: '30d' },
];

function severityColor(s: string) {
  switch (s) {
    case 'success': return 'bg-green-900 text-green-300 border-green-700';
    case 'warning': return 'bg-yellow-900 text-yellow-300 border-yellow-700';
    case 'error': return 'bg-red-900 text-red-300 border-red-700';
    case 'critical': return 'bg-red-950 text-red-200 border-red-600';
    case 'debug': return 'bg-gray-800 text-gray-400 border-gray-600';
    default: return 'bg-blue-900 text-blue-300 border-blue-700';
  }
}

function typeColor(t: string) {
  switch (t) {
    case 'auth': return 'border-purple-700 text-purple-300';
    case 'user': return 'border-cyan-700 text-cyan-300';
    case 'admin': return 'border-orange-700 text-orange-300';
    case 'api': return 'border-blue-700 text-blue-300';
    case 'database': return 'border-green-700 text-green-300';
    case 'email': return 'border-pink-700 text-pink-300';
    case 'file_upload': return 'border-indigo-700 text-indigo-300';
    case 'security': return 'border-red-700 text-red-300';
    case 'server': return 'border-gray-600 text-gray-300';
    default: return 'border-gray-600 text-gray-300';
  }
}

export default function AdminLogs() {
  const [entries, setEntries] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [type, setType] = useState('');
  const [severity, setSeverity] = useState('');
  const [search, setSearch] = useState('');
  const [datePreset, setDatePreset] = useState('');
  const [customFrom, setCustomFrom] = useState('');
  const [customTo, setCustomTo] = useState('');
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (type) params.set('type', type);
      if (severity) params.set('severity', severity);
      if (search) params.set('search', search);
      if (datePreset === 'today') {
        const d = new Date().toISOString().slice(0, 10);
        params.set('dateFrom', d);
        params.set('dateTo', d + 'T23:59:59');
      } else if (datePreset === 'yesterday') {
        const d = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        params.set('dateFrom', d);
        params.set('dateTo', d + 'T23:59:59');
      } else if (datePreset === '7d') {
        const d = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
        params.set('dateFrom', d);
      } else if (datePreset === '30d') {
        const d = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
        params.set('dateFrom', d);
      }
      if (customFrom) params.set('dateFrom', customFrom);
      if (customTo) params.set('dateTo', customTo + 'T23:59:59');
      params.set('page', String(page));
      params.set('limit', '50');

      const [logsRes, summaryRes] = await Promise.all([
        fetch(`/api/logs?${params}`),
        fetch('/api/logs?summary=true'),
      ]);
      const logsData = await logsRes.json();
      const summaryData = await summaryRes.json();
      setEntries(logsData.entries || []);
      setTotal(logsData.total || 0);
      setPages(logsData.pages || 1);
      setSummary(summaryData);
    } catch {
      setError('Failed to load logs');
    } finally {
      setLoading(false);
    }
  }, [type, severity, search, datePreset, customFrom, customTo, page]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  function handleReset() {
    setType('');
    setSeverity('');
    setSearch('');
    setDatePreset('');
    setCustomFrom('');
    setCustomTo('');
    setPage(1);
  }

  function exportCSV() {
    const headers = ['ID', 'Timestamp', 'Type', 'Severity', 'Action', 'Message', 'User', 'Email', 'Endpoint', 'Method', 'Status', 'Response Time (ms)'];
    const rows = entries.map((e: any) => [
      e.id, e.createdAt, e.type, e.severity, e.action,
      (e.message || '').replace(/"/g, '""'),
      e.userInfo, e.email, e.endpoint, e.method, e.statusCode, e.responseTime,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const cards = summary ? [
    { label: 'Total Logs', value: summary.total, color: 'text-blue-300' },
    { label: 'Errors Today', value: summary.errorsToday, color: 'text-red-300' },
    { label: 'Warnings', value: summary.warnings, color: 'text-yellow-300' },
    { label: 'Failed Requests', value: summary.failedRequests, color: 'text-red-400' },
    { label: 'API Requests', value: summary.apiRequests, color: 'text-blue-300' },
    { label: 'Database Errors', value: summary.databaseErrors, color: 'text-red-300' },
    { label: 'Security Events', value: summary.securityEvents, color: 'text-orange-300' },
  ] : [];

  return (
    <>
      <section className="mb-stack-lg flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">MONITORING // LOGS</p>
          <h2 className="font-display-lg text-4xl md:text-6xl font-bold tracking-tighter uppercase">System Logs</h2>
        </div>
        <button onClick={exportCSV} className="font-mono-label text-[12px] border border-on-background px-4 py-2 hover:bg-on-background hover:text-background transition-colors">
          EXPORT CSV
        </button>
      </section>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-stack-lg">
          {cards.map((c) => (
            <div key={c.label} className="border border-on-background p-4">
              <p className="font-mono-label text-[11px] text-secondary uppercase tracking-wider">{c.label}</p>
              <p className={`font-display-lg text-2xl font-bold mt-1 ${c.color}`}>{c.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="border border-on-background p-4 mb-stack-lg">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Type filter */}
          <div className="flex-1 min-w-[140px]">
            <label className="font-mono-label text-[11px] text-secondary uppercase tracking-wider block mb-1">Category</label>
            <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="w-full bg-background border border-on-background px-3 py-2 font-mono-label text-sm">
              {LOG_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          {/* Severity filter */}
          <div className="flex-1 min-w-[120px]">
            <label className="font-mono-label text-[11px] text-secondary uppercase tracking-wider block mb-1">Severity</label>
            <select value={severity} onChange={(e) => { setSeverity(e.target.value); setPage(1); }} className="w-full bg-background border border-on-background px-3 py-2 font-mono-label text-sm">
              {SEVERITIES.map((s) => <option key={s} value={s}>{s || 'All'}</option>)}
            </select>
          </div>

          {/* Date preset */}
          <div className="flex-1 min-w-[120px]">
            <label className="font-mono-label text-[11px] text-secondary uppercase tracking-wider block mb-1">Date Range</label>
            <select value={datePreset} onChange={(e) => { setDatePreset(e.target.value); setPage(1); setCustomFrom(''); setCustomTo(''); }} className="w-full bg-background border border-on-background px-3 py-2 font-mono-label text-sm">
              {DATE_PRESETS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>

          {/* Custom date */}
          <div className="flex-1 min-w-[130px]">
            <label className="font-mono-label text-[11px] text-secondary uppercase tracking-wider block mb-1">Custom From</label>
            <input type="date" value={customFrom} onChange={(e) => { setCustomFrom(e.target.value); setDatePreset(''); setPage(1); }} className="w-full bg-background border border-on-background px-3 py-2 font-mono-label text-sm" />
          </div>
          <div className="flex-1 min-w-[130px]">
            <label className="font-mono-label text-[11px] text-secondary uppercase tracking-wider block mb-1">Custom To</label>
            <input type="date" value={customTo} onChange={(e) => { setCustomTo(e.target.value); setDatePreset(''); setPage(1); }} className="w-full bg-background border border-on-background px-3 py-2 font-mono-label text-sm" />
          </div>

          {/* Search */}
          <div className="flex-[2] min-w-[200px]">
            <label className="font-mono-label text-[11px] text-secondary uppercase tracking-wider block mb-1">Search</label>
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search action, user, email, IP..." className="w-full bg-background border border-on-background px-3 py-2 font-mono-label text-sm" />
          </div>

          <button onClick={handleReset} className="font-mono-label text-[12px] border border-on-background px-4 py-2 hover:bg-on-background hover:text-background transition-colors">
            RESET
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p className="font-mono-label text-mono-label text-secondary py-8 text-center">Loading...</p>
      ) : error ? (
        <p className="font-mono-label text-mono-label text-error py-8 text-center">{error}</p>
      ) : (
        <>
          <div className="border border-on-background overflow-hidden">
            <table className="w-full font-mono-label text-sm">
              <thead>
                <tr className="border-b border-on-background bg-surface-container sticky top-0">
                  <th className="text-left p-3 font-label-caps text-label-caps uppercase text-secondary">Timestamp</th>
                  <th className="text-left p-3 font-label-caps text-label-caps uppercase text-secondary">ID</th>
                  <th className="text-left p-3 font-label-caps text-label-caps uppercase text-secondary">Type</th>
                  <th className="text-left p-3 font-label-caps text-label-caps uppercase text-secondary">Severity</th>
                  <th className="text-left p-3 font-label-caps text-label-caps uppercase text-secondary">Action</th>
                  <th className="text-left p-3 font-label-caps text-label-caps uppercase text-secondary">Message</th>
                  <th className="text-left p-3 font-label-caps text-label-caps uppercase text-secondary">User</th>
                  <th className="text-left p-3 font-label-caps text-label-caps uppercase text-secondary">Endpoint</th>
                  <th className="text-right p-3 font-label-caps text-label-caps uppercase text-secondary">Status</th>
                  <th className="text-right p-3 font-label-caps text-label-caps uppercase text-secondary">Time</th>
                  <th className="text-center p-3 font-label-caps text-label-caps uppercase text-secondary"></th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e: any) => (
                  <tr key={e.id} className="border-b border-on-background/10 hover:bg-surface-container-low transition-colors">
                    <td className="p-3 font-mono-label text-[11px] text-secondary whitespace-nowrap">
                      {new Date(e.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 font-mono-label text-[11px] text-secondary">#{e.id}</td>
                    <td className="p-3">
                      <span className={`inline-block border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${typeColor(e.type)}`}>
                        {e.type}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-block border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${severityColor(e.severity)}`}>
                        {e.severity}
                      </span>
                    </td>
                    <td className="p-3 font-mono-label text-sm max-w-[160px] truncate" title={e.action}>{e.action}</td>
                    <td className="p-3 font-mono-label text-sm max-w-[200px] truncate text-secondary" title={e.message}>{e.message || '-'}</td>
                    <td className="p-3 font-mono-label text-[12px] text-secondary max-w-[120px] truncate" title={e.userInfo || e.email || ''}>{e.userInfo || e.email || '-'}</td>
                    <td className="p-3 font-mono-label text-[11px] text-secondary max-w-[140px] truncate" title={e.endpoint}>{e.endpoint || '-'}</td>
                    <td className="p-3 text-right font-mono-label text-sm">{e.statusCode || '-'}</td>
                    <td className="p-3 text-right font-mono-label text-[12px] text-secondary">
                      {e.responseTime ? `${e.responseTime}ms` : '-'}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setExpanded(expanded === e.id ? null : e.id)}
                        className="font-mono-label text-[11px] text-secondary hover:text-on-background"
                      >
                        {expanded === e.id ? '▲' : '▼'}
                      </button>
                    </td>
                  </tr>
                ))}
                {expanded !== null && entries.find((e: any) => e.id === expanded) && (
                  <tr key={`exp-${expanded}`}>
                    <td colSpan={11} className="p-0">
                      <ExpandedRow entry={entries.find((e: any) => e.id === expanded)} />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {entries.length === 0 && (
              <p className="font-mono-label text-mono-label text-secondary text-center py-8">No logs match your filters</p>
            )}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-between items-center mt-4 font-mono-label text-sm">
              <span className="text-secondary">{total} total entries</span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="border border-on-background px-3 py-1 disabled:opacity-30 hover:bg-on-background hover:text-background transition-colors"
                >
                  PREV
                </button>
                <span className="px-3 py-1 text-secondary">
                  {page} / {pages}
                </span>
                <button
                  disabled={page >= pages}
                  onClick={() => setPage(page + 1)}
                  className="border border-on-background px-3 py-1 disabled:opacity-30 hover:bg-on-background hover:text-background transition-colors"
                >
                  NEXT
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

function ExpandedRow({ entry }: { entry: any }) {
  if (!entry) return null;
  return (
    <div className="border-t border-on-background/20 bg-surface-container-low p-6 grid grid-cols-1 md:grid-cols-3 gap-6 font-mono-label text-sm">
      <div>
        <p className="font-label-caps text-label-caps uppercase text-secondary mb-3 border-b border-on-background/20 pb-1">General</p>
        <div className="space-y-2">
          <div><span className="text-secondary text-[11px] uppercase tracking-wider">Message: </span><span>{entry.message || '-'}</span></div>
          <div><span className="text-secondary text-[11px] uppercase tracking-wider">Action: </span><span>{entry.action}</span></div>
          {entry.details && typeof entry.details === 'object' && Object.keys(entry.details).length > 0 && (
            <div>
              <span className="text-secondary text-[11px] uppercase tracking-wider">Details: </span>
              <pre className="mt-1 text-[11px] bg-background border border-on-background/20 p-2 overflow-x-auto">{JSON.stringify(entry.details, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
      <div>
        <p className="font-label-caps text-label-caps uppercase text-secondary mb-3 border-b border-on-background/20 pb-1">Request</p>
        <div className="space-y-2">
          <div><span className="text-secondary text-[11px] uppercase tracking-wider">Endpoint: </span><span>{entry.endpoint || '-'}</span></div>
          <div><span className="text-secondary text-[11px] uppercase tracking-wider">Method: </span><span className="font-bold">{entry.method || '-'}</span></div>
          <div><span className="text-secondary text-[11px] uppercase tracking-wider">Status: </span><span>{entry.statusCode || '-'}</span></div>
          <div><span className="text-secondary text-[11px] uppercase tracking-wider">Response Time: </span><span>{entry.responseTime ? `${entry.responseTime}ms` : '-'}</span></div>
        </div>
      </div>
      <div>
        <p className="font-label-caps text-label-caps uppercase text-secondary mb-3 border-b border-on-background/20 pb-1">User</p>
        <div className="space-y-2">
          <div><span className="text-secondary text-[11px] uppercase tracking-wider">User Info: </span><span>{entry.userInfo || '-'}</span></div>
          <div><span className="text-secondary text-[11px] uppercase tracking-wider">Email: </span><span>{entry.email || '-'}</span></div>
          <div><span className="text-secondary text-[11px] uppercase tracking-wider">IP: </span><span>{entry.ipAddress || '-'}</span></div>
          <div><span className="text-secondary text-[11px] uppercase tracking-wider">Request ID: </span><span className="text-[11px]">{entry.requestId || '-'}</span></div>
        </div>
      </div>
    </div>
  );
}
