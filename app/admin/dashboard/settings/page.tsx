'use client';

import { useEffect, useState, useRef } from 'react';

const SETTINGS_SECTIONS: { title: string; keys: { key: string; label: string; type?: string; placeholder?: string }[] }[] = [
  {
    title: 'General',
    keys: [
      { key: 'site_name', label: 'Site Name', placeholder: 'ASWIN S' },
      { key: 'site_tagline', label: 'Site Tagline', placeholder: 'MERN Stack Developer...' },
      { key: 'admin_email', label: 'Admin Email', placeholder: 'admin@example.com' },
    ],
  },
  {
    title: 'Social Links',
    keys: [
      { key: 'github_url', label: 'GitHub URL', placeholder: 'https://github.com/username' },
      { key: 'linkedin_url', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/username' },
      { key: 'twitter_url', label: 'Twitter / X URL', placeholder: 'https://twitter.com/username' },
      { key: 'email_address', label: 'Public Email', placeholder: 'hello@example.com' },
    ],
  },
  {
    title: 'SEO',
    keys: [
      { key: 'meta_title', label: 'Meta Title', placeholder: 'ASWIN S | MERN Stack Developer' },
      { key: 'meta_description', label: 'Meta Description', placeholder: 'MERN Stack Developer crafting...' },
    ],
  },
  {
    title: 'Security',
    keys: [
      { key: 'admin_password', label: 'New Admin Password', type: 'password', placeholder: 'Enter new password' },
    ],
  },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => { setSettings(data); setLoading(false); })
      .catch(() => { setError('Failed to load settings'); setLoading(false); });
  }, []);

  function handleChange(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) {
        setSettings((prev) => ({ ...prev, hero_image: data.url }));
        setMessage('Hero image uploaded successfully! Click SAVE ALL to preserve changes.');
      }
    } catch {
      setError('Image upload failed');
    } finally {
      setUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  async function handleSave() {
    setSaving(true);
    setMessage('');
    setError('');
    try {
      // Only send password if it's not empty
      const payload = { ...settings };
      if (!payload.admin_password) delete payload.admin_password;
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Save failed');
      const updated = await res.json();
      setSettings(updated);
      setMessage('Settings saved successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="font-mono-label text-mono-label text-secondary py-8 text-center">Loading...</p>;
  if (error && Object.keys(settings).length === 0) return <p className="font-mono-label text-mono-label text-error py-8 text-center">{error}</p>;

  return (
    <>
      <section className="mb-stack-lg flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <p className="font-label-caps text-label-caps text-on-surface-variant mb-2">CONFIGURATION // SETTINGS</p>
          <h2 className="font-display-lg text-4xl md:text-6xl font-bold tracking-tighter uppercase">Site Settings</h2>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="font-label-caps text-label-caps border border-on-background px-6 py-3 hover:bg-on-background hover:text-background transition-all disabled:opacity-30"
        >
          {saving ? 'SAVING...' : 'SAVE ALL'}
        </button>
      </section>

      {message && (
        <div className="border border-green-700 bg-green-900/20 p-4 mb-stack-lg font-mono-label text-sm text-green-300">
          {message}
        </div>
      )}
      {error && (
        <div className="border border-red-700 bg-red-900/20 p-4 mb-stack-lg font-mono-label text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="space-y-stack-lg">
        {/* Hero Image Settings Section */}
        <div className="border border-on-background">
          <div className="border-b border-on-background bg-surface-container px-6 py-4 flex justify-between items-center">
            <h3 className="font-label-caps text-label-caps uppercase tracking-wider">Hero Section Image</h3>
            <span className="font-mono-label text-[11px] text-secondary">HOMEPAGE PORTRAIT PHOTO</span>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-32 h-40 bg-surface-container border border-on-background overflow-hidden relative group rounded-md shrink-0">
                <img
                  src={settings.hero_image || '/hero-image.jpg'}
                  alt="Hero Preview"
                  className="w-full h-full object-cover"
                />
                {settings.hero_image && (
                  <button
                    type="button"
                    onClick={() => handleChange('hero_image', '')}
                    className="absolute top-1 right-1 bg-black/80 text-white w-6 h-6 flex items-center justify-center text-xs rounded hover:bg-red-600 transition-colors"
                    title="Reset to default"
                  >
                    &times;
                  </button>
                )}
              </div>
              <div className="space-y-3 flex-1 w-full">
                <label className="font-mono-label text-[12px] text-secondary uppercase tracking-wider block">
                  Hero Image URL
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={settings.hero_image || ''}
                    onChange={(e) => handleChange('hero_image', e.target.value)}
                    placeholder="https://... or upload image"
                    className="flex-1 bg-background border border-on-background px-4 py-2.5 font-mono-label text-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="bg-primary text-on-primary font-label-caps text-xs px-5 py-3 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {uploading ? 'hourglass_top' : 'upload'}
                    </span>
                    {uploading ? 'UPLOADING...' : 'UPLOAD NEW PHOTO'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
                <p className="font-mono-label text-xs text-secondary">
                  Upload a portrait photo or enter an image URL to customize your homepage Hero image.
                </p>
              </div>
            </div>
          </div>
        </div>

        {SETTINGS_SECTIONS.map((section) => (
          <div key={section.title} className="border border-on-background">
            <div className="border-b border-on-background bg-surface-container px-6 py-4">
              <h3 className="font-label-caps text-label-caps uppercase tracking-wider">{section.title}</h3>
            </div>
            <div className="p-6 space-y-5">
              {section.keys.map((field) => (
                <div key={field.key}>
                  <label className="font-mono-label text-[12px] text-secondary uppercase tracking-wider block mb-1.5">
                    {field.label}
                  </label>
                  <input
                    type={field.type || 'text'}
                    value={settings[field.key] || ''}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full bg-background border border-on-background px-4 py-2.5 font-mono-label text-sm focus:outline-none focus:ring-0"
                    autoComplete={field.type === 'password' ? 'new-password' : 'off'}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
