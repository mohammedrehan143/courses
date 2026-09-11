'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student } from '@/types/database';
import { useCollege } from './college-context';
import { verifyEmailForCollege } from '@/lib/services/auth';
import { saveCourse, unsaveCourse } from '@/lib/services/bookmarks';
import { createClient } from '@/lib/supabase/client';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
}

interface AuthContextType {
  user: AuthUser | null;
  student: Student | null;
  isAdmin: boolean;
  savedCourseIds: string[];
  toggleSaveCourse: (courseId: string) => Promise<boolean>;
  signIn: (email: string, role?: 'student' | 'admin') => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, collegeId: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  setAdminMode: (active: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { selectedCollege, setSelectedCollege, colleges } = useCollege();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [savedCourseIds, setSavedCourseIds] = useState<string[]>([
    'b0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000004',
  ]);

  useEffect(() => {
    // Restore user session from localStorage
    try {
      const storedUser = localStorage.getItem('edupass_auth_user');
      const storedAdmin = localStorage.getItem('edupass_admin_session');
      const storedSaved = localStorage.getItem('edupass_saved_courses');

      if (storedSaved) {
        setSavedCourseIds(JSON.parse(storedSaved));
      }

      if (storedAdmin === 'true') {
        setIsAdmin(true);
      }

      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        if (parsed.role === 'admin') {
          setIsAdmin(true);
        } else {
          setStudent({
            id: 'stu_' + parsed.id,
            auth_user_id: parsed.id,
            name: parsed.name,
            email: parsed.email,
            college_id: selectedCollege?.id || colleges[0]?.id || '',
            college: selectedCollege || colleges[0],
          });
        }
      } else {
        // Default guest student session for instant exploring
        const defaultStudent: AuthUser = {
          id: 'user_alex_stanford',
          name: 'Alex Chen',
          email: 'alex@stanford.edu',
          role: 'student',
        };
        setUser(defaultStudent);
        setStudent({
          id: 'stu_alex',
          auth_user_id: defaultStudent.id,
          name: defaultStudent.name,
          email: defaultStudent.email,
          college_id: selectedCollege?.id || colleges[0]?.id || '',
          college: selectedCollege || colleges[0],
        });
      }
    } catch (err) {
      console.error('Error loading session', err);
    }
  }, [colleges, selectedCollege]);

  const toggleSaveCourse = async (courseId: string): Promise<boolean> => {
    const isCurrentlySaved = savedCourseIds.includes(courseId);
    let updated: string[];

    if (isCurrentlySaved) {
      updated = savedCourseIds.filter((id) => id !== courseId);
      await unsaveCourse(courseId, student?.id);
    } else {
      updated = [...savedCourseIds, courseId];
      await saveCourse(courseId, student?.id);
    }

    setSavedCourseIds(updated);
    localStorage.setItem('edupass_saved_courses', JSON.stringify(updated));
    return !isCurrentlySaved;
  };

  const signIn = async (email: string, role: 'student' | 'admin' = 'student'): Promise<{ success: boolean; error?: string }> => {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (role === 'admin') {
      const adminUser: AuthUser = {
        id: 'admin_master',
        name: 'Platform Administrator',
        email,
        role: 'admin',
      };
      setUser(adminUser);
      setIsAdmin(true);
      localStorage.setItem('edupass_auth_user', JSON.stringify(adminUser));
      localStorage.setItem('edupass_admin_session', 'true');
      return { success: true };
    }

    // If student, verify email domain matches selected college or any active college
    let targetCollege = selectedCollege;
    if (!targetCollege) {
      return { success: false, error: 'Please select your college first.' };
    }

    const domainResult = await verifyEmailForCollege(email, targetCollege.id);
    if (!domainResult.valid) {
      // Try to match email with any college
      const matched = colleges.find((c) => email.toLowerCase().endsWith(c.domain.toLowerCase()));
      if (matched) {
        targetCollege = matched;
        setSelectedCollege(matched);
      } else {
        return { success: false, error: domainResult.message };
      }
    }

    const studentUser: AuthUser = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      email,
      role: 'student',
    };

    setUser(studentUser);
    setIsAdmin(false);
    setStudent({
      id: 'stu_' + studentUser.id,
      auth_user_id: studentUser.id,
      name: studentUser.name,
      email: studentUser.email,
      college_id: targetCollege.id,
      college: targetCollege,
    });

    localStorage.setItem('edupass_auth_user', JSON.stringify(studentUser));
    localStorage.removeItem('edupass_admin_session');
    return { success: true };
  };

  const signUp = async (name: string, email: string, collegeId: string): Promise<{ success: boolean; error?: string }> => {
    if (!name.trim()) return { success: false, error: 'Please provide your full name.' };
    
    const domainResult = await verifyEmailForCollege(email, collegeId);
    if (!domainResult.valid) {
      return { success: false, error: domainResult.message };
    }

    const matchedCollege = colleges.find((c) => c.id === collegeId) || selectedCollege;

    const studentUser: AuthUser = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name,
      email,
      role: 'student',
    };

    setUser(studentUser);
    setIsAdmin(false);
    setStudent({
      id: 'stu_' + studentUser.id,
      auth_user_id: studentUser.id,
      name: studentUser.name,
      email: studentUser.email,
      college_id: collegeId,
      college: matchedCollege || undefined,
    });

    if (matchedCollege) {
      setSelectedCollege(matchedCollege);
    }

    localStorage.setItem('edupass_auth_user', JSON.stringify(studentUser));
    localStorage.removeItem('edupass_admin_session');
    return { success: true };
  };

  const signOut = () => {
    setUser(null);
    setStudent(null);
    setIsAdmin(false);
    localStorage.removeItem('edupass_auth_user');
    localStorage.removeItem('edupass_admin_session');
    try {
      const supabase = createClient();
      supabase.auth.signOut();
    } catch {
      // Ignore
    }
  };

  const setAdminMode = (active: boolean) => {
    setIsAdmin(active);
    if (active) {
      localStorage.setItem('edupass_admin_session', 'true');
      setUser({
        id: 'admin_sys',
        name: 'Administrator',
        email: 'admin@courses.edu',
        role: 'admin',
      });
    } else {
      localStorage.removeItem('edupass_admin_session');
      // Revert to demo student
      setUser({
        id: 'user_alex_stanford',
        name: 'Alex Chen',
        email: 'alex@stanford.edu',
        role: 'student',
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        student,
        isAdmin,
        savedCourseIds,
        toggleSaveCourse,
        signIn,
        signUp,
        signOut,
        setAdminMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
