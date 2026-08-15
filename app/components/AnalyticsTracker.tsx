'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

function getOrCreateId(key: string, prefix: string, storage: Storage): string {
  try {
    let id = storage.getItem(key);
    if (!id) {
      const rand = Math.random().toString(36).substring(2, 9).toUpperCase();
      id = `${prefix}-${rand}`;
      storage.setItem(key, id);
    }
    return id;
  } catch {
    return `${prefix}-LOCAL`;
  }
}

function detectClientEnv() {
  if (typeof window === 'undefined') return { deviceType: 'Desktop', os: 'Unknown', browser: 'Unknown' };

  const ua = navigator.userAgent || '';
  let deviceType = 'Desktop';
  if (/tablet|ipad|playbook|silk/i.test(ua)) deviceType = 'Tablet';
  else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/i.test(ua)) deviceType = 'Mobile';

  let os = 'Unknown';
  if (ua.includes('Win')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('like Mac OS X') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

  let browser = 'Unknown';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';

  return { deviceType, os, browser };
}

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith('/admin') || pathname.startsWith('/api')) return;

    const visitorId = getOrCreateId('portfolio_vid', 'VIS', localStorage);
    const sessionId = getOrCreateId('portfolio_sid', 'SES', sessionStorage);
    const startTime = Date.now();
    const env = detectClientEnv();

    const payload = {
      path: pathname,
      visitorId,
      sessionId,
      referrer: typeof document !== 'undefined' ? document.referrer || 'Direct / None' : '',
      screenRes: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : '',
      language: typeof navigator !== 'undefined' ? navigator.language : '',
      deviceType: env.deviceType,
      os: env.os,
      browser: env.browser,
      durationSeconds: 0,
    };

    const sendPayload = (duration = 0) => {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, durationSeconds: duration }),
        keepalive: true,
      }).catch(() => {});
    };

    sendPayload(0);

    const interval = setInterval(() => {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      sendPayload(elapsed);
    }, 15000);

    const handleUnload = () => {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      sendPayload(elapsed);
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [pathname]);

  return null;
}
