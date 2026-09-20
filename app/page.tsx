'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCollege } from '@/context/college-context';
import { College } from '@/types/database';
import {
  School,
  Search,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Check,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const router = useRouter();
  const { colleges, selectedCollege, setSelectedCollege } = useCollege();

  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedCollege, setHighlightedCollege] = useState<College | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Filter colleges based on user input
  const filteredColleges = colleges.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      c.name.toLowerCase().includes(q) ||
      c.short_name.toLowerCase().includes(q) ||
      c.domain.toLowerCase().includes(q) ||
      (c.location && c.location.toLowerCase().includes(q))
    );
  });

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (college: College) => {
    setSelectedCollege(college);
    setHighlightedCollege(college);
    setSearchQuery(college.name);
    setIsOpen(false);
  };

  const handleProceed = () => {
    const target =
      highlightedCollege ||
      (searchQuery.trim() && filteredColleges.length > 0 ? filteredColleges[0] : null) ||
      selectedCollege ||
      colleges[0];

    if (target) {
      setSelectedCollege(target);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && filteredColleges.length > 0) {
        handleSelect(filteredColleges[0]);
        router.push('/courses');
      } else {
        handleProceed();
        router.push('/courses');
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="w-full max-w-2xl text-center space-y-8">
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0a192f] dark:text-slate-200 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#0a192f] animate-pulse" />
          <span>CoSurf • College Opportunities &amp; Campus Workshops</span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Discover Free Courses for{' '}
            <span className="gradient-text">Your College</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            Select or search your college to unlock free certified courses, exam vouchers, and upcoming campus workshops.
          </p>
        </div>

        {/* Single Text Box & Dropdown Combo */}
        <div className="max-w-xl mx-auto space-y-4 text-left" ref={containerRef}>
          <div className="relative">
            {/* Input Box with Icons */}
            <div className="relative flex items-center">
              <School className="absolute left-4 w-5 h-5 text-[#0a192f] dark:text-slate-300 pointer-events-none" />
              <input
                type="text"
                placeholder="Search or select your college (e.g. BMSIT, Stanford, MIT)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => {
                  setIsOpen(true);
                }}
                onClick={() => {
                  setIsOpen(true);
                }}
                onKeyDown={handleKeyDown}
                className="w-full pl-12 pr-12 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus:border-[#0a192f] rounded-2xl text-sm font-medium focus:outline-none shadow-lg shadow-slate-100 dark:shadow-none text-slate-900 dark:text-white transition"
              />
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="Toggle college suggestions"
              >
                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Dropdown Suggestions List */}
            {isOpen && (
              <div className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-72 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 pt-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                  <span>Suggested Colleges</span>
                  <span>Click to Explore</span>
                </div>

                {filteredColleges.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No matching college found. Try typing &quot;BMSIT&quot; or &quot;Stanford&quot;.
                  </div>
                ) : (
                  <div className="p-1.5 space-y-1">
                    {filteredColleges.map((college) => {
                      const isSelected =
                        (selectedCollege && selectedCollege.id === college.id) ||
                        (highlightedCollege && highlightedCollege.id === college.id);
                      const isBMSIT = college.short_name === 'BMSIT';
                      return (
                        <Link
                          key={college.id}
                          href="/courses"
                          onClick={() => handleSelect(college)}
                          className={`px-4 py-3 rounded-xl cursor-pointer flex items-center justify-between text-xs transition block ${
                            isSelected
                              ? 'bg-[#0a192f] text-white font-semibold'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                {college.name}
                              </span>
                              {isBMSIT ? (
                                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${isSelected ? 'bg-white text-[#0a192f]' : 'bg-[#0a192f] text-white'}`}>
                                  BMSIT • Featured
                                </span>
                              ) : (
                                <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                                  {college.short_name}
                                </span>
                              )}
                            </div>
                            <div className={`flex items-center gap-2 text-[11px] ${isSelected ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                              <span className="font-mono">@{college.domain}</span>
                              {college.location && <span>• {college.location}</span>}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`text-[11px] font-medium hidden sm:inline ${isSelected ? 'text-white' : 'text-[#0a192f] dark:text-blue-300'}`}>
                              View 13 Courses →
                            </span>
                            {isSelected && (
                              <Check className="w-4 h-4 text-white flex-shrink-0" />
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Primary Submit Button */}
          <Link href="/courses" onClick={handleProceed} className="block w-full">
            <Button
              type="button"
              size="lg"
              className="w-full bg-[#0a192f] hover:bg-[#132c54] text-white font-bold rounded-2xl py-4 text-sm shadow-md shadow-slate-900/20 gap-2 cursor-pointer"
            >
              <span>
                {highlightedCollege
                  ? `Explore Courses & Workshops for ${highlightedCollege.short_name}`
                  : searchQuery.trim() && filteredColleges.length > 0
                  ? `Explore Courses for ${filteredColleges[0].short_name}`
                  : selectedCollege
                  ? `Explore Courses for ${selectedCollege.short_name}`
                  : 'Explore Courses & Campus Workshops'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          {/* Quick info under selector */}
          <div className="flex items-center justify-center gap-6 text-[11px] text-slate-500 pt-2">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-[#0a192f]" />
              13 Verified Free Courses
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#0a192f]" />
              Live Campus Workshops
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
