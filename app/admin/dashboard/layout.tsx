'use client';

import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/admin/dashboard/analytics', icon: 'analytics', label: 'Analytics' },
  { href: '/admin/dashboard/projects', icon: 'inventory_2', label: 'Projects' },
  { href: '/admin/dashboard/blog', icon: 'article', label: 'Blog' },
  { href: '/admin/dashboard/technologies', icon: 'code', label: 'Technologies' },
  { href: '/admin/dashboard/categories', icon: 'folder_open', label: 'Categories' },
  { href: '/admin/dashboard/media', icon: 'photo_library', label: 'Media' },
  { href: '/admin/dashboard/testimonials', icon: 'format_quote', label: 'Testimonials' },
  { href: '/admin/dashboard/experience', icon: 'work_history', label: 'Experience' },
  { href: '/admin/dashboard/contacts', icon: 'mail', label: 'Contacts' },
  { href: '/admin/dashboard/settings', icon: 'settings', label: 'Settings' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && search.trim()) {
      const match = navItems.find((i) =>
        i.label.toLowerCase().includes(search.toLowerCase())
      );
      if (match) router.push(match.href);
    }
  };

  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('admin_dark') === 'true';
    setDark(saved);
    document.documentElement.classList.toggle('dark', saved);
  }, []);

  const toggleDark = () => {
    const next = !document.documentElement.classList.contains('dark');
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('admin_dark', String(next));
  };

  return (
    <div className="min-h-screen bg-surface text-on-background font-body-md overflow-x-hidden">
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-on-background bg-surface flex flex-col z-50">
        <div className="p-gutter">
          <h1 className="font-headline-md text-headline-md font-bold tracking-tighter text-on-background">ASWIN_S</h1>
          <p className="font-mono-label text-mono-label uppercase text-on-surface-variant opacity-60">System Admin</p>
        </div>
        <nav className="flex-grow mt-10">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-6 py-4 transition-colors group ${
                  isActive
                    ? 'bg-primary text-on-primary'
                    : 'text-on-background hover:bg-surface-container'
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span className="font-mono-label text-mono-label uppercase">{item.label}</span>
              </a>
            );
          })}
        </nav>
        <div className="p-6 border-t border-on-background">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-on-background"></div>
            <div>
              <p className="font-label-caps text-label-caps">Admin User</p>
              <p className="text-[10px] uppercase font-bold text-on-surface-variant">Online</p>
            </div>
          </div>
        </div>
      </aside>

      <header className="flex justify-between items-center w-[calc(100%-16rem)] px-gutter h-16 ml-64 fixed top-0 bg-surface z-40 border-b border-on-background">
        <div className="flex items-center gap-8">
          <span className="font-headline-md text-headline-md font-black text-on-background">CMS_CORE</span>
          <div className="flex gap-6">
            <a className="font-label-caps text-label-caps text-secondary" href="/admin/dashboard/projects">Systems</a>
            <a href="/admin/dashboard/logs" className="font-label-caps text-label-caps text-secondary hover:underline">Logs</a>
            <span className="font-label-caps text-label-caps text-secondary opacity-40 cursor-default">Security</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative flex items-center border-b border-on-background pb-1">
            <span className="material-symbols-outlined text-[18px]">search</span>
            <input className="bg-transparent border-none focus:ring-0 font-mono-label text-[12px] w-48 placeholder:text-on-surface-variant/40" placeholder="QUERY_SYSTEM..." type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleSearch} />
          </div>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined hover:scale-95 transition-transform" onClick={toggleDark}>{dark ? 'light_mode' : 'dark_mode'}</button>
            <a href="/admin/dashboard/blog" className="material-symbols-outlined hover:scale-95 transition-transform">notifications</a>
            <a href="/admin/dashboard" className="material-symbols-outlined hover:scale-95 transition-transform">settings</a>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="font-label-caps text-label-caps border border-on-background px-4 py-1 hover:bg-on-background hover:text-white transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="ml-64 pt-24 px-gutter pb-12 max-w-[1440px]">
        {children}
      </main>

      <footer className="ml-64 px-gutter py-8 border-t border-on-background/10">
        <div className="flex justify-between items-center opacity-40">
          <p className="font-mono-label text-[10px]">© 2024 CMS_CORE_V1.2.4 // ALL RIGHTS RESERVED</p>
          <div className="flex gap-8">
            <a className="font-mono-label text-[10px] hover:underline" href="#">PRIVACY.MD</a>
            <a className="font-mono-label text-[10px] hover:underline" href="#">TERMS.LOG</a>
            <a className="font-mono-label text-[10px] hover:underline" href="#">SUPPORT.SQL</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
