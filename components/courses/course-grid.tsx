'use client';

import React from 'react';
import { Course } from '@/types/database';
import { CourseCard } from './course-card';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchX, Sparkles, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CourseGridProps {
  courses: Course[];
  loading?: boolean;
  onResetFilters?: () => void;
}

export function CourseGrid({ courses, loading, onResetFilters }: CourseGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm flex flex-col"
          >
            <Skeleton className="h-44 w-full" />
            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-9 w-full rounded-xl" />
                  <Skeleton className="h-9 w-full rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 my-4 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          No courses found matching your criteria
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
          Try clearing some filters, adjusting your search query, or selecting another university to discover more student learning benefits.
        </p>
        {onResetFilters && (
          <div className="mt-6">
            <Button
              onClick={onResetFilters}
              variant="outline"
              size="sm"
              className="rounded-xl font-semibold text-xs"
            >
              Reset All Filters
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
