'use client';

import React, { useEffect, useCallback } from 'react';

export interface ShowcaseItem {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  image_url: string;
  display_order: number;
  active: boolean;
}

interface LightboxModalProps {
  items: ShowcaseItem[];
  currentIndex: number | null;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export default function LightboxModal({
  items,
  currentIndex,
  onClose,
  onSelectIndex,
}: LightboxModalProps) {
  const isOpen = currentIndex !== null && currentIndex >= 0 && currentIndex < items.length;
  const currentItem = isOpen ? items[currentIndex!] : null;

  const handleNext = useCallback(() => {
    if (currentIndex === null || items.length === 0) return;
    onSelectIndex((currentIndex + 1) % items.length);
  }, [currentIndex, items.length, onSelectIndex]);

  const handlePrev = useCallback(() => {
    if (currentIndex === null || items.length === 0) return;
    onSelectIndex((currentIndex - 1 + items.length) % items.length);
  }, [currentIndex, items.length, onSelectIndex]);

  useEffect(() => {
    if (!isOpen) return;

    // Lock body scrolling when modal is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || !currentItem) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label={currentItem.title || 'Showcase Image Lightbox'}
      onClick={onClose}
    >
      {/* Top Bar Controls */}
      <div
        className="w-full flex items-center justify-between z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          {currentItem.category && (
            <span className="font-mono-label text-xs uppercase tracking-widest px-3 py-1 bg-white/10 text-white rounded-full border border-white/20">
              {currentItem.category}
            </span>
          )}
          <span className="font-mono-label text-xs text-neutral-400">
            {currentIndex! + 1} / {items.length}
          </span>
        </div>

        <button
          onClick={onClose}
          aria-label="Close lightbox"
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20 focus:outline-none focus:ring-2 focus:ring-white"
        >
          <span className="material-symbols-outlined text-xl leading-none">close</span>
        </button>
      </div>

      {/* Main High-Res Landscape Image Viewer */}
      <div
        className="relative flex-1 w-full max-w-7xl mx-auto my-4 flex items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous Button */}
        {items.length > 1 && (
          <button
            onClick={handlePrev}
            aria-label="Previous image"
            className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all border border-white/20 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <span className="material-symbols-outlined text-2xl leading-none">chevron_left</span>
          </button>
        )}

        {/* High quality landscape image preview preserving aspect ratio */}
        <div className="w-full h-full flex items-center justify-center p-2">
          <img
            src={currentItem.image_url}
            alt={currentItem.title || currentItem.category || 'Showcase image'}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-all duration-300"
          />
        </div>

        {/* Next Button */}
        {items.length > 1 && (
          <button
            onClick={handleNext}
            aria-label="Next image"
            className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all border border-white/20 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <span className="material-symbols-outlined text-2xl leading-none">chevron_right</span>
          </button>
        )}
      </div>

      {/* Bottom Info Bar */}
      <div
        className="w-full max-w-4xl mx-auto text-center z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {currentItem.title && (
          <h3 className="font-display-lg text-lg sm:text-2xl font-bold text-white mb-1">
            {currentItem.title}
          </h3>
        )}
        {currentItem.subtitle && (
          <p className="font-body-md text-xs sm:text-sm text-neutral-300 max-w-2xl mx-auto">
            {currentItem.subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
