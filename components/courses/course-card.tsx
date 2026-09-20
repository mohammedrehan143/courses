'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Course } from '@/types/database';
import { useAuth } from '@/context/auth-context';
import { useCollege } from '@/context/college-context';
import { formatAccessType, formatLevel } from '@/lib/utils';
import {
  Bookmark,
  Clock,
  Award,
  ExternalLink,
  ChevronRight,
  Sparkles,
  School,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClaimModal } from './claim-modal';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const { savedCourseIds, toggleSaveCourse } = useAuth();
  const { selectedCollege } = useCollege();
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const isSaved = savedCourseIds.includes(course.id);
  const access = formatAccessType(course.access_type);
  const levelInfo = formatLevel(course.level);

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaving(true);
    try {
      await toggleSaveCourse(course.id);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="group relative flex flex-col rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-subtle hover:shadow-premium hover:border-[#0a192f]/30 transition-all duration-200 overflow-hidden">
        {/* Card Image Banner */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          {course.image_url ? (
            <Image
              src={course.image_url}
              alt={course.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="h-full w-full bg-[#0a192f]/5 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-[#0a192f]/40" />
            </div>
          )}

          {/* Provider pill on image */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-white text-xs font-semibold shadow-sm">
            <span>{course.provider}</span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkToggle}
            disabled={saving}
            title={isSaved ? 'Remove from saved' : 'Save course'}
            className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all shadow-sm ${
              isSaved
                ? 'bg-[#0a192f] text-white hover:bg-[#132c54] scale-105'
                : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-[#0a192f]'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          {/* Access Badge floating over image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold backdrop-blur-md border shadow-sm ${access.badgeClass}`}
            >
              <Sparkles className="w-3 h-3" />
              {access.label}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div className="space-y-2.5">
            {/* Meta Tags: Category & Level */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-semibold text-[#0a192f] dark:text-slate-200">
                {course.category}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className={`px-2 py-0.5 rounded-md border text-[11px] font-medium ${levelInfo.badgeClass}`}>
                {levelInfo.label}
              </span>
            </div>

            {/* Course Title */}
            <Link href={`/courses/${course.slug}`}>
              <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug hover:text-[#0a192f] dark:hover:text-blue-300 transition-colors line-clamp-2">
                {course.title}
              </h3>
            </Link>

            {/* Course Description */}
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {course.description}
            </p>

            {/* Specific college benefit highlight */}
            {course.special_instructions && (
              <div className="flex items-start gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                <School className="w-3.5 h-3.5 text-[#0a192f] dark:text-slate-300 flex-shrink-0 mt-0.5" />
                <span className="line-clamp-1">
                  For {selectedCollege?.short_name || 'Students'}: {course.special_instructions}
                </span>
              </div>
            )}
          </div>

          {/* Course Features Footer */}
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {course.duration}
              </span>
              {course.certification_available && (
                <span className="flex items-center gap-1 text-[#0a192f] dark:text-slate-200 font-medium">
                  <Award className="w-3.5 h-3.5" />
                  Free Certificate
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link href={`/courses/${course.slug}`} className="w-full">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-semibold gap-1 rounded-xl"
                >
                  <span>Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
              <Button
                size="sm"
                onClick={() => setClaimModalOpen(true)}
                className="w-full text-xs font-semibold bg-[#0a192f] hover:bg-[#132c54] text-white rounded-xl gap-1"
              >
                <span>Get Free</span>
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Claim Modal */}
      <ClaimModal
        course={course}
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
      />
    </>
  );
}
