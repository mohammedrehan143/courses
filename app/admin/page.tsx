'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { useCollege } from '@/context/college-context';
import { getAdminAnalytics } from '@/lib/services/analytics';
import { getCourses, createCourse, updateCourse, deleteCourse } from '@/lib/services/courses';
import { getAllCollegesForAdmin, createCollege, updateCollege, deleteCollege } from '@/lib/services/colleges';
import { getCategories, createCategory, deleteCategory } from '@/lib/services/categories';
import { getCollegeCourses, assignCourseToCollege, removeCourseFromCollege } from '@/lib/services/college-courses';
import { Course, College, Category, CollegeCourse, AnalyticsSummary, AccessType } from '@/types/database';
import {
  ShieldAlert,
  BarChart3,
  BookOpen,
  School,
  LayoutGrid,
  Link as LinkIcon,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Search,
  Eye,
  TrendingUp,
  Bookmark,
  Users,
  MousePointerClick,
  Sparkles,
  Layers,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { getUIProducts, getCreatorSubmissions } from '@/lib/services/marketplace';
import { UIProduct, CreatorSubmission } from '@/types/marketplace';

export default function AdminDashboardPage() {
  const { isAdmin, setAdminMode } = useAuth();
  const { colleges: contextColleges } = useCollege();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'analytics' | 'courses' | 'colleges' | 'categories' | 'mappings' | 'marketplace'>('analytics');

  // Data states
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [colleges, setColleges] = useState<College[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [mappings, setMappings] = useState<CollegeCourse[]>([]);
  const [uiProducts, setUiProducts] = useState<UIProduct[]>([]);
  const [creatorSubmissions, setCreatorSubmissions] = useState<CreatorSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  // Form modals / dialog states
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseFormData, setCourseFormData] = useState<Partial<Course>>({
    title: '',
    provider: '',
    description: '',
    category: 'AI & Machine Learning',
    level: 'Beginner',
    duration: '4 weeks',
    certification_available: true,
    certificate_type: 'Verified Student Certificate',
    course_url: 'https://',
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    requirements: 'Active student email required.',
    is_free: true,
    is_active: true,
    is_featured: false,
    access_type: 'college_email',
  });

  // Add College Modal state
  const [isAddCollegeOpen, setIsAddCollegeOpen] = useState(false);
  const [collegeFormData, setCollegeFormData] = useState({
    name: '',
    short_name: '',
    domain: '',
    location: '',
    description: '',
  });

  // Assign College Course Modal state
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [assignFormData, setAssignFormData] = useState({
    college_id: '',
    course_id: '',
    access_type: 'college_email' as AccessType,
    special_instructions: '',
  });

  // Course search filter inside admin
  const [courseSearch, setCourseSearch] = useState('');

  // Initial load
  useEffect(() => {
    async function loadAdminData() {
      setLoading(true);
      try {
        const [analyticsData, coursesData, collegesData, catsData, mappingsData, marketplaceData, submissionsData] = await Promise.all([
          getAdminAnalytics(),
          getCourses({ limit: 100 }),
          getAllCollegesForAdmin(),
          getCategories(),
          getCollegeCourses(),
          getUIProducts({ limit: 100 }),
          getCreatorSubmissions(),
        ]);
        setAnalytics(analyticsData);
        setCourses(coursesData.courses);
        setColleges(collegesData);
        setCategories(catsData);
        setMappings(mappingsData);
        setUiProducts(marketplaceData.products);
        setCreatorSubmissions(submissionsData);
        if (collegesData.length > 0 && coursesData.courses.length > 0) {
          setAssignFormData((prev) => ({
            ...prev,
            college_id: collegesData[0].id,
            course_id: coursesData.courses[0].id,
          }));
        }
      } catch (err) {
        console.error('Error loading admin data', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  // Course Actions
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, courseFormData);
        setCourses((prev) =>
          prev.map((c) => (c.id === editingCourse.id ? ({ ...c, ...courseFormData } as Course) : c))
        );
        toast.success('Course updated successfully!');
      } else {
        const created = await createCourse(courseFormData);
        setCourses((prev) => [created, ...prev]);
        toast.success('Course added successfully!');
      }
      setIsAddCourseOpen(false);
      setEditingCourse(null);
    } catch (err) {
      toast.error('Failed to save course.');
    }
  };

  const handleToggleCourseActive = async (course: Course) => {
    try {
      const updated = !course.is_active;
      await updateCourse(course.id, { is_active: updated });
      setCourses((prev) =>
        prev.map((c) => (c.id === course.id ? { ...c, is_active: updated } : c))
      );
      toast.success(updated ? 'Course activated' : 'Course deactivated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      toast.success('Course deleted');
    } catch {
      toast.error('Failed to delete course');
    }
  };

  // College Actions
  const handleSaveCollege = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await createCollege({
        ...collegeFormData,
        logo_url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=400&q=80',
        is_active: true,
      });
      setColleges((prev) => [created, ...prev]);
      setIsAddCollegeOpen(false);
      setCollegeFormData({ name: '', short_name: '', domain: '', location: '', description: '' });
      toast.success(`Added university: ${created.name}`);
    } catch {
      toast.error('Failed to add college');
    }
  };

  const handleToggleCollegeActive = async (college: College) => {
    try {
      const updated = !college.is_active;
      await updateCollege(college.id, { is_active: updated });
      setColleges((prev) =>
        prev.map((c) => (c.id === college.id ? { ...c, is_active: updated } : c))
      );
      toast.success(`Updated ${college.short_name} status`);
    } catch {
      toast.error('Failed to update college status');
    }
  };

  // Assign Mapping
  const handleAssignCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const mapping = await assignCourseToCollege(assignFormData);
      const enriched = {
        ...mapping,
        course: courses.find((c) => c.id === mapping.course_id),
        college: colleges.find((col) => col.id === mapping.college_id),
      };
      setMappings((prev) => [enriched, ...prev]);
      setIsAssignOpen(false);
      toast.success('Course successfully mapped to college!');
    } catch {
      toast.error('Failed to map course');
    }
  };

  const handleRemoveMapping = async (collegeId: string, courseId: string) => {
    try {
      await removeCourseFromCollege(collegeId, courseId);
      setMappings((prev) =>
        prev.filter((m) => !(m.college_id === collegeId && m.course_id === courseId))
      );
      toast.success('Mapping removed');
    } catch {
      toast.error('Failed to remove mapping');
    }
  };

  // If not in admin mode, show friendly role toggle barrier
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto shadow-md">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Admin Access Required
          </h2>
          <p className="text-sm text-slate-500">
            This area is restricted to institution administrators. To preview and test all course CRUD, college management, and analytics features:
          </p>
        </div>
        <Button
          onClick={() => setAdminMode(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-2xl px-6 py-2.5 shadow-md"
        >
          Enter Admin Mode (Demo / Faculty)
        </Button>
      </div>
    );
  }

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.provider.toLowerCase().includes(courseSearch.toLowerCase()) ||
      c.category.toLowerCase().includes(courseSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Institutional Governance Panel</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            CoSurf Administration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage course directory, university domains, college course assignments, and student usage metrics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAdminMode(false)}
            className="text-xs rounded-xl"
          >
            Exit Admin Mode
          </Button>
          <Link href="/courses">
            <Button size="sm" variant="ghost" className="text-xs gap-1">
              <span>View Public Portal</span>
              <ExternalLink className="w-3 h-3" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-px">
        {[
          { id: 'analytics', label: 'Analytics & Activity', icon: BarChart3 },
          { id: 'courses', label: `Courses (${courses.length})`, icon: BookOpen },
          { id: 'colleges', label: `Colleges (${colleges.length})`, icon: School },
          { id: 'mappings', label: `Access Mappings (${mappings.length})`, icon: LinkIcon },
          { id: 'categories', label: `Categories (${categories.length})`, icon: LayoutGrid },
          { id: 'marketplace', label: `UI Marketplace (${uiProducts.length})`, icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                isActive
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ANALYTICS */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-600" /> Students
              </span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {analytics.totalStudents.toLocaleString()}
              </p>
              <span className="text-[11px] text-emerald-600 font-medium">Domain verified</span>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-purple-600" /> Active Courses
              </span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {analytics.totalCourses}
              </p>
              <span className="text-[11px] text-purple-600 font-medium">Across all tracks</span>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-emerald-600" /> Universities
              </span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {analytics.totalColleges}
              </p>
              <span className="text-[11px] text-emerald-600 font-medium">Configured campuses</span>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1.5">
                <MousePointerClick className="w-3.5 h-3.5 text-amber-600" /> Outbound Clicks
              </span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {analytics.totalClicks.toLocaleString()}
              </p>
              <span className="text-[11px] text-amber-600 font-medium">Direct provider visits</span>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-rose-600" /> Bookmarks
              </span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {analytics.totalBookmarks.toLocaleString()}
              </p>
              <span className="text-[11px] text-rose-600 font-medium">Saved opportunities</span>
            </div>
          </div>

          {/* Charts & Distributions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Most Clicked Courses */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Most Popular Courses (By Clicks)
              </h3>
              <div className="space-y-3">
                {analytics.mostClickedCourses.map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                    <div className="space-y-0.5 max-w-[70%]">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {c.title}
                      </p>
                      <p className="text-[11px] text-slate-400">{c.provider}</p>
                    </div>
                    <Badge variant="secondary" className="font-bold">
                      {c.clicks.toLocaleString()} clicks
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Courses by Category Breakdown */}
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-purple-600" />
                Course Catalog by Discipline
              </h3>
              <div className="space-y-2.5">
                {analytics.coursesByCategory.map((cat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                      <span>{cat.category}</span>
                      <span>{cat.count} courses</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                        style={{ width: `${Math.min(100, (cat.count / 4) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity Log */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Recent Activity Feed
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {analytics.recentActivity.map((act) => (
                <div key={act.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {act.description}
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px]">{act.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: COURSE MANAGEMENT */}
      {activeTab === 'courses' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search course title or provider..."
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button
              onClick={() => {
                setEditingCourse(null);
                setCourseFormData({
                  title: '',
                  provider: '',
                  description: '',
                  category: 'AI & Machine Learning',
                  level: 'Beginner',
                  duration: '4 weeks',
                  certification_available: true,
                  certificate_type: 'Verified Certificate',
                  course_url: 'https://',
                  image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
                  requirements: 'College email verification.',
                  is_free: true,
                  is_active: true,
                  is_featured: false,
                  access_type: 'college_email',
                });
                setIsAddCourseOpen(true);
              }}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Course</span>
            </Button>
          </div>

          {/* Courses Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Course Title &amp; Provider</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Level</th>
                    <th className="p-4">Certificate</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredCourses.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td className="p-4">
                        <p className="font-bold text-slate-900 dark:text-white text-xs">
                          {c.title}
                        </p>
                        <p className="text-[11px] text-slate-400">{c.provider}</p>
                      </td>
                      <td className="p-4">{c.category}</td>
                      <td className="p-4">{c.level}</td>
                      <td className="p-4">
                        {c.certification_available ? (
                          <span className="text-emerald-600 font-semibold">Free Certificate</span>
                        ) : (
                          <span className="text-slate-400">Audit Only</span>
                        )}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleCourseActive(c)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            c.is_active
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {c.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditingCourse(c);
                              setCourseFormData(c);
                              setIsAddCourseOpen(true);
                            }}
                            className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit course"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(c.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Delete course"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COLLEGE MANAGEMENT */}
      {activeTab === 'colleges' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Configure participating universities and their allowed email domains (e.g. stanford.edu).
            </p>
            <Button
              onClick={() => setIsAddCollegeOpen(true)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add University</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {colleges.map((col) => (
              <div
                key={col.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {col.name}
                    </h3>
                    <Badge variant="outline" className="text-[10px]">
                      {col.short_name}
                    </Badge>
                  </div>
                  <p className="text-xs font-mono text-blue-600 dark:text-blue-400">
                    @{col.domain}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-1">{col.location}</p>
                </div>

                <button
                  onClick={() => handleToggleCollegeActive(col)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    col.is_active
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                  }`}
                >
                  {col.is_active ? 'Active' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ACCESS MAPPINGS (COLLEGE_COURSES) */}
      {activeTab === 'mappings' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500 max-w-lg">
              Manage which specific course offers are granted to which university, along with access type and custom instructions.
            </p>
            <Button
              onClick={() => setIsAssignOpen(true)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Map Course to College</span>
            </Button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold text-[10px]">
                  <tr>
                    <th className="p-4">College</th>
                    <th className="p-4">Course Opportunity</th>
                    <th className="p-4">Access Type</th>
                    <th className="p-4">Special Instructions</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {mappings.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td className="p-4 font-semibold text-slate-900 dark:text-white">
                        {m.college?.name || colleges.find((c) => c.id === m.college_id)?.name || m.college_id}
                      </td>
                      <td className="p-4">
                        {m.course?.title || courses.find((c) => c.id === m.course_id)?.title || m.course_id}
                      </td>
                      <td className="p-4">
                        <span className="capitalize px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[11px] font-medium">
                          {m.access_type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-[11px] text-slate-500 max-w-xs truncate">
                        {m.special_instructions || 'Standard verification'}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleRemoveMapping(m.college_id, m.course_id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                          title="Remove mapping"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CATEGORIES */}
      {activeTab === 'categories' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-2"
              >
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">{cat.description}</p>
                <span className="text-[10px] font-mono text-slate-400 block">
                  Slug: {cat.slug}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD / EDIT COURSE MODAL */}
      {isAddCourseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingCourse ? 'Edit Course Opportunity' : 'Add New Course Opportunity'}
            </h2>

            <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Title</label>
                  <Input
                    value={courseFormData.title || ''}
                    onChange={(e) => setCourseFormData({ ...courseFormData, title: e.target.value })}
                    required
                    placeholder="e.g. AWS Cloud Practitioner"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Provider</label>
                  <Input
                    value={courseFormData.provider || ''}
                    onChange={(e) => setCourseFormData({ ...courseFormData, provider: e.target.value })}
                    required
                    placeholder="e.g. AWS Academy"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  value={courseFormData.description || ''}
                  onChange={(e) => setCourseFormData({ ...courseFormData, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={courseFormData.category || ''}
                    onChange={(e) => setCourseFormData({ ...courseFormData, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Level</label>
                  <select
                    value={courseFormData.level || 'Beginner'}
                    onChange={(e) => setCourseFormData({ ...courseFormData, level: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Duration</label>
                  <Input
                    value={courseFormData.duration || ''}
                    onChange={(e) => setCourseFormData({ ...courseFormData, duration: e.target.value })}
                    placeholder="e.g. 4 weeks"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Official Course URL</label>
                <Input
                  type="url"
                  value={courseFormData.course_url || ''}
                  onChange={(e) => setCourseFormData({ ...courseFormData, course_url: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={courseFormData.certification_available ?? true}
                    onChange={(e) => setCourseFormData({ ...courseFormData, certification_available: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Verified Certificate Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={courseFormData.is_featured ?? false}
                    onChange={(e) => setCourseFormData({ ...courseFormData, is_featured: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Mark as Featured</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddCourseOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  Save Course
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 6: UI MARKETPLACE & MODERATION */}
      {activeTab === 'marketplace' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Metrics summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" /> UI Products
              </span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {uiProducts.length}
              </p>
              <span className="text-[11px] text-blue-600 font-medium">Published packages</span>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Total UI Sales
              </span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {uiProducts.reduce((acc, p) => acc + (p.sales_count || 0), 0).toLocaleString()}
              </p>
              <span className="text-[11px] text-emerald-600 font-medium">Developer purchases</span>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> Submissions
              </span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {creatorSubmissions.length}
              </p>
              <span className="text-[11px] text-amber-600 font-medium">Awaiting moderation</span>
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Free Kits
              </span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {uiProducts.filter((p) => p.price === 0).length}
              </p>
              <span className="text-[11px] text-purple-600 font-medium">Open-access kits</span>
            </div>
          </div>

          {/* Pending Submissions Moderation Queue */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>Creator Submissions (Pending Review)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Review submitted UI designs and AI implementation prompt packages before publishing.
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                {creatorSubmissions.length} Submissions
              </Badge>
            </div>

            {creatorSubmissions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No submissions currently waiting in the moderation queue.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {creatorSubmissions.map((sub) => (
                  <div key={sub.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{sub.title}</h4>
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-[10px] font-semibold border border-amber-200">
                          {sub.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{sub.description}</p>
                      <div className="text-[11px] text-slate-400 flex items-center gap-3">
                        <span>Creator: <strong>{sub.creator_name}</strong> ({sub.creator_email})</span>
                        <span>•</span>
                        <span>Price: ₹{sub.price}</span>
                        <span>•</span>
                        <span>Category: {sub.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setCreatorSubmissions((prev) =>
                            prev.map((s) => (s.id === sub.id ? { ...s, status: 'approved' } : s))
                          );
                          toast.success(`Approved "${sub.title}"! Package published.`);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Approve & Publish
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setCreatorSubmissions((prev) =>
                            prev.map((s) => (s.id === sub.id ? { ...s, status: 'rejected' } : s))
                          );
                          toast.error(`Rejected "${sub.title}".`);
                        }}
                        className="text-xs font-semibold rounded-xl"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Published Marketplace Products List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Live Marketplace Catalog ({uiProducts.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Manage live prices, featured statuses, and active developer packages.
                </p>
              </div>
              <Link href="/marketplace">
                <Button size="sm" variant="outline" className="text-xs">
                  View Public Marketplace
                </Button>
              </Link>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {uiProducts.map((prod) => (
                <div key={prod.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 relative">
                      <img src={prod.preview_image} alt={prod.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Link href={`/marketplace/${prod.slug}`} className="font-bold text-sm text-slate-900 dark:text-white hover:underline">
                          {prod.title}
                        </Link>
                        {prod.is_featured && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500 text-slate-950 uppercase">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>{prod.category}</span>
                        <span>•</span>
                        <span>{prod.technologies.join(', ')}</span>
                        <span>•</span>
                        <span>Sales: <strong>{prod.sales_count}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {prod.price === 0 ? 'Free' : `₹${prod.price}`}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newPrice = prompt(`Enter new price in INR for "${prod.title}":`, prod.price.toString());
                        if (newPrice !== null && !isNaN(parseFloat(newPrice))) {
                          setUiProducts((prev) =>
                            prev.map((p) => (p.id === prod.id ? { ...p, price: parseFloat(newPrice) } : p))
                          );
                          toast.success(`Price updated to ₹${newPrice}`);
                        }
                      }}
                      className="text-xs"
                    >
                      Change Price
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ADD COLLEGE MODAL */}
      {isAddCollegeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Add New University
            </h2>

            <form onSubmit={handleSaveCollege} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">University Full Name</label>
                <Input
                  value={collegeFormData.name}
                  onChange={(e) => setCollegeFormData({ ...collegeFormData, name: e.target.value })}
                  placeholder="e.g. Carnegie Mellon University"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Short Name</label>
                  <Input
                    value={collegeFormData.short_name}
                    onChange={(e) => setCollegeFormData({ ...collegeFormData, short_name: e.target.value })}
                    placeholder="e.g. CMU"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Allowed Email Domain</label>
                  <Input
                    value={collegeFormData.domain}
                    onChange={(e) => setCollegeFormData({ ...collegeFormData, domain: e.target.value.toLowerCase() })}
                    placeholder="e.g. cmu.edu"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Location</label>
                <Input
                  value={collegeFormData.location}
                  onChange={(e) => setCollegeFormData({ ...collegeFormData, location: e.target.value })}
                  placeholder="e.g. Pittsburgh, PA, USA"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddCollegeOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  Save University
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN COURSE TO COLLEGE MODAL */}
      {isAssignOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Map Course Opportunity to University
            </h2>

            <form onSubmit={handleAssignCourse} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Target College</label>
                <select
                  value={assignFormData.college_id}
                  onChange={(e) => setAssignFormData({ ...assignFormData, college_id: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  {colleges.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (@{c.domain})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Course</label>
                <select
                  value={assignFormData.course_id}
                  onChange={(e) => setAssignFormData({ ...assignFormData, course_id: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.provider})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Access Type</label>
                <select
                  value={assignFormData.access_type}
                  onChange={(e) => setAssignFormData({ ...assignFormData, access_type: e.target.value as AccessType })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="college_email">College Email Unlocked</option>
                  <option value="student_offer">Student Offer / Voucher</option>
                  <option value="institutional_access">Institutional Access</option>
                  <option value="completely_free">Completely Free</option>
                  <option value="partnership">Academic Partnership</option>
                  <option value="scholarship">Student Scholarship</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Special Student Claim Instructions</label>
                <textarea
                  value={assignFormData.special_instructions}
                  onChange={(e) => setAssignFormData({ ...assignFormData, special_instructions: e.target.value })}
                  placeholder="e.g. Sign in with campus single sign-on (SSO) to receive full tuition credit."
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsAssignOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  Save Assignment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
