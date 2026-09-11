# CoSurf - College Free Course & Certification Discovery Platform

> A modern, production-ready web platform for college students to discover and unlock zero-tuition online courses, free industry certifications, and exam vouchers available through their university email address.

---

## 🌟 Overview & Core Philosophy

College students frequently miss out on thousands of dollars in educational benefits, cloud credits, and certification exam vouchers simply because institutional partnerships are scattered across disparate portals, newsletters, and departmental emails.

CoSurf solves the question:
> **"What free courses and certifications can I get using my college email?"**

### Key Platform Highlights
- **Multi-College Architecture**: Start with one university (e.g., Stanford) and effortlessly scale to hundreds of colleges. Each university gets a personalized catalog with domain-specific access instructions.
- **Server-Side Domain Verification**: Email domains (e.g. `@stanford.edu`, `@mit.edu`, `@berkeley.edu`, `@iitb.ac.in`) are strictly validated on the server and database level.
- **Honest Attribution**: CoSurf is an ethical aggregation layer. We don't pirate course materials; instead, we link directly to official providers (Google Cloud, IBM, Harvard CS50, Microsoft, AWS, Cisco, Coursera) with step-by-step claiming guides.
- **Outbound Click Tracking**: Tracks which opportunities students engage with most.
- **Student Bookmarks**: Save courses to a personal dashboard with real-time sync.
- **Full-Featured Admin Suite**: Course CRUD, University management, College-Course accessibility mapping, and analytics dashboard.
- **Instant Demo Mode**: Works seamlessly right out of the box with realistic seed data even before configuring live Supabase keys!

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Server Components & Route Handlers)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS with custom design system variables & responsive layouts
- **Icons**: Lucide React
- **Notifications**: Sonner toasts
- **Backend / Database**: Supabase PostgreSQL, Supabase Auth, Row Level Security (RLS)
- **Deployment**: Optimized for Vercel

---

## 📁 Project Architecture

```
courses/
├── app/
│   ├── page.tsx                     # Landing page with hero, how-it-works, categories, featured courses
│   ├── layout.tsx                   # Root layout with Providers (College, Auth, Toaster)
│   ├── globals.css                  # Tailwind styles and theme design tokens
│   ├── courses/
│   │   ├── page.tsx                 # Course discovery page (Search, multi-filter, sorting)
│   │   └── [slug]/page.tsx          # Individual course details page & outbound claim modal
│   ├── categories/page.tsx          # Subject areas / disciplines overview
│   ├── saved/page.tsx               # Student bookmarked courses
│   ├── dashboard/page.tsx           # Personalized student dashboard with college stats
│   ├── admin/page.tsx               # Admin portal: Course CRUD, College CRUD, Mappings, Analytics
│   ├── login/page.tsx               # Student & Admin authentication with domain detection
│   ├── signup/page.tsx              # Student signup with real-time email domain validation
│   ├── api/
│   │   ├── courses/[id]/click/      # Outbound click tracking route
│   │   └── auth/verify-domain/      # Server-side college email verification route
│   ├── sitemap.ts                   # Dynamic SEO sitemap
│   └── robots.ts                    # SEO robots.txt
├── components/
│   ├── ui/                          # Button, Input, Badge, Card, Skeleton
│   ├── navigation/                  # Navbar, Footer, CollegeModal (searchable university selector)
│   └── courses/                     # CourseCard, CourseFilters, CourseGrid, ClaimModal
├── context/
│   ├── college-context.tsx          # Multi-college active selection state with persistence
│   └── auth-context.tsx             # Student / Admin session & bookmarks state
├── lib/
│   ├── mock-data.ts                 # Realistic mock dataset for colleges, categories, courses, and mappings
│   ├── utils.ts                     # Domain checkers, badge formatting, and cn helper
│   ├── supabase/
│   │   ├── client.ts                # Browser Supabase client
│   │   ├── server.ts                # Server Supabase client
│   │   └── admin.ts                 # Service-role admin client
│   └── services/                    # Database & business logic queries
│       ├── colleges.ts
│       ├── courses.ts
│       ├── categories.ts
│       ├── college-courses.ts
│       ├── bookmarks.ts
│       ├── clicks.ts
│       ├── analytics.ts
│       └── auth.ts
├── supabase/
│   ├── schema.sql                   # Full PostgreSQL schema with tables, indexes, triggers, and RLS
│   └── seed.sql                     # Seed data for universities, categories, courses, and mappings
├── types/
│   └── database.ts                  # TypeScript definitions
├── .env.example                     # Environment template
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd courses
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

> **Note**: `NEXT_PUBLIC_DEMO_MODE=true` is enabled by default in `.env.local`, allowing you to run, test, and demo all student and admin flows immediately without creating a Supabase project first.

### 4. Start the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Setup & Production Deployment

To connect CoSurf to a live Supabase project:

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create a free project.
2. Under **Project Settings -> API**, copy:
   - **Project URL**
   - **anon / public key**
   - **service_role key** (keep confidential on the server)

### Step 2: Execute SQL Schema & Seed Data
1. In the Supabase dashboard, navigate to **SQL Editor**.
2. Open `supabase/schema.sql` from this project, paste it into the SQL Editor, and click **Run**. This creates:
   - `colleges`
   - `students`
   - `courses`
   - `college_courses`
   - `categories`
   - `bookmarks`
   - `course_clicks`
   - `admins`
   - Row Level Security (RLS) policies
   - Helper functions (`verify_college_email_domain()`, `is_admin()`)
3. Open `supabase/seed.sql`, paste it into the SQL Editor, and click **Run**. This populates realistic initial colleges (Stanford, MIT, Berkeley, IIT Bombay) and top-tier courses (Google Cloud, IBM, Harvard CS50, Microsoft AI-900, AWS, etc.).

### Step 3: Configure `.env.local`
Update `.env.local` with your real keys:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_MODE=false
```

