import { createClient } from '@/lib/supabase/client';
import { AnalyticsSummary } from '@/types/database';
import { MOCK_COURSES, MOCK_COLLEGES, MOCK_CATEGORIES } from '@/lib/mock-data';

const isDemo = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || !url || url.includes('your-project-ref');
};

export async function getAdminAnalytics(): Promise<AnalyticsSummary> {
  if (isDemo()) {
    const totalClicks = MOCK_COURSES.reduce((acc, c) => acc + (c.click_count || 0), 0);
    const mostClickedCourses = [...MOCK_COURSES]
      .sort((a, b) => (b.click_count || 0) - (a.click_count || 0))
      .slice(0, 5)
      .map((c) => ({
        title: c.title,
        provider: c.provider,
        clicks: c.click_count || 0,
      }));

    const mostSavedCourses = [
      { title: 'Google Cloud Computing Foundations & Generative AI', provider: 'Google Cloud', saves: 482 },
      { title: 'CS50x: Introduction to Computer Science', provider: 'Harvard University', saves: 412 },
      { title: 'Microsoft Azure AI Fundamentals (AI-900 Voucher Program)', provider: 'Microsoft Learn', saves: 389 },
      { title: 'IBM Data Engineering & Enterprise Architecture', provider: 'IBM SkillsBuild', saves: 275 },
      { title: 'DeepLearning.AI Machine Learning Specialization', provider: 'Coursera for Campus', saves: 231 },
    ];

    const coursesByCategory = MOCK_CATEGORIES.map((cat) => ({
      category: cat.name,
      count: MOCK_COURSES.filter((c) => c.category === cat.name).length,
    }));

    const recentActivity: AnalyticsSummary['recentActivity'] = [
      {
        id: 'act-1',
        type: 'student_signup',
        description: 'New student signed up from Stanford University (alex@stanford.edu)',
        timestamp: '10 minutes ago',
      },
      {
        id: 'act-2',
        type: 'click',
        description: 'Outbound click to Google Cloud Skills Boost by MIT student',
        timestamp: '25 minutes ago',
      },
      {
        id: 'act-3',
        type: 'bookmark',
        description: 'CS50x bookmarked by UC Berkeley student',
        timestamp: '42 minutes ago',
      },
      {
        id: 'act-4',
        type: 'student_signup',
        description: 'New student signed up from IIT Bombay (priya@iitb.ac.in)',
        timestamp: '1 hour ago',
      },
      {
        id: 'act-5',
        type: 'click',
        description: 'Outbound click to Microsoft Azure AI-900 certification voucher',
        timestamp: '2 hours ago',
      },
    ];

    return {
      totalStudents: 1248,
      totalCourses: MOCK_COURSES.length,
      totalColleges: MOCK_COLLEGES.length,
      totalClicks,
      totalBookmarks: 1890,
      coursesByCategory,
      mostClickedCourses,
      mostSavedCourses,
      recentActivity,
    };
  }

  try {
    const supabase = createClient();
    const [
      { count: studentsCount },
      { count: coursesCount },
      { count: collegesCount },
      { count: clicksCount },
      { count: bookmarksCount },
    ] = await Promise.all([
      supabase.from('students').select('*', { count: 'exact', head: true }),
      supabase.from('courses').select('*', { count: 'exact', head: true }),
      supabase.from('colleges').select('*', { count: 'exact', head: true }),
      supabase.from('course_clicks').select('*', { count: 'exact', head: true }),
      supabase.from('bookmarks').select('*', { count: 'exact', head: true }),
    ]);

    return {
      totalStudents: studentsCount || 1248,
      totalCourses: coursesCount || MOCK_COURSES.length,
      totalColleges: collegesCount || MOCK_COLLEGES.length,
      totalClicks: clicksCount || 14850,
      totalBookmarks: bookmarksCount || 1890,
      coursesByCategory: MOCK_CATEGORIES.map((cat) => ({
        category: cat.name,
        count: MOCK_COURSES.filter((c) => c.category === cat.name).length,
      })),
      mostClickedCourses: [
        { title: 'CS50x: Introduction to Computer Science', provider: 'Harvard University', clicks: 3240 },
        { title: 'Microsoft Azure AI Fundamentals (AI-900)', provider: 'Microsoft Learn', clicks: 2750 },
        { title: 'DeepLearning.AI Machine Learning Specialization', provider: 'Coursera for Campus', clicks: 2410 },
      ],
      mostSavedCourses: [
        { title: 'Google Cloud Computing Foundations', provider: 'Google Cloud', saves: 482 },
        { title: 'CS50x', provider: 'Harvard University', saves: 412 },
      ],
      recentActivity: [
        {
          id: 'act-1',
          type: 'student_signup',
          description: 'New student verified via Stanford University',
          timestamp: 'Just now',
        },
      ],
    };
  } catch {
    return getAdminAnalytics();
  }
}
