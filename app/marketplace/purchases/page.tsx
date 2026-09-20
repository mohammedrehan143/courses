'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { UIPurchase } from '@/types/marketplace';
import { Button } from '@/components/ui/button';
import {
  ShoppingBag,
  ArrowRight,
  Copy,
  Check,
  Download,
  Terminal,
  ExternalLink,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

export default function MyPurchasesPage() {
  const { user } = useAuth();
  const [purchases, setPurchases] = useState<UIPurchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadPurchases() {
      setLoading(true);
      try {
        const res = await fetch('/api/marketplace/purchases', {
          headers: user?.id ? { 'x-user-id': user.id } : {},
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.purchases)) {
          setPurchases(data.purchases);
        }
      } catch (err) {
        console.error('Failed to load user purchases:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPurchases();
  }, [user]);

  const handleCopyPrompt = async (productId: string) => {
    try {
      const res = await fetch(`/api/marketplace/prompt?productId=${productId}&agent=general`, {
        headers: user?.id ? { 'x-user-id': user.id } : {},
      });
      const data = await res.json();
      if (data.success && data.prompt) {
        await navigator.clipboard.writeText(data.prompt);
        setCopiedId(productId);
        setTimeout(() => setCopiedId(null), 2500);
      }
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  };

  const handleDownloadPrompt = async (productId: string, title: string) => {
    try {
      const res = await fetch(`/api/marketplace/prompt?productId=${productId}&agent=general`, {
        headers: user?.id ? { 'x-user-id': user.id } : {},
      });
      const data = await res.json();
      if (data.success && data.prompt) {
        const filename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-ai-prompt.md`;
        const element = document.createElement('a');
        const file = new Blob([data.prompt], { type: 'text/markdown' });
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }
    } catch (err) {
      console.error('Failed to download prompt:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>User Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              My UI Purchases
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Access your unlocked AI Build Packages, prompts, and design specifications.
            </p>
          </div>

          <Link href="/marketplace">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-semibold gap-1.5 self-start sm:self-auto"
            >
              <span>Explore More UI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-36 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : purchases.length === 0 ? (
          /* Empty Purchases State */
          <div className="py-16 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Layers className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                No purchased UI designs yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Discover developer-grade UI designs in the marketplace and unlock AI prompts ready for Claude Code, Cursor, and Antigravity.
              </p>
            </div>
            <Link href="/marketplace">
              <Button size="sm" className="bg-[#0a192f] hover:bg-[#132c54] text-white text-xs font-semibold">
                Browse UI Marketplace
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {purchases.map((purchase) => {
              const product = purchase.product;
              if (!product) return null;
              const isCopied = copiedId === product.id;

              return (
                <div
                  key={purchase.id}
                  className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-subtle hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                >
                  {/* Left: Preview thumbnail & details */}
                  <div className="flex items-start gap-4">
                    <Link
                      href={`/marketplace/${product.slug}`}
                      className="relative w-28 h-20 sm:w-36 sm:h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700"
                    >
                      <Image
                        src={product.preview_image}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[10px] font-semibold">
                          {product.category}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(purchase.purchased_at).toLocaleDateString()}
                        </span>
                      </div>

                      <Link
                        href={`/marketplace/${product.slug}`}
                        className="hover:text-blue-600 transition"
                      >
                        <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                          {product.title}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>Paid: <strong className="text-slate-800 dark:text-slate-200">{purchase.amount === 0 ? 'Free' : `₹${purchase.amount}`}</strong></span>
                        <span>•</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          Prompt Unlocked
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                    <Button
                      size="sm"
                      onClick={() => handleCopyPrompt(product.id)}
                      className={`text-xs font-semibold gap-1.5 h-9 rounded-xl transition-all ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Prompt copied ✓' : 'Copy AI Prompt'}</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadPrompt(product.id, product.title)}
                      className="text-xs font-semibold gap-1.5 h-9 rounded-xl"
                      title="Download markdown prompt"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Download .md</span>
                    </Button>

                    <Link href={`/marketplace/${product.slug}`}>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-xs font-semibold gap-1.5 h-9 rounded-xl"
                      >
                        <span>View UI</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
