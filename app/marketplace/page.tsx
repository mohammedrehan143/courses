'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MarketplaceHero } from '@/components/marketplace/marketplace-hero';
import { UIFilterBar } from '@/components/marketplace/ui-filter-bar';
import { UIProductCard } from '@/components/marketplace/ui-product-card';
import { MarketplaceGridSkeleton } from '@/components/marketplace/marketplace-skeleton';
import { UIProduct, MarketplaceFilterOptions } from '@/types/marketplace';
import { getUIProducts } from '@/lib/services/marketplace';
import { useAuth } from '@/context/auth-context';
import {
  Sparkles,
  Flame,
  Clock,
  Layers,
  ShoppingBag,
  ArrowRight,
  Code2,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MarketplacePage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userPurchasedIds, setUserPurchasedIds] = useState<string[]>([]);

  const [filters, setFilters] = useState<MarketplaceFilterOptions>({
    search: '',
    category: 'all',
    technology: 'all',
    priceRange: 'all',
    sortBy: 'popular',
    page: 1,
    limit: 50,
  });

  const catalogRef = useRef<HTMLDivElement>(null);

  // Fetch products when filters change
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const res = await getUIProducts(filters);
        setProducts(res.products);
        setTotalCount(res.total);
      } catch (err) {
        console.error('Error loading marketplace products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [filters]);

  // Load user purchases to show "Purchased" badge on cards
  useEffect(() => {
    async function loadPurchases() {
      try {
        const res = await fetch('/api/marketplace/purchases', {
          headers: user?.id ? { 'x-user-id': user.id } : {},
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.purchases)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setUserPurchasedIds(data.purchases.map((p: any) => p.ui_product_id));
        }
      } catch {
        // Ignore in guest view
      }
    }
    loadPurchases();
  }, [user]);

  const handleFilterChange = (newFilters: Partial<MarketplaceFilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Grouped products for landing highlights
  const featuredProducts = products.filter((p) => p.is_featured).slice(0, 3);
  const trendingProducts = products.filter((p) => p.is_trending).slice(0, 3);
  const newProducts = products.filter((p) => p.is_new).slice(0, 3);

  const isFiltered =
    Boolean(filters.search) ||
    filters.category !== 'all' ||
    filters.technology !== 'all' ||
    filters.priceRange !== 'all';

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
      {/* 1. Hero Section */}
      <MarketplaceHero onExploreClick={scrollToCatalog} />

      {/* 2. Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
        {/* Banner: What makes this marketplace different */}
        <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                How it works: Select UI → Unlock Prompt → Build with AI
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Every UI design comes with an in-depth AI Implementation Package structured with exact spacing, components, design tokens, and a11y specifications for Claude Code, Cursor, Antigravity, and Gemini.
              </p>
            </div>
          </div>
          <Link href="/marketplace/sell">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-semibold whitespace-nowrap border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300"
            >
              Become a UI Creator
            </Button>
          </Link>
        </div>

        {/* 3. Curated Highlights (only show when no active search/filters) */}
        {!isFiltered && (
          <div className="space-y-12">
            {/* Featured Section */}
            {featuredProducts.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                      Featured UI Designs
                    </h2>
                  </div>
                  <button
                    onClick={() => handleFilterChange({ sortBy: 'featured' })}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>View all featured</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredProducts.map((prod) => (
                    <UIProductCard
                      key={prod.id}
                      product={prod}
                      isPurchased={userPurchasedIds.includes(prod.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Trending Designs */}
            {trendingProducts.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-rose-500" />
                    <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                      Trending Developer Designs
                    </h2>
                  </div>
                  <button
                    onClick={() => handleFilterChange({ sortBy: 'popular' })}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>Most popular</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trendingProducts.map((prod) => (
                    <UIProductCard
                      key={prod.id}
                      product={prod}
                      isPurchased={userPurchasedIds.includes(prod.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. Complete Catalog & Interactive Filter System */}
        <div ref={catalogRef} id="explore-catalog" className="space-y-6 pt-6 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Explore All UI Designs
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Filter by technology, application category, and budget.
              </p>
            </div>
            <Link href="/marketplace/purchases">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-semibold gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>My Purchases ({userPurchasedIds.length})</span>
              </Button>
            </Link>
          </div>

          {/* Interactive Filter Bar */}
          <UIFilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            totalCount={totalCount}
          />

          {/* Catalog Products Grid */}
          {loading ? (
            <MarketplaceGridSkeleton count={6} />
          ) : products.length === 0 ? (
            /* Empty Search State */
            <div className="py-16 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Layers className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  No matching UI designs found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search keywords, category filters, or price range.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleFilterChange({
                    search: '',
                    category: 'all',
                    technology: 'all',
                    priceRange: 'all',
                    sortBy: 'popular',
                  })
                }
                className="text-xs font-semibold"
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <UIProductCard
                  key={prod.id}
                  product={prod}
                  isPurchased={userPurchasedIds.includes(prod.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
