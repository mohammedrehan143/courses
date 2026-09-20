'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Upload, Layers, Terminal, CheckCircle2, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MarketplaceHeroProps {
  onExploreClick?: () => void;
}

export function MarketplaceHero({ onExploreClick }: MarketplaceHeroProps) {
  const supportedAgents = [
    { name: 'Claude Code', highlight: 'border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400' },
    { name: 'Cursor', highlight: 'border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400' },
    { name: 'Antigravity', highlight: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400' },
    { name: 'Gemini', highlight: 'border-purple-500/20 bg-purple-500/5 text-purple-600 dark:text-purple-400' },
    { name: 'Codex', highlight: 'border-sky-500/20 bg-sky-500/5 text-sky-600 dark:text-sky-400' },
  ];

  return (
    <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-slate-50 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 py-16 sm:py-24">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/5 dark:bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-subtle text-xs font-semibold text-slate-800 dark:text-slate-200">
            <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Developer UI Marketplace</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span className="text-slate-500 dark:text-slate-400 font-normal">AI Build Packages</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            Beautiful UI.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 dark:from-blue-400 dark:via-indigo-300 dark:to-cyan-400">
              Built for AI.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Discover production-ready interfaces for your projects and turn them into working websites with AI coding agents.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Button
              size="lg"
              onClick={onExploreClick}
              className="bg-[#0a192f] hover:bg-[#132c54] text-white shadow-md gap-2 text-sm font-semibold rounded-xl px-6 h-12"
            >
              <span>Explore UI</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Link href="/marketplace/sell">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 text-sm font-semibold rounded-xl px-6 h-12 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600"
              >
                <Upload className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span>Sell Your UI</span>
              </Button>
            </Link>

            <Link href="/marketplace/purchases">
              <Button
                variant="ghost"
                size="lg"
                className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white h-12"
              >
                My Purchases
              </Button>
            </Link>
          </div>

          {/* Workflow Value Proposition Bar */}
          <div className="pt-6 flex items-center justify-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <Layers className="w-4 h-4 text-blue-500" />
              Designed UI
            </span>
            <span>→</span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <Terminal className="w-4 h-4 text-indigo-500" />
              Structured AI Prompt
            </span>
            <span>→</span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Working Implementation
            </span>
          </div>

          {/* Supported Agents Ticker */}
          <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 dark:text-slate-500 mr-1">Optimized for:</span>
            {supportedAgents.map((agent) => (
              <span
                key={agent.name}
                className={`px-2.5 py-1 rounded-md border text-[11px] font-mono font-medium ${agent.highlight}`}
              >
                {agent.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
