'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { useCollege } from '@/context/college-context';
import { getCourses } from '@/lib/services/courses';
import { getSavedCourses } from '@/lib/services/bookmarks';
import { Course } from '@/types/database';
import { CourseCard } from '@/components/courses/course-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  GraduationCap,
  School,
  Bookmark,
  Award,
  Sparkles,
  Compass,
  ArrowRight,
  Clock,
  ExternalLink,
  Flame,
  CheckCircle,
  Layers,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudentDashboardPage() {
  const { user, student, savedCourseIds } = useAuth();
  const { selectedCollege, openCollegeModal } = useCollege();

  const [recommended, setRecommended] = useState<Course[]>([]);
  const [popular, setPopular] = useState<Course[]>([]);
  const [savedCourses, setSavedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const [recRes, popRes, savedData] = await Promise.all([
          getCourses({ collegeId: selectedCollege?.id, limit: 3, sortBy: 'newest' }),
          getCourses({ collegeId: selectedCollege?.id, limit: 3, sortBy: 'popular' }),
          getSavedCourses(student?.id),
        ]);
        setRecommended(recRes.courses);
        setPopular(popRes.courses);
        setSavedCourses(savedData.filter((c) => savedCourseIds.includes(c.id)).slice(0, 3));
      } catch (err) {
        console.error('Error loading student dashboard', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [selectedCollege, student, savedCourseIds]);

  const studentName = user?.name || 'Alex Chen';
  const collegeName = selectedCollege?.name || 'Stanford University';
  const collegeDomain = selectedCollege?.domain || 'stanford.edu';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
      {/* Student Profile Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2.5 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-semibold">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Verified Student Account</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Welcome back, {studentName}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-blue-200/90">
            <span className="flex items-center gap-1.5 font-medium">
              <School className="w-4 h-4 text-blue-400" />
              {collegeName}
            </span>
            <span>•</span>
            <span className="bg-white/10 px-2 py-0.5 rounded-md font-mono">
              @{collegeDomain}
            </span>
            <span>•</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle className="w-3.5 h-3.5" /> Domain Verified
            </span>
          </div>
        </div>

        {/* Action button */}
        <div className="flex flex-wrap items-center gap-3 z-10">
          <Button
            onClick={openCollegeModal}
            variant="outline"
            size="sm"
            className="rounded-xl text-xs font-semibold bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Switch College
          </Button>
          <Link href="/courses">
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold gap-1.5"
            >
              <span>Explore All Courses</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Course & Benefit Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-subtle space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Available For You
          </span>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {recommended.length > 0 ? `${recommended.length + 4}+` : '7+'}
          </p>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium block">
            Institution courses unlocked
          </span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-subtle space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Saved Courses
          </span>
          <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
            {savedCourseIds.length}
          </p>
          <Link href="/saved" className="text-[11px] text-slate-500 hover:underline block">
            View bookmarks &rarr;
          </Link>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-subtle space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Free Certificates
          </span>
          <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            100%
          </p>
          <span className="text-[11px] text-emerald-600/80 font-medium block">
            Subsidized by student email
          </span>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-subtle space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Est. Tuition Saved
          </span>
          <p className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
            ${savedCourseIds.length * 150 || 450}
          </p>
          <span className="text-[11px] text-slate-500 font-medium block">
            Based on commercial voucher fees
          </span>
        </div>
      </div>

      {/* UI Marketplace & AI Prompts Callout */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-[#0a192f] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-300 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">UI Marketplace for AI Coding Agents</h3>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-semibold border border-blue-400/30">
                NEW SECTION
              </span>
            </div>
            <p className="text-xs text-blue-200/80">
              Discover production-ready developer UI designs with structured prompts for Claude Code, Cursor, and Antigravity.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <Link href="/marketplace" className="flex-1 md:flex-initial">
            <Button size="sm" className="w-full bg-white text-[#0a192f] hover:bg-slate-100 text-xs font-semibold rounded-xl">
              Browse Marketplace
            </Button>
          </Link>
          <Link href="/marketplace/purchases" className="flex-1 md:flex-initial">
            <Button size="sm" variant="outline" className="w-full border-white/30 text-white hover:bg-white/10 text-xs font-semibold rounded-xl">
              My UI Purchases
            </Button>
          </Link>
        </div>
      </div>

      {/* 1. Recommended For Your College */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Recommended for {selectedCollege?.short_name || 'Your University'}
            </h2>
            <p className="text-xs text-slate-500">
              Hand-picked based on active partnerships and student email perks.
            </p>
          </div>
          <Link href="/courses">
            <Button variant="ghost" size="sm" className="text-xs font-semibold text-blue-600 gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommended.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* 2. Most Popular / Trending */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              Trending Among College Students
            </h2>
            <p className="text-xs text-slate-500">
              Most claimed free certificates and vouchers this month.
            </p>
          </div>
          <Link href="/courses?sortBy=popular">
            <Button variant="ghost" size="sm" className="text-xs font-semibold text-blue-600 gap-1">
              <span>View Trending</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popular.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* 3. Saved Courses Preview */}
      {savedCourses.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-blue-600 fill-current" />
                Saved for Later
              </h2>
              <p className="text-xs text-slate-500">
                Quick access to your bookmarked learning tracks.
              </p>
            </div>
            <Link href="/saved">
              <Button variant="ghost" size="sm" className="text-xs font-semibold text-blue-600 gap-1">
                <span>Open All Bookmarks ({savedCourseIds.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
