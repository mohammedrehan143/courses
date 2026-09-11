export type AccessType = 
  | 'college_email'
  | 'student_offer'
  | 'institutional_access'
  | 'completely_free'
  | 'scholarship'
  | 'partnership';

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export type AdminRole = 'super_admin' | 'admin' | 'college_admin';

export interface College {
  id: string;
  name: string;
  short_name: string;
  domain: string;
  logo_url?: string | null;
  description?: string | null;
  location?: string | null;
  is_active: boolean;
  created_at?: string;
  course_count?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
  created_at?: string;
  course_count?: number;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  provider: string;
  description: string;
  category_id?: string | null;
  category: string;
  level: CourseLevel;
  duration: string;
  certification_available: boolean;
  certificate_type?: string | null;
  course_url: string;
  image_url?: string | null;
  requirements?: string | null;
  what_you_learn?: string[];
  skills_gained?: string[];
  is_free: boolean;
  is_active: boolean;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
  // Dynamic fields when joined with college_courses
  access_type?: AccessType;
  verification_required?: boolean;
  special_instructions?: string | null;
  college_id?: string;
  college_name?: string;
  is_bookmarked?: boolean;
  click_count?: number;
}

export interface CollegeCourse {
  id: string;
  college_id: string;
  course_id: string;
  access_type: AccessType;
  verification_required: boolean;
  special_instructions?: string | null;
  is_active: boolean;
  created_at?: string;
  course?: Course;
  college?: College;
}

export interface Student {
  id: string;
  auth_user_id: string;
  college_id: string;
  name: string;
  email: string;
  created_at?: string;
  college?: College;
}

export interface Bookmark {
  id: string;
  student_id: string;
  course_id: string;
  created_at?: string;
  course?: Course;
}

export interface CourseClick {
  id: string;
  student_id?: string | null;
  course_id: string;
  clicked_at: string;
}

export interface Admin {
  id: string;
  auth_user_id: string;
  role: AdminRole;
  college_id?: string | null;
  created_at?: string;
}

export interface FilterOptions {
  search?: string;
  category?: string;
  level?: string;
  provider?: string;
  accessType?: string;
  certificationOnly?: boolean;
  collegeId?: string;
  sortBy?: 'newest' | 'popular' | 'title_asc';
  page?: number;
  limit?: number;
}

export interface AnalyticsSummary {
  totalStudents: number;
  totalCourses: number;
  totalColleges: number;
  totalClicks: number;
  totalBookmarks: number;
  coursesByCategory: { category: string; count: number }[];
  mostClickedCourses: { title: string; provider: string; clicks: number }[];
  mostSavedCourses: { title: string; provider: string; saves: number }[];
  recentActivity: {
    id: string;
    type: 'click' | 'bookmark' | 'student_signup';
    description: string;
    timestamp: string;
  }[];
}

export interface Workshop {
  id: string;
  college_id: string;
  title: string;
  organizer: string;
  description: string;
  date: string;
  time?: string;
  venue: string;
  mode: 'In-Person' | 'Online' | 'Hybrid';
  registration_url?: string;
  instructor?: string;
  is_active: boolean;
  tags?: string[];
  college_name?: string;
}

