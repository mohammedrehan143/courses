import React from 'react';
import Link from 'next/link';
import { GraduationCap, ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand column */}
        <div className="md:col-span-1 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-bold text-base text-slate-900 dark:text-white">
              CoSurf Free
            </span>
          </div>
          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Empowering college students worldwide to discover and unlock zero-tuition online courses, industry certifications, and exam vouchers through their university emails.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Free & Verified Student Offers</span>
          </div>
        </div>

        {/* Discovery Links */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
            Discovery
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/courses" className="hover:text-blue-600 transition">
                All Free Courses
              </Link>
            </li>
            <li>
              <Link href="/courses?level=Beginner" className="hover:text-blue-600 transition">
                Beginner Friendly Paths
              </Link>
            </li>
            <li>
              <Link href="/courses?certificationOnly=true" className="hover:text-blue-600 transition">
                Free Certified Courses
              </Link>
            </li>
            <li>
              <Link href="/courses?accessType=college_email" className="hover:text-blue-600 transition">
                Unlocked via College Email
              </Link>
            </li>
            <li>
              <Link href="/saved" className="hover:text-blue-600 transition">
                My Bookmarked Courses
              </Link>
            </li>
            <li className="pt-1.5 border-t border-slate-200/60 dark:border-slate-800">
              <Link href="/marketplace" className="hover:text-blue-600 font-medium transition text-blue-600 dark:text-blue-400">
                UI Marketplace (AI Prompts)
              </Link>
            </li>
            <li>
              <Link href="/marketplace/sell" className="hover:text-blue-600 transition">
                Sell Your UI
              </Link>
            </li>
            <li>
              <Link href="/marketplace/purchases" className="hover:text-blue-600 transition">
                My UI Purchases
              </Link>
            </li>
          </ul>
        </div>

        {/* Top Categories */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
            Top Categories
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/courses?category=AI+%26+Machine+Learning" className="hover:text-blue-600 transition">
                Artificial Intelligence & ML
              </Link>
            </li>
            <li>
              <Link href="/courses?category=Cloud+Computing" className="hover:text-blue-600 transition">
                Cloud Computing (AWS / GCP / Azure)
              </Link>
            </li>
            <li>
              <Link href="/courses?category=Data+Science+%26+Analytics" className="hover:text-blue-600 transition">
                Data Science & Analytics
              </Link>
            </li>
            <li>
              <Link href="/courses?category=Cybersecurity" className="hover:text-blue-600 transition">
                Cybersecurity & Threat Defense
              </Link>
            </li>
            <li>
              <Link href="/courses?category=Web+Development" className="hover:text-blue-600 transition">
                Full-Stack Web Development
              </Link>
            </li>
          </ul>
        </div>

        {/* University Partnerships & Legal */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
            For Universities
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
            Want your college or educational portal featured for your enrolled student body?
          </p>
          <div className="space-y-2 text-xs">
            <Link href="/admin" className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1">
              Admin & Faculty Portal <ExternalLink className="w-3 h-3" />
            </Link>
            <p className="text-[11px] text-slate-400">
              Multi-college institutional mapping with domain-level single sign-on verification.
            </p>
          </div>
        </div>
      </div>

      {/* Product Principle & Disclaimer */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 space-y-2">
        <p>
          <strong>Notice & Attribution:</strong> CoSurf is a student discovery aggregator. We do not host, sell, or claim ownership over any third-party course materials. All trademarks, certifications, company names, and logos are property of their respective creators (such as Google, IBM, Harvard University, Microsoft, AWS, Cisco, and Coursera).
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
          <span>&copy; {new Date().getFullYear()} CoSurf. Built for students worldwide.</span>
          <span className="flex items-center gap-1">
            Engineered with Next.js, Tailwind CSS & Supabase
          </span>
        </div>
      </div>
    </footer>
  );
}
