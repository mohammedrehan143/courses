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
        badgeClass: 'bg-[#0a192f] text-white border-transparent',
        description: 'Unlocked by signing in with your official university .edu email',
      };
    case 'student_offer':
      return {
        label: 'Student Offer / Voucher',
        badgeClass: 'bg-[#0a192f]/10 text-[#0a192f] border-[#0a192f]/20',
        description: 'Exclusive student discount or 100% off certification voucher',
      };
    case 'institutional_access':
      return {
        label: 'Institutional Access',
        badgeClass: 'bg-[#0a192f] text-white border-transparent',
        description: 'Provided through direct university campus license / SSO integration',
      };
    case 'partnership':
      return {
        label: 'Academic Partnership',
        badgeClass: 'bg-[#0a192f]/10 text-[#0a192f] border-[#0a192f]/20',
        description: 'Partnered directly with the university computer science / engineering department',
      };
    case 'scholarship':
      return {
        label: 'Student Scholarship',
        badgeClass: 'bg-[#0a192f] text-white border-transparent',
        description: 'Full tuition fee waiver for enrolled college students',
      };
    case 'completely_free':
    default:
      return {
        label: 'Completely Free',
        badgeClass: 'bg-white text-[#0a192f] border-[#0a192f]/30',
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
        badgeClass: 'bg-slate-100 text-[#0a192f] border-slate-200',
      };
    case 'Intermediate':
      return {
        label: 'Intermediate',
        badgeClass: 'bg-[#0a192f]/10 text-[#0a192f] border-[#0a192f]/20',
      };
    case 'Advanced':
      return {
        label: 'Advanced',
        badgeClass: 'bg-[#0a192f] text-white border-transparent',
      };
    case 'All Levels':
    default:
      return {
        label: 'All Levels',
        badgeClass: 'bg-slate-100 text-[#0a192f] border-slate-200',
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
