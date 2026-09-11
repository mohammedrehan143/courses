'use client';

import React from 'react';
import { Course } from '@/types/database';
import { useCollege } from '@/context/college-context';
import { trackCourseClick } from '@/lib/services/clicks';
import {
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  X,
  Mail,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatAccessType } from '@/lib/utils';

interface ClaimModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ClaimModal({ course, isOpen, onClose }: ClaimModalProps) {
  const { selectedCollege } = useCollege();

  if (!isOpen || !course) return null;

  const access = formatAccessType(course.access_type);

  const handleProceed = async () => {
    try {
      await trackCourseClick(course.id);
    } catch {
      // Ignore click logging error
    }
    window.open(course.course_url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
          <div>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2.5 ${access.badgeClass}`}>
              <Sparkles className="w-3.5 h-3.5" />
              {access.label}
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
              Unlock {course.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Offered by <span className="font-semibold text-slate-700 dark:text-slate-300">{course.provider}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-sm">
          {/* Instructions Box */}
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-blue-600" />
              College Access Verification Steps
            </h4>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {course.special_instructions ||
                `Use your university email (@${selectedCollege?.domain || 'college.edu'}) during sign up or checkout to unlock 100% free access.`}
            </p>
          </div>

          {/* Step-by-step guidance */}
          <div className="space-y-3">
            <h5 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              How to claim for free:
            </h5>
            
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center flex-shrink-0 text-[11px] mt-0.5">
                  1
                </div>
                <p>
                  Click the <strong>&quot;Continue to Provider&quot;</strong> button below to open the official course portal.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center flex-shrink-0 text-[11px] mt-0.5">
                  2
                </div>
                <p>
                  Select <strong>&quot;Sign in with University / School Account&quot;</strong> or register using your <strong>@{selectedCollege?.domain || 'college.edu'}</strong> email.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center flex-shrink-0 text-[11px] mt-0.5">
                  3
                </div>
                <p>
                  Confirm your verification email or single sign-on prompt. Once verified, the free certification & materials will be active!
                </p>
              </div>
            </div>
          </div>

          {/* Certificate details */}
          {course.certification_available && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-xs text-emerald-800 dark:text-emerald-300">
              <Award className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="font-semibold">{course.certificate_type || 'Verified Certificate Included'}</p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Includes digital credential shareable directly on LinkedIn and your resume.
                </p>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 pt-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>
              You will be redirected to the official website of {course.provider}. No payment is requested on CoSurf.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Back to Browse
          </Button>
          <Button
            size="sm"
            onClick={handleProceed}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2 shadow-sm"
          >
            <span>Continue to {course.provider}</span>
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
