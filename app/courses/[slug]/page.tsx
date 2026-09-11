'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useCollege } from '@/context/college-context';
import { useAuth } from '@/context/auth-context';
import { getCourseBySlug } from '@/lib/services/courses';
import { trackCourseClick } from '@/lib/services/clicks';
import { Course } from '@/types/database';
import { formatAccessType, formatLevel } from '@/lib/utils';
import {
  Bookmark,
  Clock,
  Award,
  ExternalLink,
  ChevronLeft,
  Sparkles,
  School,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Share2,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { selectedCollege, openCollegeModal } = useCollege();
  const { savedCourseIds, toggleSaveCourse } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadCourse() {
      if (!slug) return;
      setLoading(true);
      try {
        const data = await getCourseBySlug(slug, selectedCollege?.id);
        setCourse(data);
      } catch (err) {
        console.error('Error loading course', err);
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [slug, selectedCollege]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-72 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Course Opportunity Not Found
        </h2>
        <p className="text-sm text-slate-500">
          The requested course could not be located or may have ended.
        </p>
        <Link href="/courses">
          <Button variant="outline" className="rounded-xl">
            Back to Course Discovery
          </Button>
        </Link>
      </div>
    );
  }

  const isSaved = savedCourseIds.includes(course.id);
  const access = formatAccessType(course.access_type);
  const levelInfo = formatLevel(course.level);

  const handleSaveToggle = async () => {
    setSaving(true);
    try {
      const added = await toggleSaveCourse(course.id);
      if (added) {
        toast.success('Course saved to your bookmarks!');
      } else {
        toast.info('Course removed from bookmarks');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleStartCourse = async () => {
    try {
      await trackCourseClick(course.id);
    } catch {
      // Ignore click logging errors
    }
    window.open(course.course_url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Back Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Courses</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium flex items-center gap-1.5"
            title="Share course"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button
            onClick={handleSaveToggle}
            disabled={saving}
            className={`p-2 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
              isSaved
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Hero Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
        {course.image_url && (
          <div className="relative h-64 sm:h-80 w-full overflow-hidden">
            <Image
              src={course.image_url}
              alt={course.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            
            {/* Header badges inside image overlay */}
            <div className="absolute bottom-6 left-6 right-6 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border ${access.badgeClass}`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  {access.label}
                </span>
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/10">
                  {course.provider}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold backdrop-blur-md ${levelInfo.badgeClass}`}>
                  {levelInfo.label}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {course.title}
              </h1>
            </div>
          </div>
        )}
      </div>

      {/* Main Content & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description, Learning Outcomes, Skills */}
        <div className="lg:col-span-2 space-y-8">
          {/* College-Specific Instructions Banner */}
          <div className="p-6 rounded-3xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Access Benefit for {selectedCollege ? selectedCollege.name : 'College Students'}
                </h3>
              </div>
              <button
                onClick={openCollegeModal}
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline"
              >
                Change College
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {course.special_instructions ||
                `Students with a valid university email (@${selectedCollege?.domain || 'college.edu'}) are eligible for 100% course tuition waiver and verified credential access.`}
            </p>
          </div>

          {/* About This Course */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              About this course
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {course.description}
            </p>
          </div>

          {/* What you'll learn */}
          {course.what_you_learn && course.what_you_learn.length > 0 && (
            <div className="space-y-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                What You&apos;ll Learn
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.what_you_learn.map((item, index) => (
                  <div key={index} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Gained */}
          {course.skills_gained && course.skills_gained.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Skills You Will Gain
              </h3>
              <div className="flex flex-wrap gap-2">
                {course.skills_gained.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Requirements & Eligibility */}
          <div className="space-y-3 p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
              Eligibility &amp; Verification Requirements
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {course.requirements ||
                'Active student status verified through your institution email domain or student ID.'}
            </p>
          </div>
        </div>

        {/* Right Column: CTA Box & Course Fast Facts */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-premium space-y-6 sticky top-24">
            {/* Price & Badge */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  FREE
                </span>
                <span className="text-xs text-slate-400 line-through">
                  Standard $49 - $300
                </span>
              </div>
              <p className="text-xs text-slate-500">
                100% subsidized for verified college students
              </p>
            </div>

            {/* Primary CTA */}
            <div className="space-y-2.5">
              <Button
                size="lg"
                onClick={handleStartCourse}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl gap-2 shadow-md shadow-blue-500/25"
              >
                <span>Start Course on {course.provider}</span>
                <ExternalLink className="w-4 h-4" />
              </Button>
              <p className="text-[11px] text-center text-slate-400">
                Opens official course provider in a new tab
              </p>
            </div>

            {/* Key Course Specifications */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/50">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" /> Duration
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {course.duration}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/50">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-slate-400" /> Certificate
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {course.certification_available ? 'Verified Certificate' : 'Audit Free'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/50">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <School className="w-4 h-4 text-slate-400" /> Provider
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {course.provider}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-slate-400" /> Access Type
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                  {course.access_type?.replace(/_/g, ' ') || 'Completely Free'}
                </span>
              </div>
            </div>

            {/* Disclaimer pill */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>
                CoSurf is a non-profit discovery portal. All course materials and credential awards remain under the copyright and governance of {course.provider}.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
