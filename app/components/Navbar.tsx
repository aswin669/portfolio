'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';

const sectionMap = [
  { href: '/', sectionId: 'home', label: 'Home' },
  { href: '/about', sectionId: 'about', label: 'About' },
  { href: '/tech-stack', sectionId: 'skills', label: 'Skills' },
  { href: '/experience', sectionId: 'experience', label: 'Experience' },
  { href: '/projects', sectionId: 'projects', label: 'Projects' },
  { href: '/services', sectionId: 'services', label: 'Services' },
  { href: '/gallery', sectionId: 'gallery', label: 'Gallery' },
  { href: '/blog', sectionId: 'blog', label: 'Blog' },
  { href: '/resume', sectionId: 'resume', label: 'Resume' },
  { href: '/contact', sectionId: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeScrollSection, setActiveScrollSection] = useState<string | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDark = () => {
    const next = !document.documentElement.classList.contains('dark');
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('admin_dark', String(next));
  };

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 30);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Handle IntersectionObserver scroll section highlighting only on the homepage '/'
  useEffect(() => {
    if (pathname !== '/') {
      setActiveScrollSection(null);
      return;
    }

    const sections = sectionMap.map((s) => {
      const el = document.getElementById(s.sectionId);
      return { ...s, element: el };
    }).filter((s) => s.element !== null);

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (sections.length > 0) {
      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id) setActiveScrollSection(id);
          }
        });
      }, {
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0,
      });

      sections.forEach((s) => {
        if (s.element) observerRef.current!.observe(s.element);
      });
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [pathname]);

  const isItemActive = (s: typeof sectionMap[0]) => {
    if (!pathname) return s.href === '/';

    // When on homepage '/'
    if (pathname === '/') {
      if (activeScrollSection) {
        return s.sectionId === activeScrollSection;
      }
      return s.href === '/';
    }

    // When on dedicated route pages (/about, /projects, /blog, etc.)
    if (s.href === '/') {
      return false; // Home is only active on the homepage
    }

    if (s.href === '/tech-stack' || s.sectionId === 'skills') {
      return (
        pathname === '/tech-stack' ||
        pathname.startsWith('/tech-stack/') ||
        pathname === '/skills' ||
        pathname.startsWith('/skills/')
      );
    }

    return pathname === s.href || pathname.startsWith(`${s.href}/`);
  };

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string, sectionId: string) => {
    if (pathname === '/') {
      const targetEl = document.getElementById(sectionId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveScrollSection(sectionId);
      }
    }
  }, [pathname]);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 border-b border-outline-variant transition-all duration-300 ${scrolled ? 'bg-surface/95 backdrop-blur-md shadow-sm' : 'bg-surface'}`}>
      <div className="max-w-container-max mx-auto px-4 sm:px-6 md:px-10 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a className="font-display-lg text-lg sm:text-xl font-bold tracking-tighter text-primary flex items-center gap-1.5 shrink-0" href="/">
          <span>ASWIN_S</span>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-7">
          {sectionMap.map((s) => {
            const active = isItemActive(s);
            return (
              <a
                key={s.sectionId}
                className={`text-[13px] font-medium tracking-wide uppercase transition-all duration-200 py-1.5 whitespace-nowrap ${
                  active
                    ? 'text-primary font-bold border-b-2 border-primary pb-0.5'
                    : 'text-secondary hover:text-primary hover:border-b-2 hover:border-outline-variant pb-0.5'
                }`}
                href={s.href}
                onClick={(e) => handleNavClick(e, s.href, s.sectionId)}
              >
                {s.label}
              </a>
            );
          })}
        </div>

        {/* Action Controls & Dark Mode */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-container-high transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? '☀' : '☾'}
          </button>
          <a
            href="/contact"
            className="bg-primary text-on-primary px-5 py-2 text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity rounded-sm"
          >
            Hire Me
          </a>
        </div>

        {/* Mobile / Tablet Controls */}
        <div className="flex lg:hidden items-center gap-2 shrink-0">
          <button
            onClick={toggleDark}
            className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-container-high transition-colors text-sm"
            aria-label="Toggle dark mode"
          >
            {dark ? '☀' : '☾'}
          </button>
          <button
            className="p-2 rounded-lg text-primary hover:bg-surface-container-high transition-colors material-symbols-outlined text-[24px]"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? 'close' : 'menu'}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Overlay Menu */}
      {menuOpen && (
        <div className="fixed inset-0 top-16 z-40 lg:hidden bg-surface/98 backdrop-blur-lg border-t border-outline-variant">
          <div className="flex flex-col items-center gap-4 pt-6 pb-10 px-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {sectionMap.map((s) => {
              const active = isItemActive(s);
              return (
                <a
                  key={s.sectionId}
                  className={`text-sm font-semibold uppercase tracking-widest py-2 transition-colors ${
                    active ? 'text-primary border-b-2 border-primary font-bold' : 'text-secondary hover:text-primary'
                  }`}
                  href={s.href}
                  onClick={(e) => { closeMenu(); handleNavClick(e, s.href, s.sectionId); }}
                >
                  {s.label}
                </a>
              );
            })}
            <div className="pt-4 w-full flex justify-center">
              <a
                href="/contact"
                className="bg-primary text-on-primary px-8 py-3 text-xs font-semibold uppercase tracking-widest rounded-sm w-full max-w-xs text-center"
                onClick={closeMenu}
              >
                Hire Me
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}