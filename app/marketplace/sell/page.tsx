'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UI_CATEGORIES } from '@/lib/mock-marketplace';
import { UICategory, UITechnology } from '@/types/marketplace';
import {
  Upload,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Code2,
  FileCode,
  Layers,
  ArrowLeft,
  DollarSign,
} from 'lucide-react';

const AVAILABLE_TECHS: UITechnology[] = [
  'React',
  'Next.js',
  'Vue',
  'HTML/CSS',
  'Tailwind',
  'TypeScript',
  'Shadcn UI',
  'Supabase',
  'Framer Motion',
];

export default function SellYourUIPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'SaaS' as UICategory,
    price: '299',
    preview_image: '',
    live_demo_url: '',
    prompt_content: '',
    license_type: 'Commercial',
    creator_name: user?.name || '',
    creator_email: user?.email || '',
    technologies: ['React', 'Tailwind', 'TypeScript'] as UITechnology[],
    confirmed_ownership: false,
  });

  const handleTechToggle = (tech: UITechnology) => {
    setFormData((prev) => {
      const exists = prev.technologies.includes(tech);
      const updated = exists
        ? prev.technologies.filter((t) => t !== tech)
        : [...prev.technologies, tech];
      return { ...prev, technologies: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.description || !formData.preview_image || !formData.prompt_content) {
      setError('Please fill in all required fields (title, description, preview image URL, and AI implementation prompt).');
      return;
    }

    if (!formData.confirmed_ownership) {
      setError('You must confirm ownership or distribution rights for the submitted design.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/marketplace/creator/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price) || 0,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Submission failed.');
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Submission failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Navigation Breadcrumb */}
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </Link>

        {/* Header Hero */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
            <Upload className="w-3.5 h-3.5" />
            <span>Creator Hub</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Have a great UI? Sell it to other developers.
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            Package your developer-grade designs with structured AI implementation prompts. Earn 85% revenue share on every sale while helping developers build modern software faster.
          </p>
        </div>

        {submitted ? (
          /* Submission Success State */
          <div className="rounded-3xl border border-emerald-200 dark:border-emerald-900/60 bg-white dark:bg-slate-900 p-8 sm:p-10 text-center space-y-5 shadow-lg">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Submission Received!
              </h2>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-xs font-semibold border border-amber-200 dark:border-amber-800">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Status: Pending Review</span>
              </div>
              <p className="text-xs text-slate-500 max-w-md mx-auto pt-2">
                Our developer review team will test your live demo and review your AI implementation prompt structure. You will receive an email update within 24-48 hours.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link href="/marketplace/creator">
                <Button className="bg-[#0a192f] hover:bg-[#132c54] text-white text-xs font-semibold rounded-xl">
                  Go to Creator Dashboard
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    title: '',
                    description: '',
                    category: 'SaaS',
                    price: '299',
                    preview_image: '',
                    live_demo_url: '',
                    prompt_content: '',
                    license_type: 'Commercial',
                    creator_name: user?.name || '',
                    creator_email: user?.email || '',
                    technologies: ['React', 'Tailwind', 'TypeScript'],
                    confirmed_ownership: false,
                  });
                }}
                className="text-xs font-semibold rounded-xl"
              >
                Submit Another UI
              </Button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-premium space-y-8"
          >
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Section 1: UI Details */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>1. UI Package Information</span>
              </h2>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  UI Name / Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Modern Analytics & Observability Dashboard"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Describe key workflows, density, features, and target developers..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as UICategory })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a192f]"
                  >
                    {UI_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Price (₹ INR, set 0 for Free) *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="299"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Technology & Assets */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-600" />
                <span>2. Technologies & Media</span>
              </h2>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Tech Stack (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_TECHS.map((tech) => {
                    const selected = formData.technologies.includes(tech);
                    return (
                      <button
                        key={tech}
                        type="button"
                        onClick={() => handleTechToggle(tech)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                          selected
                            ? 'bg-[#0a192f] text-white font-semibold'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {tech}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Preview Image URL *
                </label>
                <Input
                  value={formData.preview_image}
                  onChange={(e) => setFormData({ ...formData, preview_image: e.target.value })}
                  placeholder="https://images.unsplash.com/... or hosted screenshot URL"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Live Demo URL (Optional)
                </label>
                <Input
                  value={formData.live_demo_url}
                  onChange={(e) => setFormData({ ...formData, live_demo_url: e.target.value })}
                  placeholder="https://your-demo.vercel.app"
                />
              </div>
            </div>

            {/* Section 3: AI Implementation Prompt (Core Feature) */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-emerald-600" />
                  <span>3. Structured AI Implementation Prompt *</span>
                </h2>
                <p className="text-xs text-slate-500">
                  This is the secret package unlocked after purchase. Provide comprehensive instructions for Claude Code, Cursor, Antigravity, and Codex.
                </p>
              </div>

              <textarea
                value={formData.prompt_content}
                onChange={(e) => setFormData({ ...formData, prompt_content: e.target.value })}
                rows={8}
                placeholder={`PROJECT OBJECTIVE: ...\n\nTECH STACK: Next.js 15, React 19, Tailwind CSS...\n\nDESIGN SYSTEM: Background #0a0f1d, card surfaces...\n\nCOMPONENTS TO IMPLEMENT: ...\n\nRESPONSIVE BEHAVIOR: ...`}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 font-mono text-xs text-slate-300 p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Section 4: Creator Information & Confirmation */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>4. Creator & Ownership Verification</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Display / Creator Name *
                  </label>
                  <Input
                    value={formData.creator_name}
                    onChange={(e) => setFormData({ ...formData, creator_name: e.target.value })}
                    placeholder="Your Name or Studio"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Creator Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.creator_email}
                    onChange={(e) => setFormData({ ...formData, creator_email: e.target.value })}
                    placeholder="you@domain.com"
                    required
                  />
                </div>
              </div>

              {/* Ownership Checkbox */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="confirm_ownership"
                  checked={formData.confirmed_ownership}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmed_ownership: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 rounded text-[#0a192f] focus:ring-[#0a192f] cursor-pointer"
                  required
                />
                <label
                  htmlFor="confirm_ownership"
                  className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed cursor-pointer"
                >
                  I confirm that I own or hold valid legal rights/licenses to distribute and sell all designs, code structures, and assets included in this submission. I understand submissions are reviewed before publishing.
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0a192f] hover:bg-[#132c54] text-white font-bold h-12 rounded-xl text-sm shadow-md"
              >
                {loading ? 'Submitting Package for Review...' : 'Submit UI for Review'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
