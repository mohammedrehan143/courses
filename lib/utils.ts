import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AccessType, CourseLevel } from "@/types/database";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAccessType(type?: AccessType): {
  label: string;
  badgeClass: string;
  description: string;
} {
  switch (type) {
    case 'college_email':
      return {
        label: 'College Email Unlocked',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
        description: 'Unlocked by signing in with your official university .edu email',
      };
    case 'student_offer':
      return {
        label: 'Student Offer / Voucher',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
        description: 'Exclusive student discount or 100% off certification voucher',
      };
    case 'institutional_access':
      return {
        label: 'Institutional Access',
        badgeClass: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800',
        description: 'Provided through direct university campus license / SSO integration',
      };
    case 'partnership':
      return {
        label: 'Academic Partnership',
        badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800',
        description: 'Partnered directly with the university computer science / engineering department',
      };
    case 'scholarship':
      return {
        label: 'Student Scholarship',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800',
        description: 'Full tuition fee waiver for enrolled college students',
      };
    case 'completely_free':
    default:
      return {
        label: 'Completely Free',
        badgeClass: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800',
        description: 'Free to learn and free verified credential for anyone',
      };
  }
}

export function formatLevel(level: CourseLevel): {
  label: string;
  badgeClass: string;
} {
  switch (level) {
    case 'Beginner':
      return {
        label: 'Beginner',
        badgeClass: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800',
      };
    case 'Intermediate':
      return {
        label: 'Intermediate',
        badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800',
      };
    case 'Advanced':
      return {
        label: 'Advanced',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
      };
    case 'All Levels':
    default:
      return {
        label: 'All Levels',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
      };
  }
}

export function extractDomainFromEmail(email: string): string {
  if (!email || !email.includes('@')) return '';
  return email.split('@')[1].toLowerCase().trim();
}

export function validateDomainMatch(email: string, collegeDomain: string): boolean {
  const emailDomain = extractDomainFromEmail(email);
  if (!emailDomain || !collegeDomain) return false;
  const target = collegeDomain.toLowerCase().trim();
  return emailDomain === target || emailDomain.endsWith('.' + target);
}
