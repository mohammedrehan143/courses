import { createClient } from '@/lib/supabase/client';
import { Course } from '@/types/database';
import { MOCK_COURSES } from '@/lib/mock-data';

const isDemo = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || !url || url.includes('your-project-ref');
};

const getLocalBookmarks = (): string[] => {
  if (typeof window === 'undefined') return ['b0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004'];
  try {
    const saved = localStorage.getItem('edupass_saved_courses');
    return saved ? JSON.parse(saved) : ['b0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004'];
  } catch {
    return ['b0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000004'];
  }
};

const setLocalBookmarks = (ids: string[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('edupass_saved_courses', JSON.stringify(ids));
  } catch {
    // Ignore storage quota
  }
};

export async function getSavedCourses(studentId?: string): Promise<Course[]> {
  if (isDemo() || !studentId) {
    const ids = getLocalBookmarks();
    return MOCK_COURSES.filter((c) => ids.includes(c.id)).map((c) => ({ ...c, is_bookmarked: true }));
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bookmarks')
      .select('course_id, course:courses(*)')
      .eq('student_id', studentId);

    if (error || !data) {
      const ids = getLocalBookmarks();
      return MOCK_COURSES.filter((c) => ids.includes(c.id)).map((c) => ({ ...c, is_bookmarked: true }));
    }

    return data
      .filter((b) => Boolean(b.course))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((b) => ({ ...(b.course as any), is_bookmarked: true }));
  } catch {
    const ids = getLocalBookmarks();
    return MOCK_COURSES.filter((c) => ids.includes(c.id)).map((c) => ({ ...c, is_bookmarked: true }));
  }
}

export async function saveCourse(courseId: string, studentId?: string): Promise<boolean> {
  const ids = getLocalBookmarks();
  if (!ids.includes(courseId)) {
    setLocalBookmarks([...ids, courseId]);
  }

  if (isDemo() || !studentId) {
    return true;
  }

  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('bookmarks')
      .insert([{ student_id: studentId, course_id: courseId }]);

    if (error) return false;
    return true;
  } catch {
    return true;
  }
}

export async function unsaveCourse(courseId: string, studentId?: string): Promise<boolean> {
  const ids = getLocalBookmarks();
  setLocalBookmarks(ids.filter((id) => id !== courseId));

  if (isDemo() || !studentId) {
    return true;
  }

  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('student_id', studentId)
      .eq('course_id', courseId);

    if (error) return false;
    return true;
  } catch {
    return true;
  }
}

export async function isCourseSaved(courseId: string, studentId?: string): Promise<boolean> {
  const ids = getLocalBookmarks();
  return ids.includes(courseId);
}
