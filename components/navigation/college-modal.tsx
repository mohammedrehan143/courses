'use client';

import React, { useState } from 'react';
import { useCollege } from '@/context/college-context';
import { Search, School, Check, MapPin, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export function CollegeModal() {
  const { colleges, selectedCollege, setSelectedCollege, isCollegeModalOpen, closeCollegeModal } = useCollege();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isCollegeModalOpen) return null;

  const filteredColleges = colleges.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.short_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.location && c.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelect = (college: (typeof colleges)[0]) => {
    setSelectedCollege(college);
    closeCollegeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Multi-College Verification</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Select Your College
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Choose your university to unlock exclusive course waivers, certifications, and licenses tied to your student email.
            </p>
          </div>
          <button
            onClick={closeCollegeModal}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by university name or domain (e.g. stanford.edu)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-slate-900 dark:text-white"
              autoFocus
            />
          </div>
        </div>

        {/* College List */}
        <div className="p-4 overflow-y-auto space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800/50 flex-1">
          {filteredColleges.length === 0 ? (
            <div className="text-center py-12 px-4">
              <School className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No universities found</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
                Don&apos;t worry! More universities are being added weekly. You can browse completely free courses in the meantime.
              </p>
            </div>
          ) : (
            filteredColleges.map((college) => {
              const isSelected = selectedCollege?.id === college.id;
              return (
                <div
                  key={college.id}
                  onClick={() => handleSelect(college)}
                  className={`pt-2.5 first:pt-0 cursor-pointer group`}
                >
                  <div
                    className={`flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                      isSelected
                        ? 'bg-blue-50/80 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 shadow-sm'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative flex-shrink-0 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                        {college.logo_url ? (
                          <Image
                            src={college.logo_url}
                            alt={college.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <School className="w-6 h-6 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {college.name}
                          </h4>
                          {isSelected && (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-100/70 dark:bg-blue-900/60 px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3" /> Active
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                            @{college.domain}
                          </span>
                          {college.location && (
                            <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {college.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <Badge variant="secondary" className="font-medium text-xs">
                        {college.course_count || 5}+ unlocked
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Supported domains: @*.edu, @*.ac.in, etc.</span>
          <Button variant="ghost" size="sm" onClick={closeCollegeModal}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
