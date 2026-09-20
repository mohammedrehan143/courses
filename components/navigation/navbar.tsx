'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCollege } from '@/context/college-context';
import { useAuth } from '@/context/auth-context';
import {
  GraduationCap,
  Bookmark,
  Compass,
  LayoutGrid,
  Menu,
  X,
  ChevronDown,
  ShieldAlert,
  User,
  LogOut,
  Sparkles,
  School,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CollegeModal } from './college-modal';

export function Navbar() {
  const pathname = usePathname();
  const { selectedCollege, openCollegeModal } = useCollege();
  const { user, isAdmin, savedCourseIds, signOut, setAdminMode } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/courses', label: 'Explore Courses', icon: Compass },
    { href: '/categories', label: 'Categories', icon: LayoutGrid },
    {
      href: '/saved',
      label: 'Saved',
      icon: Bookmark,
      count: savedCourseIds.length,
    },
    { href: '/dashboard', label: 'Dashboard' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#0a192f] flex items-center justify-center text-white shadow-md shadow-slate-900/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  CoSurf <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md bg-[#0a192f] text-white">FREE</span>
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                  College Course Discovery
                </span>
              </div>
            </Link>

            {/* Current College Selector Button */}
            <button
              onClick={openCollegeModal}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 text-xs font-medium text-slate-700 dark:text-slate-300 transition"
              title="Click to change selected university"
            >
              <School className="w-3.5 h-3.5 text-[#0a192f] dark:text-slate-200" />
              <span className="font-semibold text-slate-900 dark:text-white">
                {selectedCollege ? selectedCollege.short_name : 'Select College'}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                @{selectedCollege?.domain}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    active
                      ? 'text-[#0a192f] bg-slate-100 font-bold dark:text-white dark:bg-slate-800'
                      : 'text-slate-600 hover:text-[#0a192f] hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{link.label}</span>
                  {link.count !== undefined && link.count > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#0a192f] text-white">
                      {link.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-2.5">
            {/* Admin toggle shortcut */}
            <Button
              variant={isAdmin ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAdminMode(!isAdmin)}
              className={`text-xs gap-1.5 ${isAdmin ? 'bg-[#0a192f] text-white' : ''}`}
              title="Quick switch to test Admin Dashboard"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'Admin Mode' : 'Admin Demo'}</span>
            </Button>

            {isAdmin && (
              <Link href="/admin">
                <Button size="sm" variant="outline" className="text-xs">
                  Admin Panel
                </Button>
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-2 text-xs">
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-[#0a192f] flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-medium hidden xl:inline-block max-w-[100px] truncate">
                      {user.name}
                    </span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={signOut}
                  title="Sign out"
                  className="text-slate-400 hover:text-rose-600"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-[#0a192f] hover:bg-[#132c54] text-white">
                    Get Free Courses
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={openCollegeModal}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300"
            >
              <School className="w-3.5 h-3.5 text-[#0a192f]" />
              <span>{selectedCollege?.short_name || 'Select'}</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
            {/* Current college info */}
            <div
              onClick={() => {
                setMobileMenuOpen(false);
                openCollegeModal();
              }}
              className="p-3 bg-[#0a192f]/5 dark:bg-slate-800/80 rounded-xl border border-[#0a192f]/10 dark:border-slate-700 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <School className="w-4 h-4 text-[#0a192f] dark:text-blue-300" />
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    {selectedCollege?.name}
                  </p>
                  <p className="text-[11px] text-slate-500">@{selectedCollege?.domain}</p>
                </div>
              </div>
              <span className="text-xs text-[#0a192f] dark:text-blue-300 font-semibold">Change</span>
            </div>

            <nav className="space-y-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
                      active
                        ? 'bg-[#0a192f] text-white shadow-sm'
                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.count !== undefined && link.count > 0 && (
                      <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                        active ? 'bg-white text-[#0a192f]' : 'bg-[#0a192f] text-white'
                      }`}>
                        {link.count}
                      </span>
                    )}
                  </Link>
                );
              })}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-amber-600 hover:bg-amber-50 dark:text-amber-400"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            </nav>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setAdminMode(!isAdmin);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-xs"
              >
                Toggle Admin Role ({isAdmin ? 'Admin' : 'Student'})
              </Button>
              {user ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-xs"
                >
                  Sign Out
                </Button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* College Selection Modal Component */}
      <CollegeModal />
    </>
  );
}
