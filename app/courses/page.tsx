'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCollege } from '@/context/college-context';
import { getCourses } from '@/lib/services/courses';
import { getWorkshopsForCollege } from '@/lib/services/workshops';
import { Course, Workshop, FilterOptions } from '@/types/database';
import { MOCK_COURSES, MOCK_WORKSHOPS } from '@/lib/mock-data';
import { CourseGrid } from '@/components/courses/course-grid';
import { WorkshopCard } from '@/components/courses/workshop-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  School,
  Sparkles,
  BookOpen,
  Calendar,
  Award,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';

export default function CoursesPage() {
  const { selectedCollege, openCollegeModal } = useCollege();

  // Active view tab: courses or campus workshops
  const [activeTab, setActiveTab] = useState<'courses' | 'workshops'>('courses');

  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [workshops, setWorkshops] = useState<Workshop[]>(MOCK_WORKSHOPS);
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [certificationFilter, setCertificationFilter] = useState<'all' | 'certified' | 'uncertified'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'title_asc'>('newest');

  // Sync tab with URL if present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'workshops' || tabParam === 'courses') {
        setActiveTab(tabParam);
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setLoading(true);
      try {
        const [courseRes, workshopRes] = await Promise.all([
          getCourses({
            collegeId: selectedCollege?.id,
            limit: 50,
          }),
          getWorkshopsForCollege(selectedCollege?.id),
        ]);
        if (isMounted) {
          setCourses(courseRes?.courses || []);
          setWorkshops(workshopRes || []);
        }
      } catch (err) {
        console.error('Error fetching data', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [selectedCollege]);

  // Filter courses
  const filteredCourses = courses.filter((c) => {
    // Search query
    const matchesSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.provider.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase()) ||
      c.skills_gained?.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    // Certification status (certified vs uncertified)
    const matchesCert =
      certificationFilter === 'all'
        ? true
        : certificationFilter === 'certified'
        ? c.certification_available
        : !c.certification_available;

    // Category
    const matchesCat =
      categoryFilter === 'all' ||
      c.category.toLowerCase().includes(categoryFilter.toLowerCase());

    // Level
    const matchesLvl =
      levelFilter === 'all' || c.level.toLowerCase() === levelFilter.toLowerCase();

    return matchesSearch && matchesCat && matchesLvl;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === 'popular') return (b.click_count || 0) - (a.click_count || 0);
    if (sortBy === 'title_asc') return a.title.localeCompare(b.title);
    return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
  });

  // Filter workshops
  const filteredWorkshops = workshops.filter((w) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      w.title.toLowerCase().includes(q) ||
      w.organizer.toLowerCase().includes(q) ||
      w.venue.toLowerCase().includes(q) ||
      w.tags?.some((t) => t.toLowerCase().includes(q))
    );
  });

  const categories = [
    { label: 'All Disciplines', value: 'all' },
    { label: 'Cloud Computing & AI', value: 'cloud' },
    { label: 'Developer Tools & IDEs', value: 'dev' },
    { label: 'Data Science & Analytics', value: 'data' },
    { label: 'Full-Stack & Web Development', value: 'web' },
    { label: 'Academic & National Programs', value: 'academic' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* College Info Header Banner */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#0a192f] transition mr-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change College</span>
            </Link>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#0a192f] text-white">
              Active Campus
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <School className="w-7 h-7 text-[#0a192f] dark:text-slate-200 flex-shrink-0" />
            <span>{selectedCollege ? selectedCollege.name : 'Select a College'}</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span>Verified domain:</span>
            <span className="font-mono font-semibold text-[#0a192f] dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              @{selectedCollege?.domain || 'college.edu'}
            </span>
            <span>•</span>
            <span className="text-[#0a192f] dark:text-slate-300 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Direct Access Unlocked
            </span>
          </p>
        </div>

        <Button
          onClick={openCollegeModal}
          variant="outline"
          size="sm"
          className="rounded-2xl text-xs font-bold border-slate-300 text-[#0a192f] hover:bg-slate-50 dark:border-slate-700 dark:text-white"
        >
          Switch University
        </Button>
      </div>

      {/* Main Tabs: Courses vs Campus Workshops */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'courses'
                ? 'bg-[#0a192f] text-white shadow-md shadow-slate-900/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Course Menu ({filteredCourses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('workshops')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all relative ${
              activeTab === 'workshops'
                ? 'bg-[#0a192f] text-white shadow-md shadow-slate-900/20'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Campus Workshops ({filteredWorkshops.length})</span>
            {filteredWorkshops.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#0a192f] animate-pulse" />
            )}
          </button>
        </div>

        {/* Status stats */}
        <span className="text-xs text-slate-500 font-medium">
          Showing {activeTab === 'courses' ? `${sortedCourses.length} courses` : `${filteredWorkshops.length} workshops`}
        </span>
      </div>

      {/* Search & Comprehensive Filters Bar */}
      <div className="space-y-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm">
        {/* Search input */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={
              activeTab === 'courses'
                ? 'Search by title, AWS, GitHub, Microsoft, Google, Python, AI...'
                : 'Search workshops by topic, venue, organizer...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0a192f] text-slate-900 dark:text-white"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {activeTab === 'courses' && (
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {/* Certification Status Filter (Certified vs Uncertified) */}
            <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs">
              <button
                onClick={() => setCertificationFilter('all')}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  certificationFilter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setCertificationFilter('certified')}
                className={`px-3 py-1 rounded-lg font-medium transition flex items-center gap-1 ${
                  certificationFilter === 'certified'
                    ? 'bg-white dark:bg-slate-700 text-[#0a192f] dark:text-slate-100 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-[#0a192f] dark:text-slate-200" />
                <span>Certified Only</span>
              </button>
              <button
                onClick={() => setCertificationFilter('uncertified')}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  certificationFilter === 'uncertified'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Audit Only
              </button>
            </div>

            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-700 dark:text-slate-300 font-medium focus:ring-2 focus:ring-[#0a192f]"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            {/* Level Dropdown */}
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-700 dark:text-slate-300 font-medium focus:ring-2 focus:ring-[#0a192f]"
            >
              <option value="all">All Difficulty Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="all levels">All Levels</option>
            </select>

            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-slate-700 dark:text-slate-300 font-medium focus:ring-2 focus:ring-[#0a192f] ml-auto"
            >
              <option value="newest">Featured &amp; Recommended</option>
              <option value="popular">Most Popular (By Clicks)</option>
              <option value="title_asc">Alphabetical (A - Z)</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: COURSES GRID */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          <CourseGrid
            courses={sortedCourses}
            loading={loading}
            onResetFilters={() => {
              setSearch('');
              setCertificationFilter('all');
              setCategoryFilter('all');
              setLevelFilter('all');
            }}
          />
        </div>
      )}

      {/* TAB 2: CAMPUS WORKSHOPS */}
      {activeTab === 'workshops' && (
        <div className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-60 w-full rounded-3xl" />
              ))}
            </div>
          ) : filteredWorkshops.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
              <Calendar className="w-12 h-12 mx-auto text-slate-300" />
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                No workshops matching your search for {selectedCollege?.short_name || 'your college'}
              </h3>
              <p className="text-xs text-slate-500">
                Check back regularly for department announcements and hackathon schedules.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredWorkshops.map((workshop) => (
                <WorkshopCard key={workshop.id} workshop={workshop} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
