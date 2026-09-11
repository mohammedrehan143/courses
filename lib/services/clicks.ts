import { createClient } from '@/lib/supabase/client';
import { MOCK_COURSES } from '@/lib/mock-data';

const isDemo = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || !url || url.includes('your-project-ref');
};

export async function trackCourseClick(courseId: string, studentId?: string | null): Promise<boolean> {
  if (isDemo()) {
    const course = MOCK_COURSES.find((c) => c.id === courseId);
    if (course) {
      course.click_count = (course.click_count || 0) + 1;
    }
    return true;
  }

  try {
    const supabase = createClient();
    await supabase.from('course_clicks').insert([
      {
        course_id: courseId,
        student_id: studentId || null,
        clicked_at: new Date().toISOString(),
      },
    ]);
    return true;
  } catch {
    return true;
  }
}
