'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { getSavedCourses } from '@/lib/services/bookmarks';
import { Course } from '@/types/database';
import { CourseCard } from '@/components/courses/course-card';
import { Button } from '@/components/ui/button';
import { Bookmark, Sparkles, Compass, BookOpen } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function SavedCoursesPage() {
  const { savedCourseIds, student } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSaved() {
      setLoading(true);
      try {
        const data = await getSavedCourses(student?.id);
        // Filter strictly to current saved course IDs
        const filtered = data.filter((c) => savedCourseIds.includes(c.id));
        setCourses(filtered);
      } catch (err) {
        console.error('Error loading saved courses', err);
      } finally {
        setLoading(false);
      }
    }
    loadSaved();
  }, [savedCourseIds, student]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold">
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>My Bookmarks</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Saved Courses &amp; Certifications
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Keep track of the zero-cost opportunities you plan to take. Your bookmarks persist across your devices.
          </p>
        </div>

        <Link href="/courses">
          <Button variant="outline" className="rounded-2xl text-xs font-semibold gap-2">
            <Compass className="w-4 h-4" />
            <span>Explore More Courses</span>
          </Button>
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
              <Skeleton className="h-44 w-full rounded-xl" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 max-w-2xl mx-auto shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No saved courses yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              As you browse courses, click the bookmark icon on any card to save it here for quick access later.
            </p>
          </div>
          <Link href="/courses">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold text-xs px-6">
              Browse Course Catalog
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
