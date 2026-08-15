'use client';

import React, { useEffect, useState, useRef } from 'react';
import AnimatedShowcase from '@/components/AnimatedShowcase';

interface ShowcaseItem {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  image_url: string;
  display_order: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export default function AdminShowcasePage() {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShowcaseItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    category: '',
    description: '',
    image_url: '',
    display_order: 0,
    active: true,
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formError, setFormError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/showcase');
      if (!res.ok) throw new Error('Failed to load showcase items');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      subtitle: '',
      category: '',
      description: '',
      image_url: '',
      display_order: items.length,
      active: true,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: ShowcaseItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      subtitle: item.subtitle || '',
      category: item.category || '',
      description: item.description || '',
      image_url: item.image_url || '',
      display_order: item.display_order || 0,
      active: item.active ?? true,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFormError('Image file size must be less than 10MB.');
      return;
    }

    setUploading(true);
    setUploadProgress(30);
    setFormError('');

    try {
      const uploadData = new FormData();
      uploadData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadData,
      });

      setUploadProgress(80);

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Upload failed');
      }

      const data = await res.json();
      setFormData((prev) => ({ ...prev, image_url: data.url }));
      setUploadProgress(100);
    } catch (err: any) {
      setFormError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url.trim()) {
      setFormError('Please upload an image or provide an image URL.');
      return;
    }

    try {
      if (editingItem) {
        // Update item
        const res = await fetch(`/api/showcase/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to update showcase item');
      } else {
        // Create item
        const res = await fetch('/api/showcase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Failed to create showcase item');
      }

      setIsModalOpen(false);
      fetchItems();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save showcase item');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/showcase/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete item');
      setDeleteConfirmId(null);
      fetchItems();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  const handleToggleActive = async (item: ShowcaseItem) => {
    try {
      const res = await fetch(`/api/showcase/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !item.active }),
      });
      if (!res.ok) throw new Error('Failed to toggle status');
      fetchItems();
    } catch (err: any) {
      alert(err.message || 'Status toggle failed');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    setItems(newItems);

    const orderedIds = newItems.map((item) => item.id);
    try {
      await fetch('/api/showcase/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });
    } catch (err) {
      fetchItems();
    }
  };

  return (
    <div className="p-gutter max-w-7xl mx-auto ml-64 pt-20 pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline-md text-3xl font-bold tracking-tight text-on-background">
            Animated Showcase Management
          </h1>
          <p className="font-mono-label text-xs uppercase text-on-surface-variant opacity-60">
            Manage data-driven landscape images, order, and titles for the homepage scroll showcase.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface-container hover:bg-surface-container-high border border-outline text-on-surface font-mono-label text-xs uppercase rounded transition-colors"
          >
            <span className="material-symbols-outlined text-sm">visibility</span>
            Live Preview
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary font-mono-label text-xs uppercase font-bold rounded shadow hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add New Item
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg text-sm border border-error">
          {error}
        </div>
      )}

      {/* Main Table View */}
      {loading ? (
        <div className="p-12 text-center text-on-surface-variant font-mono-label text-sm">
          Loading showcase items...
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed border-outline-variant rounded-xl bg-surface-container-low">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2 block">
            collections
          </span>
          <p className="font-headline-md text-base font-semibold mb-1">No Showcase Items Found</p>
          <p className="font-body-md text-xs text-on-surface-variant mb-4">
            Upload landscape images to feature in the interactive scroll animation section.
          </p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-primary text-on-primary font-mono-label text-xs uppercase rounded font-bold"
          >
            Add First Item
          </button>
        </div>
      ) : (
        <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-low text-[11px] font-mono-label uppercase text-on-surface-variant">
                  <th className="py-3.5 px-4 w-12 text-center">Order</th>
                  <th className="py-3.5 px-4">Thumbnail</th>
                  <th className="py-3.5 px-4">Title & Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60 text-sm">
                {items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-surface-container/50 transition-colors">
                    {/* Order Controls */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          disabled={index === 0}
                          onClick={() => handleMove(index, 'up')}
                          className="p-0.5 disabled:opacity-20 hover:text-primary transition-opacity"
                        >
                          <span className="material-symbols-outlined text-sm leading-none">arrow_upward</span>
                        </button>
                        <span className="font-mono-label text-xs font-bold">{index + 1}</span>
                        <button
                          disabled={index === items.length - 1}
                          onClick={() => handleMove(index, 'down')}
                          className="p-0.5 disabled:opacity-20 hover:text-primary transition-opacity"
                        >
                          <span className="material-symbols-outlined text-sm leading-none">arrow_downward</span>
                        </button>
                      </div>
                    </td>

                    {/* Image Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="w-28 aspect-[16/10] bg-black rounded overflow-hidden border border-outline-variant">
                        <img
                          src={item.image_url}
                          alt={item.title || 'Showcase image'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>

                    {/* Title & Subtitle */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-on-surface text-sm">{item.title || 'Untitled Showcase Item'}</p>
                      {item.subtitle && (
                        <p className="text-xs text-on-surface-variant line-clamp-1">{item.subtitle}</p>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      {item.category ? (
                        <span className="px-2.5 py-1 bg-surface-container-high border border-outline-variant font-mono-label text-[10px] uppercase rounded">
                          {item.category}
                        </span>
                      ) : (
                        <span className="text-xs text-on-surface-variant opacity-40">&mdash;</span>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`px-3 py-1 rounded-full text-xs font-mono-label uppercase font-bold transition-colors ${
                          item.active
                            ? 'bg-green-500/15 text-green-700 dark:text-green-400 border border-green-500/30'
                            : 'bg-neutral-500/15 text-neutral-600 dark:text-neutral-400 border border-neutral-500/30'
                        }`}
                      >
                        {item.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded transition-colors"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="p-2 text-error hover:bg-error-container/20 rounded transition-colors"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-outline text-on-background w-full max-w-xl rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
              <h3 className="font-headline-md text-lg font-bold">
                {editingItem ? 'Edit Showcase Item' : 'Add New Showcase Item'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
              {formError && (
                <div className="p-3 bg-error-container text-on-error-container rounded text-xs border border-error">
                  {formError}
                </div>
              )}

              {/* Image Upload Dropzone & Live Preview */}
              <div>
                <label className="block font-mono-label text-xs uppercase text-on-surface-variant mb-2">
                  Landscape Image <span className="text-error">*</span>
                </label>

                {formData.image_url ? (
                  <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-black border border-outline mb-2 group">
                    <img
                      src={formData.image_url}
                      alt="Uploaded landscape preview"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-primary text-on-primary rounded font-mono-label text-xs uppercase"
                      >
                        Change Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, image_url: '' }))}
                        className="px-3 py-1.5 bg-error text-on-error rounded font-mono-label text-xs uppercase"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-[16/10] w-full rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-low hover:bg-surface-container flex flex-col items-center justify-center p-6 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">
                      cloud_upload
                    </span>
                    <p className="font-body-md text-xs font-semibold text-on-surface mb-1">
                      Click to upload landscape image
                    </p>
                    <p className="font-mono-label text-[10px] text-on-surface-variant">
                      JPEG, PNG, WebP up to 10MB (Preserves Landscape Aspect Ratio)
                    </p>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />

                {uploading && (
                  <div className="mt-2">
                    <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] font-mono-label text-on-surface-variant mt-1 text-right">
                      Uploading image... {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono-label text-xs uppercase text-on-surface-variant mb-1">
                    Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Minimalist E-Commerce"
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-mono-label text-xs uppercase text-on-surface-variant mb-1">
                    Category / Label (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. WEB APP, CASE STUDY"
                    className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono-label text-xs uppercase text-on-surface-variant mb-1">
                  Subtitle / Tagline (Optional)
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Next.js 14, Tailwind CSS & Motion"
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-mono-label text-xs uppercase text-on-surface-variant mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the visual feature..."
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded text-sm focus:outline-none focus:border-primary resize-none"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3 bg-surface-container-low border border-outline-variant rounded-lg">
                <div>
                  <p className="font-mono-label text-xs uppercase font-bold text-on-surface">
                    Active Status
                  </p>
                  <p className="text-[11px] text-on-surface-variant">
                    Enable to display this landscape card in the public animation section.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="custom-checkbox"
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-outline-variant flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-outline text-on-surface font-mono-label text-xs uppercase rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 bg-primary text-on-primary font-mono-label text-xs uppercase font-bold rounded disabled:opacity-50"
                >
                  {editingItem ? 'Save Changes' : 'Create Showcase Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-outline text-on-background w-full max-w-sm rounded-xl p-6 shadow-2xl">
            <h3 className="font-headline-md text-lg font-bold mb-2">Confirm Deletion</h3>
            <p className="font-body-md text-xs text-on-surface-variant mb-6">
              Are you sure you want to delete this showcase item? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-outline text-on-surface font-mono-label text-xs uppercase rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-error text-on-error font-mono-label text-xs uppercase font-bold rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
          <div className="p-4 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between text-white z-50">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">visibility</span>
              <span className="font-mono-label text-xs uppercase font-bold">
                Admin Live Preview Mode
              </span>
            </div>
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded font-mono-label text-xs uppercase"
            >
              Exit Preview
            </button>
          </div>
          <div className="flex-1 overflow-y-auto bg-black">
            <AnimatedShowcase />
          </div>
        </div>
      )}
    </div>
  );
}
