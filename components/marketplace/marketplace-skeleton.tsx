import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export function MarketplaceProductSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-subtle flex flex-col">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24 rounded-md" />
            <Skeleton className="h-4 w-12 rounded-md" />
          </div>
          <Skeleton className="h-5 w-3/4 rounded-md" />
          <Skeleton className="h-3 w-full rounded-md" />
          <Skeleton className="h-3 w-4/5 rounded-md" />
          <div className="flex gap-1.5 pt-2">
            <Skeleton className="h-5 w-14 rounded-md" />
            <Skeleton className="h-5 w-14 rounded-md" />
            <Skeleton className="h-5 w-14 rounded-md" />
          </div>
        </div>
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function MarketplaceGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <MarketplaceProductSkeleton key={i} />
      ))}
    </div>
  );
}
