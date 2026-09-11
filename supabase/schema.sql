-- =========================================================
-- CoSurf - Supabase Database Schema
-- Multi-college Free Course & Certification Discovery
-- =========================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. COLLEGES TABLE
CREATE TABLE IF NOT EXISTS public.colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    domain TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    description TEXT,
    location TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_colleges_domain ON public.colleges(domain);
CREATE INDEX IF NOT EXISTS idx_colleges_is_active ON public.colleges(is_active);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- 3. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    provider TEXT NOT NULL,
    description TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    category TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced', 'All Levels')),
    duration TEXT NOT NULL,
    certification_available BOOLEAN DEFAULT true NOT NULL,
    certificate_type TEXT DEFAULT 'Free Verified Certificate',
    course_url TEXT NOT NULL,
    image_url TEXT,
    requirements TEXT,
    what_you_learn TEXT[] DEFAULT '{}',
    skills_gained TEXT[] DEFAULT '{}',
    is_free BOOLEAN DEFAULT true NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    is_featured BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_level ON public.courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_is_active ON public.courses(is_active);
CREATE INDEX IF NOT EXISTS idx_courses_is_featured ON public.courses(is_featured);

-- 4. COLLEGE_COURSES JUNCTION TABLE
CREATE TABLE IF NOT EXISTS public.college_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    access_type TEXT NOT NULL CHECK (
        access_type IN (
            'college_email',
            'student_offer',
            'institutional_access',
            'completely_free',
            'scholarship',
            'partnership'
        )
    ),
    verification_required BOOLEAN DEFAULT true NOT NULL,
    special_instructions TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT unique_college_course UNIQUE (college_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_college_courses_college_id ON public.college_courses(college_id);
CREATE INDEX IF NOT EXISTS idx_college_courses_course_id ON public.college_courses(course_id);
CREATE INDEX IF NOT EXISTS idx_college_courses_access_type ON public.college_courses(access_type);

-- 5. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_students_auth_user_id ON public.students(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_students_college_id ON public.students(college_id);
CREATE INDEX IF NOT EXISTS idx_students_email ON public.students(email);

-- 6. BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT unique_student_bookmark UNIQUE (student_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_student_id ON public.bookmarks(student_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_course_id ON public.bookmarks(course_id);

-- 7. COURSE CLICKS TABLE (OUTBOUND TRACKING)
CREATE TABLE IF NOT EXISTS public.course_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    clicked_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_course_clicks_course_id ON public.course_clicks(course_id);
CREATE INDEX IF NOT EXISTS idx_course_clicks_clicked_at ON public.course_clicks(clicked_at);

-- 8. ADMINS TABLE
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'college_admin')),
    college_id UUID REFERENCES public.colleges(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admins_auth_user_id ON public.admins(auth_user_id);

-- 9. WORKSHOPS TABLE (CAMPUS UPDATES & EVENTS)
CREATE TABLE IF NOT EXISTS public.workshops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    organizer TEXT NOT NULL,
    description TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT,
    venue TEXT NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('In-Person', 'Online', 'Hybrid')),
    registration_url TEXT,
    instructor TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_workshops_college_id ON public.workshops(college_id);
CREATE INDEX IF NOT EXISTS idx_workshops_is_active ON public.workshops(is_active);

-- =========================================================
-- HELPER FUNCTIONS & TRIGGERS
-- =========================================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER trigger_courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to verify college domain matching
CREATE OR REPLACE FUNCTION verify_college_email_domain(p_email TEXT, p_college_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_domain TEXT;
    v_email_domain TEXT;
BEGIN
    SELECT domain INTO v_domain FROM public.colleges WHERE id = p_college_id AND is_active = true;
    IF v_domain IS NULL THEN
        RETURN FALSE;
    END IF;
    
    v_email_domain := lower(split_part(p_email, '@', 2));
    
    -- Check exact match or subdomain (e.g., student.college.edu matches college.edu)
    IF v_email_domain = lower(v_domain) OR v_email_domain LIKE '%.' || lower(v_domain) THEN
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admins
        WHERE auth_user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;

-- 1. COLLEGES POLICIES
-- Everyone can read active colleges
CREATE POLICY "Allow public read access to active colleges"
    ON public.colleges FOR SELECT
    USING (is_active = true OR public.is_admin());

-- Admins can insert/update/delete colleges
CREATE POLICY "Allow admins to manage colleges"
    ON public.colleges FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 2. CATEGORIES POLICIES
-- Everyone can read categories
CREATE POLICY "Allow public read access to categories"
    ON public.categories FOR SELECT
    USING (true);

-- Admins can manage categories
CREATE POLICY "Allow admins to manage categories"
    ON public.categories FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 3. COURSES POLICIES
-- Public can read active courses
CREATE POLICY "Allow public read access to active courses"
    ON public.courses FOR SELECT
    USING (is_active = true OR public.is_admin());

-- Admins can manage all courses
CREATE POLICY "Allow admins to manage courses"
    ON public.courses FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4. COLLEGE_COURSES POLICIES
-- Public can read active college course mappings
CREATE POLICY "Allow read active college courses"
    ON public.college_courses FOR SELECT
    USING (is_active = true OR public.is_admin());

-- Admins can manage college courses
CREATE POLICY "Allow admins to manage college courses"
    ON public.college_courses FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 5. STUDENTS POLICIES
-- Students can read their own profile, admins can read all
CREATE POLICY "Students can read own profile"
    ON public.students FOR SELECT
    USING (auth_user_id = auth.uid() OR public.is_admin());

-- Students can insert their own profile
CREATE POLICY "Students can insert own profile"
    ON public.students FOR INSERT
    WITH CHECK (auth_user_id = auth.uid());

-- Students can update their own profile
CREATE POLICY "Students can update own profile"
    ON public.students FOR UPDATE
    USING (auth_user_id = auth.uid())
    WITH CHECK (auth_user_id = auth.uid());

-- 6. BOOKMARKS POLICIES
-- Students can view their own bookmarks
CREATE POLICY "Students can view own bookmarks"
    ON public.bookmarks FOR SELECT
    USING (
        student_id IN (
            SELECT id FROM public.students WHERE auth_user_id = auth.uid()
        ) OR public.is_admin()
    );

-- Students can insert their own bookmarks
CREATE POLICY "Students can insert own bookmarks"
    ON public.bookmarks FOR INSERT
    WITH CHECK (
        student_id IN (
            SELECT id FROM public.students WHERE auth_user_id = auth.uid()
        )
    );

-- Students can delete their own bookmarks
CREATE POLICY "Students can delete own bookmarks"
    ON public.bookmarks FOR DELETE
    USING (
        student_id IN (
            SELECT id FROM public.students WHERE auth_user_id = auth.uid()
        )
    );

-- 7. COURSE CLICKS POLICIES
-- Anyone can insert a click (authenticated or anonymous)
CREATE POLICY "Allow insert click log"
    ON public.course_clicks FOR INSERT
    WITH CHECK (true);

-- Only admins can view click analytics
CREATE POLICY "Admins can view click logs"
    ON public.course_clicks FOR SELECT
    USING (public.is_admin());

-- 8. ADMINS POLICIES
-- Admins can view admins table
CREATE POLICY "Admins can view admins"
    ON public.admins FOR SELECT
    USING (public.is_admin() OR auth_user_id = auth.uid());

-- 9. WORKSHOPS POLICIES
-- Public can read active workshops
CREATE POLICY "Allow public read access to active workshops"
    ON public.workshops FOR SELECT
    USING (is_active = true OR public.is_admin());

-- Admins can manage workshops
CREATE POLICY "Allow admins to manage workshops"
    ON public.workshops FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

