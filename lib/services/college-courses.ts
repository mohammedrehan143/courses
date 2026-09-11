import { createClient } from '@/lib/supabase/client';
import { CollegeCourse, AccessType } from '@/types/database';
import { MOCK_COLLEGE_COURSES, MOCK_COURSES, MOCK_COLLEGES } from '@/lib/mock-data';

const isDemo = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || !url || url.includes('your-project-ref');
};

let localCollegeCourses: CollegeCourse[] = [];

// Initialize local mapping from mock data
Object.entries(MOCK_COLLEGE_COURSES).forEach(([collegeId, courses]) => {
  courses.forEach((c, idx) => {
    localCollegeCourses.push({
      id: `map_${collegeId.slice(0, 6)}_${idx}`,
      college_id: collegeId,
      course_id: c.course_id,
      access_type: c.access_type,
      verification_required: true,
      special_instructions: c.special_instructions,
      is_active: true,
      created_at: new Date().toISOString(),
    });
  });
});

export async function getCollegeCourses(collegeId?: string): Promise<CollegeCourse[]> {
  if (isDemo()) {
    let result = localCollegeCourses;
    if (collegeId) {
      result = result.filter((cc) => cc.college_id === collegeId);
    }
    return result.map((cc) => ({
      ...cc,
      course: MOCK_COURSES.find((c) => c.id === cc.course_id),
      college: MOCK_COLLEGES.find((col) => col.id === cc.college_id),
    }));
  }

  try {
    const supabase = createClient();
    let query = supabase.from('college_courses').select('*, course:courses(*), college:colleges(*)');
    if (collegeId) {
      query = query.eq('college_id', collegeId);
    }
    const { data, error } = await query;
    if (error || !data) return getCollegeCourses(collegeId);
    return data as CollegeCourse[];
  } catch {
    return localCollegeCourses;
  }
}

export async function assignCourseToCollege(data: {
  college_id: string;
  course_id: string;
  access_type: AccessType;
  verification_required?: boolean;
  special_instructions?: string;
}): Promise<CollegeCourse> {
  const newMapping: CollegeCourse = {
    id: 'cc_' + Math.random().toString(36).substring(2, 11),
    college_id: data.college_id,
    course_id: data.course_id,
    access_type: data.access_type,
    verification_required: data.verification_required ?? true,
    special_instructions: data.special_instructions || '',
    is_active: true,
    created_at: new Date().toISOString(),
  };

  if (isDemo()) {
    // Remove if exists then add
    localCollegeCourses = localCollegeCourses.filter(
      (cc) => !(cc.college_id === data.college_id && cc.course_id === data.course_id)
    );
    localCollegeCourses.push(newMapping);
    return newMapping;
  }

  try {
    const supabase = createClient();
    const { data: res, error } = await supabase
      .from('college_courses')
      .upsert(data, { onConflict: 'college_id,course_id' })
      .select()
      .single();

    if (error) throw error;
    return res as CollegeCourse;
  } catch {
    localCollegeCourses.push(newMapping);
    return newMapping;
  }
}

export async function removeCourseFromCollege(collegeId: string, courseId: string): Promise<boolean> {
  if (isDemo()) {
    localCollegeCourses = localCollegeCourses.filter(
      (cc) => !(cc.college_id === collegeId && cc.course_id === courseId)
    );
    return true;
  }

  try {
    const supabase = createClient();
    const { error } = await supabase
      .from('college_courses')
      .delete()
      .eq('college_id', collegeId)
      .eq('course_id', courseId);

    if (error) throw error;
    return true;
  } catch {
    localCollegeCourses = localCollegeCourses.filter(
      (cc) => !(cc.college_id === collegeId && cc.course_id === courseId)
    );
    return true;
  }
}