---

## ☁️ Vercel Deployment Instructions

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (e.g. `https://your-domain.vercel.app`)
   - `NEXT_PUBLIC_DEMO_MODE` (set to `false` for live database or `true` for demo)
5. Click **Deploy**. Vercel will automatically build and deploy the Next.js App Router application.

---

## 🧪 Testing the Major User Flows

### Flow 1: Student Experience
1. **College Selection**: Click the university pill in the Navbar or Hero section (defaults to *Stanford University*). Select another college (e.g. *MIT* or *UC Berkeley*) from the modal. Notice how the catalog immediately reflects university-specific access rules.
2. **Browse & Search**: Navigate to `/courses`. Use the search bar to search for `"Python"`, `"Docker"`, or `"AI"`. Filter by **Level** (*Beginner*), **Access Type** (*College Email*), or toggle **Free Certificate Only**.
3. **Course Details**: Click any course card to open `/courses/[slug]`. Review the learning outcomes, skills gained, and campus claim instructions.
4. **Outbound Redirection**: Click **"Start Course"**; the outbound click tracker triggers and opens the official provider portal in a new tab.
5. **Bookmark Course**: Click the Bookmark icon on any card or detail page.
6. **Saved Courses**: Navigate to `/saved` to view and manage your bookmarked courses.
7. **Sign In / Sign Up**: Navigate to `/signup`. Select Stanford and try entering a non-Stanford email (e.g. `test@gmail.com`). Notice the validation alert enforcing `@stanford.edu`. Enter `alex@stanford.edu` to access the personalized `/dashboard`.

### Flow 2: Admin Experience
1. Click the **"Admin Demo"** button in the Navbar or navigate to `/admin`.
2. **Analytics Tab**: View live statistics on total students, clicks, bookmarks, most popular courses, and recent student activity.
3. **Courses Tab**: Click **"Add New Course"** to insert a new course into the catalog. Toggle active/inactive or edit existing courses.
4. **Colleges Tab**: Click **"Add University"** to register a new college (e.g. *Carnegie Mellon University* with domain `cmu.edu`).
5. **Access Mappings Tab**: Click **"Map Course to College"** to assign specific courses to specific universities with custom access types (e.g. `institutional_access`, `college_email`, `student_offer`).

---

## 🔒 Security Practices
- **Row Level Security (RLS)**: Enforced on all tables. Students can only read/modify their own profiles and bookmarks.
- **Service Role Key Isolation**: Never exposed to the browser client.
- **Server-Side Validation**: Email domains are verified against the database `colleges` table via PostgreSQL functions and Next.js Route Handlers.
- **Protected Admin Views**: Unauthorized users are blocked from executing administrative operations.