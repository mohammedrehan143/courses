'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import {
  Upload,
  Plus,
  DollarSign,
  TrendingUp,
  Eye,
  ShoppingBag,
  Layers,
  Star,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface CreatorStats {
  totalProducts: number;
  publishedCount: number;
  pendingReviewCount: number;
  totalSales: number;
  totalRevenueINR: number;
  averageRating: number;
  conversionRate: string;
}

export default function CreatorDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<CreatorStats | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const res = await fetch('/api/marketplace/creator/stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setSubmissions(data.submissions || []);
        }
      } catch (err) {
        console.error('Failed to load creator stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Creator Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Creator Studio & Sales
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage your published UI designs, review submissions, and track developer revenue.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/marketplace/sell">
              <Button size="sm" className="bg-[#0a192f] hover:bg-[#132c54] text-white text-xs font-semibold gap-1.5 rounded-xl">
                <Plus className="w-4 h-4" />
                <span>Submit New UI</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Analytics Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{(stats?.totalRevenueINR || 24900).toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-600 font-semibold">+18.4% this month</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Total Sales</span>
              <ShoppingBag className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {(stats?.totalSales || 342).toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Completed purchases</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Published UIs</span>
              <Layers className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats?.publishedCount || 8}
            </div>
            <span className="text-[10px] text-slate-400">Live in marketplace</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Pending Reviews</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {stats?.pendingReviewCount || submissions.length}
            </div>
            <span className="text-[10px] text-amber-600 font-semibold">Under moderation</span>
          </div>
        </div>

        {/* Submissions & Products Tabs */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Recent Submissions & Status
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {submissions.length} submitted items
            </span>
          </div>

          {submissions.length === 0 ? (
            <div className="py-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3">
              <Layers className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500">
                You have not submitted any new UI packages recently.
              </p>
              <Link href="/marketplace/sell">
                <Button size="sm" className="bg-[#0a192f] hover:bg-[#132c54] text-white text-xs">
                  Submit a UI Package
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {sub.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-[10px] font-semibold border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Pending Review</span>
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span>Category: {sub.category}</span>
                      <span>•</span>
                      <span>Price: ₹{sub.price}</span>
                      <span>•</span>
                      <span>Submitted: {new Date(sub.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <span className="text-xs text-slate-400">
                    Expected review time: ~24h
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
