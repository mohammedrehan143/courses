'use client';

import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Terminal,
  FileCode,
  Sparkles,
  Bot,
  ExternalLink,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIAgentType } from '@/types/marketplace';

interface PromptViewerProps {
  productId: string;
  productTitle: string;
  promptContent: string;
  version?: string;
  activeAgent: AIAgentType;
  onAgentChange: (agent: AIAgentType) => void;
  loadingPrompt?: boolean;
}

const AGENTS: { id: AIAgentType; label: string; tag: string }[] = [
  { id: 'general', label: 'General AI Agent', tag: 'Universal' },
  { id: 'claude', label: 'Claude Code', tag: 'Anthropic CLI' },
  { id: 'cursor', label: 'Cursor Composer', tag: 'IDE' },
  { id: 'antigravity', label: 'Antigravity', tag: 'DeepMind' },
  { id: 'gemini', label: 'Gemini 2.0', tag: 'Google' },
  { id: 'codex', label: 'Codex / ChatGPT', tag: 'OpenAI' },
];

export function PromptViewer({
  productId,
  productTitle,
  promptContent,
  version = '1.0.0',
  activeAgent,
  onAgentChange,
  loadingPrompt = false,
}: PromptViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(promptContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  };

  const handleDownloadPrompt = () => {
    const filename = `${productTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-ai-prompt.md`;
    const element = document.createElement('a');
    const file = new Blob([promptContent], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md overflow-hidden">
      {/* Header Bar */}
      <div className="px-5 py-4 bg-slate-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-white">AI Implementation Package</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-medium border border-emerald-500/30">
                v{version} UNLOCKED
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Copy directly into your AI coding agent or download as a project spec.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            size="sm"
            onClick={handleCopyPrompt}
            className={`flex-1 sm:flex-initial text-xs font-semibold gap-1.5 h-9 rounded-xl transition-all ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Prompt copied ✓' : 'Copy AI Prompt'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadPrompt}
            className="flex-1 sm:flex-initial text-xs font-semibold gap-1.5 h-9 rounded-xl border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .md</span>
          </Button>
        </div>
      </div>

      {/* Target Agent Selector Navigation Tabs */}
      <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1">
          <Bot className="w-3 h-3 text-indigo-500" /> Target Agent:
        </span>

        {AGENTS.map((agent) => (
          <button
            key={agent.id}
            onClick={() => onAgentChange(agent.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeAgent === agent.id
                ? 'bg-[#0a192f] text-white shadow-xs font-semibold'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            <span>{agent.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
              activeAgent === agent.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}>
              {agent.tag}
            </span>
          </button>
        ))}
      </div>

      {/* Content Preview Container */}
      <div className="relative p-5 max-h-[500px] overflow-y-auto bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed scrollbar-thin">
        {loadingPrompt ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-400 text-xs font-sans">
              Formatting prompt for {activeAgent}...
            </p>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap font-mono text-xs selection:bg-indigo-500/30">
            {promptContent}
          </pre>
        )}
      </div>

      {/* Usage Guide Footer */}
      <div className="p-4 bg-slate-900 text-slate-400 text-xs border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            Paste this prompt into your coding agent's terminal or chat prompt to generate the full implementation.
          </span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono">
          {promptContent.length.toLocaleString()} characters · {promptContent.split(/\s+/).length} words
        </div>
      </div>
    </div>
  );
}
