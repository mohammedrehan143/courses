'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useCollege } from '@/context/college-context';
import {
  GraduationCap,
  School,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, setAdminMode } = useAuth();
  const { selectedCollege, colleges } = useCollege();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Detect matching college as user types email
  const detectedCollege = colleges.find(
    (c) => email.includes('@') && email.toLowerCase().endsWith(c.domain.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn(email);
      if (!res.success) {
        setError(res.error || 'Failed to sign in. Please verify your email.');
        return;
      }
      toast.success('Successfully signed in!');
      router.push('/dashboard');
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoStudent = async () => {
    setEmail('alex@stanford.edu');
    setPassword('demostudent123');
    setLoading(true);
    const res = await signIn('alex@stanford.edu');
    setLoading(false);
    if (res.success) {
      toast.success('Logged in as Demo Student (Alex Chen @ Stanford)!');
      router.push('/dashboard');
    }
  };

  const handleQuickDemoAdmin = async () => {
    setLoading(true);
    setAdminMode(true);
    setLoading(false);
    toast.success('Logged in as Platform Administrator!');
    router.push('/admin');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Sign In with College Email
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Access free certifications and courses personalized to your institution.
          </p>
        </div>

        {/* Quick Demo Shortcuts Banner */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Quick Demo 1-Click Testing:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickDemoStudent}
              className="py-1.5 px-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-xs font-semibold text-center transition"
            >
              🎓 Student Demo
            </button>
            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              className="py-1.5 px-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 text-xs font-semibold text-center transition"
            >
              🛡️ Admin Demo
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>College Email Address</span>
              {detectedCollege && (
                <span className="text-emerald-600 dark:text-emerald-400 text-[11px] flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> {detectedCollege.short_name} Detected
                </span>
              )}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="email"
                placeholder="name@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              e.g. alex@stanford.edu or student@mit.edu
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl py-2.5 shadow-md shadow-blue-500/20"
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </Button>
        </form>

        {/* Footer link */}
        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          New student?{' '}
          <Link href="/signup" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            Create an account with your college email
          </Link>
        </div>
      </div>
    </div>
  );
}
