'use client';

import React from 'react';
import { Workshop } from '@/types/database';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ExternalLink,
  Users,
  School,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WorkshopCardProps {
  workshop: Workshop;
}

export function WorkshopCard({ workshop }: WorkshopCardProps) {
  return (
    <div className="flex flex-col rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-subtle hover:shadow-premium hover:border-blue-300 dark:hover:border-blue-700 transition-all p-6 justify-between space-y-4">
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Badge
            variant={workshop.mode === 'In-Person' ? 'success' : workshop.mode === 'Hybrid' ? 'purple' : 'default'}
            className="text-[11px] font-semibold"
          >
            {workshop.mode} Workshop
          </Badge>
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-100 dark:border-blue-900">
            Campus Event
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
          {workshop.title}
        </h3>

        {/* Organizer */}
        <p className="text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
          <School className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
          <span>{workshop.organizer}</span>
        </p>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
          {workshop.description}
        </p>

        {/* Date, Time, Venue */}
        <div className="space-y-1.5 pt-2 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="font-semibold">{workshop.date}</span>
            {workshop.time && <span className="text-slate-400">• {workshop.time}</span>}
          </div>

          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
            <span className="text-slate-500 dark:text-slate-400 leading-tight">
              {workshop.venue}
            </span>
          </div>
        </div>

        {/* Tags */}
        {workshop.tags && workshop.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {workshop.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action CTA */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <Button
          size="sm"
          onClick={() => window.open(workshop.registration_url || 'https://bmsit.in', '_blank')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold gap-1.5 shadow-sm"
        >
          <span>Register for Workshop</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
