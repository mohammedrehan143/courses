import { createClient } from '@/lib/supabase/client';
import { Course, FilterOptions } from '@/types/database';
import { MOCK_COURSES, MOCK_COLLEGE_COURSES } from '@/lib/mock-data';

const isDemo = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || !url || url.includes('your-project-ref');
};

let localCourses = [...MOCK_COURSES];

export async function getCourses(options: FilterOptions = {}): Promise<{ courses: Course[]; total: number }> {
  const {
    search,
    category,
    level,
    provider,
    accessType,
    certificationOnly,
    collegeId,
    sortBy = 'newest',
    page = 1,
    limit = 100,
  } = options;

  if (isDemo()) {
    let result = [...localCourses].filter((c) => c.is_active);

    // Filter by college mapping if collegeId provided
    if (collegeId && MOCK_COLLEGE_COURSES[collegeId]) {
      const collegeMappings = MOCK_COLLEGE_COURSES[collegeId];
      const mappingMap = new Map(collegeMappings.map((m) => [m.course_id, m]));

      result = result
        .filter((c) => mappingMap.has(c.id))
        .map((c) => {
          const mapping = mappingMap.get(c.id)!;
          return {
            ...c,
            access_type: mapping.access_type,
            special_instructions: mapping.special_instructions,
          };
        });
    }

    // Search filter
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.provider.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.skills_gained?.some((s) => s.toLowerCase().includes(q)) ||
          c.what_you_learn?.some((w) => w.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (category && category !== 'all') {
      result = result.filter(
        (c) => c.category.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase() ||
               c.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Level filter
    if (level && level !== 'all') {
      result = result.filter((c) => c.level.toLowerCase() === level.toLowerCase());
    }

    // Provider filter
    if (provider && provider !== 'all') {
      result = result.filter((c) => c.provider.toLowerCase() === provider.toLowerCase());
    }

    // Access type filter
    if (accessType && accessType !== 'all') {
      result = result.filter((c) => c.access_type === accessType);
    }

    // Certification filter
    if (certificationOnly) {
      result = result.filter((c) => c.certification_available);
    }

    // Sorting
    if (sortBy === 'popular') {
      result.sort((a, b) => (b.click_count || 0) - (a.click_count || 0));
    } else if (sortBy === 'title_asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Default: newest
      result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    const total = result.length;
    const startIndex = (page - 1) * limit;
    const paginated = result.slice(startIndex, startIndex + limit);

    return { courses: paginated, total };
  }

  try {
    const supabase = createClient();
    let query = supabase.from('courses').select('*, college_courses(*)', { count: 'exact' });

    query = query.eq('is_active', true);

    if (category && category !== 'all') {
      query = query.ilike('category', `%${category}%`);
    }

    if (level && level !== 'all') {
      query = query.eq('level', level);
    }

    if (provider && provider !== 'all') {
      query = query.eq('provider', provider);
    }

    if (certificationOnly) {
      query = query.eq('certification_available', true);
    }

    if (search && search.trim()) {
      query = query.or(`title.ilike.%${search}%,provider.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (sortBy === 'title_asc') {
      query = query.order('title', { ascending: true });
    } else {
      query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
    }

    const { data, count, error } = await query;

    if (error || !data || data.length === 0) {
      return getCourses({ ...options, sortBy: options.sortBy });
    }

    return { courses: data as Course[], total: count || data.length };
  } catch {
    return { courses: localCourses, total: localCourses.length };
  }
}

export async function getCourseBySlug(slug: string, collegeId?: string): Promise<Course | null> {
  if (isDemo()) {
    const course = localCourses.find((c) => c.slug === slug);
    if (!course) return null;

    if (collegeId && MOCK_COLLEGE_COURSES[collegeId]) {
      const mapping = MOCK_COLLEGE_COURSES[collegeId].find((m) => m.course_id === course.id);
      if (mapping) {
        return {
          ...course,
          access_type: mapping.access_type,
          special_instructions: mapping.special_instructions,
        };
      }
    }

    return course;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return localCourses.find((c) => c.slug === slug) || null;
    }

    let enrichedCourse = data as Course;

    if (collegeId) {
      const { data: mapping } = await supabase
        .from('college_courses')
        .select('*')
        .eq('college_id', collegeId)
        .eq('course_id', enrichedCourse.id)
        .single();

      if (mapping) {
        enrichedCourse = {
          ...enrichedCourse,
          access_type: mapping.access_type,
          special_instructions: mapping.special_instructions,
          verification_required: mapping.verification_required,
        };
      }
    }

    return enrichedCourse;
  } catch {
    return localCourses.find((c) => c.slug === slug) || null;
  }
}

export async function getFeaturedCourses(collegeId?: string): Promise<Course[]> {
  const { courses } = await getCourses({ collegeId, limit: 6 });
  return courses.filter((c) => c.is_featured);
}

export async function createCourse(courseData: Partial<Course>): Promise<Course> {
  const slug = courseData.slug || courseData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `course-${Date.now()}`;
  
  const newCourse: Course = {
    id: 'crs_' + Math.random().toString(36).substring(2, 11),
    slug,
    title: courseData.title || 'Untitled Course',
    provider: courseData.provider || 'Independent Provider',
    description: courseData.description || '',
    category: courseData.category || 'Technology',
    level: courseData.level || 'Beginner',
    duration: courseData.duration || 'Self-paced',
    certification_available: courseData.certification_available ?? true,
    certificate_type: courseData.certificate_type || 'Verified Certificate',
    course_url: courseData.course_url || 'https://example.com',
    image_url: courseData.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    requirements: courseData.requirements || 'College email required.',
    what_you_learn: courseData.what_you_learn || [],
    skills_gained: courseData.skills_gained || [],
    is_free: courseData.is_free ?? true,
    is_active: courseData.is_active ?? true,
    is_featured: courseData.is_featured ?? false,
    access_type: courseData.access_type || 'college_email',
    special_instructions: courseData.special_instructions || 'Enroll using your college email address.',
    created_at: new Date().toISOString(),
    click_count: 0,
  };

  if (isDemo()) {
    localCourses.unshift(newCourse);
    return newCourse;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('courses').insert([courseData]).select().single();
    if (error) throw error;
    return data as Course;
  } catch {
    localCourses.unshift(newCourse);
    return newCourse;
  }
}

export async function updateCourse(id: string, updates: Partial<Course>): Promise<Course | null> {
  if (isDemo()) {
    const idx = localCourses.findIndex((c) => c.id === id);
    if (idx !== -1) {
      localCourses[idx] = { ...localCourses[idx], ...updates, updated_at: new Date().toISOString() };
      return localCourses[idx];
    }
    return null;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Course;
  } catch {
    const idx = localCourses.findIndex((c) => c.id === id);
    if (idx !== -1) {
      localCourses[idx] = { ...localCourses[idx], ...updates };
      return localCourses[idx];
    }
    return null;
  }
}

export async function deleteCourse(id: string): Promise<boolean> {
  if (isDemo()) {
    localCourses = localCourses.filter((c) => c.id !== id);
    return true;
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch {
    localCourses = localCourses.filter((c) => c.id !== id);
    return true;
  }
}
