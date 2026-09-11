'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories } from '@/lib/services/categories';
import { Category } from '@/types/database';
import {
  LayoutGrid,
  BrainCircuit,
  Cloud,
  Database,
  ShieldCheck,
  Code2,
  Terminal,
  Briefcase,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCats() {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCats();
  }, []);

  const getIcon = (slug: string) => {
    switch (slug) {
      case 'ai-ml':
        return <BrainCircuit className="w-8 h-8 text-purple-600" />;
      case 'cloud':
        return <Cloud className="w-8 h-8 text-blue-600" />;
      case 'data-science':
        return <Database className="w-8 h-8 text-emerald-600" />;
      case 'cybersecurity':
        return <ShieldCheck className="w-8 h-8 text-rose-600" />;
      case 'web-development':
        return <Code2 className="w-8 h-8 text-indigo-600" />;
      case 'devops':
        return <Terminal className="w-8 h-8 text-amber-600" />;
      default:
        return <Briefcase className="w-8 h-8 text-slate-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold">
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Subject Areas</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Browse by Subject &amp; Specialization
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
          Choose a discipline to discover student discounts, free vouchers, and official curriculum pathways.
        </p>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/courses?category=${encodeURIComponent(cat.name)}`}
              className="group p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-subtle hover:shadow-premium transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="p-3.5 w-fit rounded-2xl bg-slate-50 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50 group-hover:scale-105 transition-all">
                  {getIcon(cat.slug)}
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span>Explore Tracks</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
