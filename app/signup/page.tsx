'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useCollege } from '@/context/college-context';
import { validateDomainMatch } from '@/lib/utils';
import {
  GraduationCap,
  School,
  Mail,
  Lock,
  User,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { colleges, selectedCollege } = useCollege();

  const [collegeId, setCollegeId] = useState(selectedCollege?.id || colleges[0]?.id || '');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeCollege = colleges.find((c) => c.id === collegeId) || colleges[0];

  // Domain match check
  const isDomainValid = email.includes('@') && activeCollege ? validateDomainMatch(email, activeCollege.domain) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isDomainValid === false) {
      setError(`Email must belong to ${activeCollege?.name} (ending with @${activeCollege?.domain})`);
      return;
    }

    setLoading(true);
    try {
      const res = await signUp(name, email, collegeId);
      if (!res.success) {
        setError(res.error || 'Failed to create student account.');
        return;
      }
      toast.success('Account created! Welcome to CoSurf.');
      router.push('/dashboard');
    } catch (err) {
      setError('An unexpected error occurred during signup.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Create Student Account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Join thousands of college students unlocking zero-cost verified courses.
          </p>
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
          {/* Select College */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-blue-600" />
              <span>Select Your College / University</span>
            </label>
            <select
              value={collegeId}
              onChange={(e) => setCollegeId(e.target.value)}
              className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              required
            >
              {colleges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (@{c.domain})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400">
              Only courses verified for this campus will be unlocked.
            </p>
          </div>

          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="e.g. Alex Chen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="pl-10"
              />
            </div>
          </div>

          {/* College Email */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Official College Email
              </label>
              {isDomainValid === true && (
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Domain Verified
                </span>
              )}
              {isDomainValid === false && (
                <span className="text-[11px] font-semibold text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Must end in @{activeCollege?.domain}
                </span>
              )}
            </div>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="email"
                placeholder={`yourname@${activeCollege?.domain || 'college.edu'}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`pl-10 ${
                  isDomainValid === false ? 'border-rose-400 focus-visible:ring-rose-500' : ''
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Required for institutional partner voucher waivers.
            </p>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
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
            {loading ? 'Creating Account...' : 'Create Student Account'}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
