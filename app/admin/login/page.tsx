'use client';

import { useState, useEffect, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(false);
  const [savedEmail, setSavedEmail] = useState('');

  useEffect(() => {
    setRemember(localStorage.getItem('admin_remember') === 'true');
    setSavedEmail(localStorage.getItem('admin_email') || '');
  }, []);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      const x = (e.clientX / window.innerWidth) * 10 - 5;
      const y = (e.clientY / window.innerHeight) * 10 - 5;
      cardRef.current.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const email = form.get('email') as string;
    const password = form.get('password') as string;

    if (remember) {
      localStorage.setItem('admin_remember', 'true');
      localStorage.setItem('admin_email', email);
    } else {
      localStorage.removeItem('admin_remember');
      localStorage.removeItem('admin_email');
    }

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push('/admin/dashboard');
    } else {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-gutter" style={{ backgroundColor: '#ffffff', color: '#1a1c1c' }}>
      <main className="w-full max-w-[440px]">
        <div className="mb-12 text-center">
          <h1 className="font-headline-md text-headline-md font-black tracking-tighter uppercase mb-2">CMS_CORE</h1>
          <p className="font-mono-label text-mono-label uppercase tracking-widest" style={{ color: '#5d5f5f' }}>Administrative Access</p>
        </div>

        <div
          ref={cardRef}
          className="bg-white p-8 md:p-12"
          style={{ border: '1px solid #1a1c1c', transition: 'transform 0.1s ease-out' }}
        >
          {error && (
            <div className="mb-6 p-4 font-mono-label text-mono-label uppercase" style={{ backgroundColor: '#ffdad6', border: '1px solid #ba1a1a', color: '#93000a' }}>
              {error}
            </div>
          )}
          <form className="flex flex-col space-y-10" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="font-mono-label text-mono-label uppercase block" htmlFor="email" style={{ color: '#1a1c1c' }}>Email Address</label>
              <input
                className="input-underline font-body-md text-body-md"
                id="email"
                name="email"
                placeholder="admin@cms-core.systems"
                required
                type="email"
                defaultValue={savedEmail}
                style={{ color: '#1a1c1c' }}
              />
            </div>

            <div className="space-y-2">
              <label className="font-mono-label text-mono-label uppercase block" htmlFor="password" style={{ color: '#1a1c1c' }}>Password</label>
              <div className="relative">
                <input
                  className="input-underline font-body-md text-body-md pr-10"
                  id="password"
                  name="password"
                  placeholder="••••••••••••"
                  required
                  type={showPassword ? 'text' : 'password'}
                  style={{ color: '#1a1c1c' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 bottom-2 transition-colors hover:opacity-70"
                  style={{ color: '#1a1c1c' }}
                  aria-label="Toggle password visibility"
                >
                  <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input type="checkbox" className="custom-checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                <span className="font-mono-label text-mono-label uppercase transition-colors group-hover:text-on-background" style={{ color: '#5d5f5f' }}>Remember Me</span>
              </label>
              <button
                type="button"
                onClick={() => alert('Contact the system administrator to reset your password.')}
                className="font-mono-label text-mono-label uppercase underline decoration-1 underline-offset-4 hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer"
                style={{ color: '#1a1c1c' }}
              >
                Forgot Password
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 font-label-caps text-label-caps uppercase tracking-widest hover:opacity-85 transition-opacity"
              style={{
                backgroundColor: '#000000',
                color: '#ffffff',
                opacity: loading ? 0.5 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
            </button>
          </form>
        </div>

        <div className="mt-12 text-center">
          <p className="font-mono-label text-mono-label uppercase" style={{ color: '#5d5f5f' }}>
            System Status: <span className="font-bold" style={{ color: '#1a1c1c' }}>Operational</span>
          </p>
          <div className="mt-4 flex justify-center space-x-6">
            <a className="font-label-caps text-label-caps uppercase hover:text-on-background transition-colors" href="/" style={{ color: '#c6c6c7' }}>Documentation</a>
            <a className="font-label-caps text-label-caps uppercase hover:text-on-background transition-colors" href="/contact" style={{ color: '#c6c6c7' }}>Support</a>
          </div>
        </div>
      </main>

      <div className="fixed top-0 left-0 w-full" style={{ height: '1px', backgroundColor: '#e2e2e2', pointerEvents: 'none', opacity: 0.2 }}></div>
      <div className="fixed top-0 left-0 h-full" style={{ width: '1px', backgroundColor: '#e2e2e2', pointerEvents: 'none', opacity: 0.2 }}></div>
      <div className="fixed bottom-0 left-0 w-full" style={{ height: '1px', backgroundColor: '#e2e2e2', pointerEvents: 'none', opacity: 0.2 }}></div>
      <div className="fixed top-0 right-0 h-full" style={{ width: '1px', backgroundColor: '#e2e2e2', pointerEvents: 'none', opacity: 0.2 }}></div>
    </div>
  );
}
