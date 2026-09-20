'use client';

import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { UI_CATEGORIES } from '@/lib/mock-marketplace';
import { MarketplaceFilterOptions, UICategory } from '@/types/marketplace';
import { Input } from '@/components/ui/input';

interface UIFilterBarProps {
  filters: MarketplaceFilterOptions;
  onFilterChange: (newFilters: Partial<MarketplaceFilterOptions>) => void;
  totalCount: number;
}

const TECH_OPTIONS = ['React', 'Next.js', 'Vue', 'HTML/CSS', 'Tailwind', 'TypeScript'];

const PRICE_OPTIONS: { id: MarketplaceFilterOptions['priceRange']; label: string }[] = [
  { id: 'all', label: 'All Prices' },
  { id: 'free', label: 'Free' },
  { id: 'under-199', label: 'Under ₹199' },
  { id: '199-499', label: '₹199 – ₹499' },
  { id: '500-plus', label: '₹500+' },
];

const SORT_OPTIONS: { id: MarketplaceFilterOptions['sortBy']; label: string }[] = [
  { id: 'popular', label: 'Most Popular' },
  { id: 'newest', label: 'Newest Releases' },
  { id: 'price_asc', label: 'Price: Low → High' },
  { id: 'price_desc', label: 'Price: High → Low' },
];

export function UIFilterBar({ filters, onFilterChange, totalCount }: UIFilterBarProps) {
  const activeCategory = filters.category || 'all';
  const activeTech = filters.technology || 'all';
  const activePrice = filters.priceRange || 'all';
  const activeSort = filters.sortBy || 'popular';

  const hasActiveFilters =
    Boolean(filters.search) ||
    activeCategory !== 'all' ||
    activeTech !== 'all' ||
    activePrice !== 'all' ||
    activeSort !== 'popular';

  const handleResetFilters = () => {
    onFilterChange({
      search: '',
      category: 'all',
      technology: 'all',
      priceRange: 'all',
      sortBy: 'popular',
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Search & Sort Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search AI dashboards, SaaS landing pages, portfolios, Tailwind..."
            className="pl-10 pr-10 h-11 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-xl text-sm placeholder:text-slate-400 focus-visible:ring-[#0a192f]"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '' })}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Controls & Count */}
        <div className="flex items-center gap-2.5 justify-between sm:justify-end">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            <strong className="text-slate-900 dark:text-white font-semibold">{totalCount}</strong> UI designs
          </span>

          <div className="relative flex items-center">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <select
              value={activeSort}
              onChange={(e) =>
                onFilterChange({
                  sortBy: e.target.value as MarketplaceFilterOptions['sortBy'],
                })
              }
              className="pl-8 pr-8 py-2 text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 px-2 py-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Category Pills (Horizontal Scrollable) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => onFilterChange({ category: 'all' })}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
            activeCategory === 'all'
              ? 'bg-[#0a192f] text-white shadow-sm'
              : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
          }`}
        >
          All Categories
        </button>

        {UI_CATEGORIES.map((cat) => {
          const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => onFilterChange({ category: cat })}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-[#0a192f] text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Sub-Filters Row: Technologies & Price Range */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        {/* Technology Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" /> Tech:
          </span>
          <button
            onClick={() => onFilterChange({ technology: 'all' })}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
              activeTech === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {TECH_OPTIONS.map((tech) => {
            const isActive = activeTech.toLowerCase() === tech.toLowerCase();
            return (
              <button
                key={tech}
                onClick={() => onFilterChange({ technology: tech })}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {tech}
              </button>
            );
          })}
        </div>

        {/* Price Range Filter Pills */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium mr-1">Price:</span>
          {PRICE_OPTIONS.map((p) => {
            const isActive = activePrice === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onFilterChange({ priceRange: p.id })}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
