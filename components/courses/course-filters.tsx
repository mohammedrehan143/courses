'use client';

import React from 'react';
import { FilterOptions } from '@/types/database';
import { RotateCcw, SlidersHorizontal, Award, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CourseFiltersProps {
  filters: FilterOptions;
  onChange: (newFilters: FilterOptions) => void;
  categories: { name: string; slug: string }[];
  providers: string[];
}

export function CourseFilters({
  filters,
  onChange,
  categories,
  providers,
}: CourseFiltersProps) {
  const handleCategoryChange = (val: string) => {
    onChange({ ...filters, category: val === 'all' ? undefined : val, page: 1 });
  };

  const handleLevelChange = (val: string) => {
    onChange({ ...filters, level: val === 'all' ? undefined : val, page: 1 });
  };

  const handleProviderChange = (val: string) => {
    onChange({ ...filters, provider: val === 'all' ? undefined : val, page: 1 });
  };

  const handleAccessTypeChange = (val: string) => {
    onChange({ ...filters, accessType: val === 'all' ? undefined : val, page: 1 });
  };

  const handleCertificationToggle = (checked: boolean) => {
    onChange({ ...filters, certificationOnly: checked || undefined, page: 1 });
  };

  const handleSortChange = (val: 'newest' | 'popular' | 'title_asc') => {
    onChange({ ...filters, sortBy: val, page: 1 });
  };

  const handleReset = () => {
    onChange({
      search: filters.search,
      collegeId: filters.collegeId,
      sortBy: 'newest',
      page: 1,
    });
  };

  const hasActiveFilters = Boolean(
    filters.category ||
    filters.level ||
    filters.provider ||
    filters.accessType ||
    filters.certificationOnly
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-blue-600" />
          <span>Filter Opportunities</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Verified Certificate Switch */}
      <div className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
        <label className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-600" />
            <div>
              <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 block">
                Free Certificate
              </span>
              <span className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 block">
                Only show certified pathways
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={Boolean(filters.certificationOnly)}
            onChange={(e) => handleCertificationToggle(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-emerald-300"
          />
        </label>
      </div>

      {/* Access Type Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Access Method
        </label>
        <select
          value={filters.accessType || 'all'}
          onChange={(e) => handleAccessTypeChange(e.target.value)}
          className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Access Types</option>
          <option value="college_email">🎓 College Email Unlocked</option>
          <option value="student_offer">🎟️ Student Offer / Voucher</option>
          <option value="institutional_access">🏛️ Institutional Access</option>
          <option value="partnership">🤝 Academic Partnership</option>
          <option value="completely_free">🌐 Completely Free (Open)</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Category
        </label>
        <select
          value={filters.category || 'all'}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Level Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Difficulty Level
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {['all', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => {
            const isSelected = (filters.level || 'all') === lvl;
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => handleLevelChange(lvl)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {lvl === 'all' ? 'Any Level' : lvl}
              </button>
            );
          })}
        </div>
      </div>

      {/* Provider Filter */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Provider
        </label>
        <select
          value={filters.provider || 'all'}
          onChange={(e) => handleProviderChange(e.target.value)}
          className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Providers</option>
          {providers.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Sorting */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Sort Results
        </label>
        <select
          value={filters.sortBy || 'newest'}
          onChange={(e) => handleSortChange(e.target.value as 'newest' | 'popular' | 'title_asc')}
          className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="newest">Featured & Recently Added</option>
          <option value="popular">Most Popular (By Clicks)</option>
          <option value="title_asc">Alphabetical (A - Z)</option>
        </select>
      </div>
    </div>
  );
}
