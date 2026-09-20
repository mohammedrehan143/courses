'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Monitor, Smartphone, ExternalLink, Maximize2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DevicePreviewProps {
  title: string;
  previewImage: string;
  galleryImages: string[];
  liveDemoUrl?: string;
}

export function DevicePreview({
  title,
  previewImage,
  galleryImages,
  liveDemoUrl,
}: DevicePreviewProps) {
  const allImages = [previewImage, ...galleryImages.filter((img) => img !== previewImage)];
  const [selectedImage, setSelectedImage] = useState<string>(previewImage);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="space-y-4">
      {/* Top Device Switcher & Live Demo Bar */}
      <div className="flex items-center justify-between gap-3 p-2 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60">
        {/* Device Mode Switcher */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl shadow-xs border border-slate-200/60 dark:border-slate-800">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              deviceMode === 'desktop'
                ? 'bg-[#0a192f] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop View</span>
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              deviceMode === 'mobile'
                ? 'bg-[#0a192f] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile View</span>
          </button>
        </div>

        {/* Live Demo Link Button */}
        {liveDemoUrl && (
          <a
            href={liveDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Open Live Demo</span>
            <span className="sm:hidden">Live Demo</span>
          </a>
        )}
      </div>

      {/* Main Preview Frame Container */}
      <div className="relative w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-3 sm:p-6 flex items-center justify-center overflow-hidden min-h-[420px] sm:min-h-[520px]">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370f_1px,transparent_1px),linear-gradient(to_bottom,#1f29370f_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {deviceMode === 'desktop' ? (
          /* Desktop Browser Mock Frame */
          <div className="w-full max-w-4xl rounded-xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden transition-all duration-300">
            {/* Browser Address Bar */}
            <div className="px-4 py-2.5 bg-slate-950/90 border-b border-slate-800/80 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex-1 max-w-sm mx-auto px-3 py-1 rounded-md bg-slate-800/80 text-[11px] font-mono text-slate-400 text-center truncate border border-slate-700/50">
                https://demo.cosurf.dev/preview/{title.toLowerCase().replace(/\s+/g, '-')}
              </div>
            </div>

            {/* Desktop Screen Image */}
            <div className="relative aspect-[16/10] w-full bg-slate-950 overflow-hidden">
              <Image
                src={selectedImage}
                alt={title}
                fill
                priority
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 800px"
              />
            </div>
          </div>
        ) : (
          /* Mobile Phone Mock Frame */
          <div className="w-[300px] sm:w-[320px] rounded-[40px] border-4 border-slate-700 bg-slate-900 shadow-2xl overflow-hidden p-2 transition-all duration-300">
            {/* Top Notch / Dynamic Island */}
            <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-slate-800" />
            </div>

            {/* Mobile Screen Image */}
            <div className="relative aspect-[9/18] w-full rounded-[30px] overflow-hidden bg-slate-950">
              <Image
                src={selectedImage}
                alt={title}
                fill
                priority
                className="object-cover object-top"
                sizes="320px"
              />
            </div>

            {/* Bottom Home Indicator */}
            <div className="w-28 h-1 bg-slate-600 rounded-full mx-auto mt-2.5" />
          </div>
        )}
      </div>

      {/* Gallery Thumbnails Carousel */}
      {allImages.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                selectedImage === img
                  ? 'border-blue-600 ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`${title} preview ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
