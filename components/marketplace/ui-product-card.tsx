'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UIProduct } from '@/types/marketplace';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Star,
  Smartphone,
  Monitor,
  ExternalLink,
  ArrowUpRight,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface UIProductCardProps {
  product: UIProduct;
  isPurchased?: boolean;
}

export function UIProductCard({ product, isPurchased }: UIProductCardProps) {
  const isFree = product.price === 0;

  return (
    <div className="group relative flex flex-col rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-subtle hover:shadow-premium hover:border-[#0a192f]/40 dark:hover:border-slate-700 transition-all duration-200 overflow-hidden">
      {/* Product Image Area */}
      <Link href={`/marketplace/${product.slug}`} className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 block">
        <Image
          src={product.preview_image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-300 ease-out"
        />

        {/* Category Pill Over Image */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-medium shadow-sm">
            {product.category}
          </span>
          {product.is_featured && (
            <span className="px-2 py-1 rounded-lg bg-amber-500/90 backdrop-blur-md text-slate-950 text-[10px] font-bold uppercase tracking-wider">
              Featured
            </span>
          )}
          {product.is_trending && (
            <span className="px-2 py-1 rounded-lg bg-indigo-600/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
              Trending
            </span>
          )}
        </div>

        {/* Responsive Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-950/70 backdrop-blur-md text-slate-200 text-[10px] font-medium">
          <Monitor className="w-3 h-3" />
          <span>+</span>
          <Smartphone className="w-3 h-3" />
          <span>Responsive</span>
        </div>

        {/* Purchased Badge if user already owns it */}
        {isPurchased && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-semibold shadow-md">
            <Check className="w-3.5 h-3.5" />
            <span>Purchased</span>
          </div>
        )}
      </Link>

      {/* Card Content Body */}
      <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Creator Row & Rating */}
          <div className="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5 truncate">
              {product.creator?.avatar ? (
                <Image
                  src={product.creator.avatar}
                  alt={product.creator.display_name}
                  width={20}
                  height={20}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] flex items-center justify-center font-bold">
                  {product.creator?.display_name.charAt(0) || 'C'}
                </div>
              )}
              <span className="font-medium text-slate-700 dark:text-slate-300 truncate">
                {product.creator?.display_name}
              </span>
              {product.creator?.verified && (
                <span title="Verified UI Creator" className="inline-flex shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 shrink-0 text-slate-700 dark:text-slate-300 font-medium text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-slate-400">({product.reviews_count})</span>
            </div>
          </div>

          {/* Product Title */}
          <Link href={`/marketplace/${product.slug}`} className="block group-hover:text-blue-600 transition-colors">
            <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug line-clamp-1">
              {product.title}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Technology Badges */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {product.technologies.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-mono"
              >
                {tech}
              </span>
            ))}
            {product.technologies.length > 3 && (
              <span className="text-[10px] text-slate-400 font-mono">
                +{product.technologies.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Pricing and Action Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] text-slate-400 block font-medium">Price</span>
            <div className="flex items-baseline gap-1">
              {isFree ? (
                <span className="font-extrabold text-base text-emerald-600 dark:text-emerald-400">
                  Free
                </span>
              ) : (
                <span className="font-extrabold text-base text-slate-900 dark:text-white">
                  ₹{product.price}
                </span>
              )}
            </div>
          </div>

          <Link href={`/marketplace/${product.slug}`}>
            <Button
              size="sm"
              className={
                isPurchased
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white text-xs gap-1 font-semibold rounded-xl'
                  : 'bg-[#0a192f] hover:bg-[#132c54] text-white text-xs gap-1 font-semibold rounded-xl'
              }
            >
              <span>{isPurchased ? 'Unlocked' : 'View UI'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
