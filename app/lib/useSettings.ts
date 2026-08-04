'use client';

import { useEffect, useState } from 'react';

let cached: Record<string, string> | null = null;
let promise: Promise<Record<string, string>> | null = null;

export function useSettings() {
  const [settings, setSettings] = useState<Record<string, string>>(cached || {});

  useEffect(() => {
    if (cached) return;
    if (!promise) {
      promise = fetch('/api/settings').then((r) => r.json()).then((data) => {
        cached = data;
        return data;
      });
    }
    promise.then((data) => setSettings(data));
  }, []);

  return settings;
}
