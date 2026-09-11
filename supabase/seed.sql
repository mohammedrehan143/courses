-- =========================================================
-- CoSurf - Supabase Seed Data
-- =========================================================

-- Clear existing seed data if needed
DELETE FROM public.course_clicks;
DELETE FROM public.bookmarks;
DELETE FROM public.college_courses;
DELETE FROM public.workshops;
DELETE FROM public.courses;
DELETE FROM public.categories;
DELETE FROM public.students;
DELETE FROM public.colleges;

-- 1. SEED COLLEGES (Prominently featuring BMSIT)
INSERT INTO public.colleges (id, name, short_name, domain, logo_url, description, location, is_active) VALUES
('c0000000-0000-0000-0000-000000000005', 'BMS Institute of Technology and Management', 'BMSIT', 'bmsit.in', 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=400&q=80', 'Autonomous engineering college in Yelahanka, Bangalore, Karnataka with active industry partnerships.', 'Yelahanka, Bangalore, India', true),
('c0000000-0000-0000-0000-000000000001', 'Stanford University', 'Stanford', 'stanford.edu', 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=400&q=80', 'World-leading private research university in Stanford, California.', 'Stanford, CA, USA', true),
('c0000000-0000-0000-0000-000000000002', 'Massachusetts Institute of Technology', 'MIT', 'mit.edu', 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=400&q=80', 'Renowned institute focused on science and technological education.', 'Cambridge, MA, USA', true),
('c0000000-0000-0000-0000-000000000003', 'University of California, Berkeley', 'UC Berkeley', 'berkeley.edu', 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=400&q=80', 'Top public research university known for computer science and engineering.', 'Berkeley, CA, USA', true),
('c0000000-0000-0000-0000-000000000004', 'Indian Institute of Technology Bombay', 'IIT Bombay', 'iitb.ac.in', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=80', 'Premier technical and research institute of higher education in Mumbai, India.', 'Mumbai, India', true);

-- 2. SEED CATEGORIES
INSERT INTO public.categories (id, name, slug, icon, description) VALUES
('a0000000-0000-0000-0000-000000000001', 'Cloud Computing & AI', 'cloud-ai', 'Cloud', 'AWS, Microsoft Azure, Google Cloud infrastructure, and Generative AI.'),
('a0000000-0000-0000-0000-000000000002', 'Developer Tools & IDEs', 'dev-tools', 'Code2', 'GitHub Student Pack, JetBrains IDEs, and developer tooling.'),
('a0000000-0000-0000-0000-000000000003', 'Data Science & Analytics', 'data-science', 'Database', 'Data pipelines, Python analytics, SQL, and Coursera financial aid.'),
('a0000000-0000-0000-0000-000000000004', 'Full-Stack & Web Development', 'web-development', 'Terminal', 'freeCodeCamp, responsive design, JavaScript, Python, and SQL databases.'),
('a0000000-0000-0000-0000-000000000005', 'Academic Programs', 'academic-programs', 'Briefcase', 'NPTEL, SWAYAM, Infosys Springboard, Salesforce Trailhead, and HubSpot.');

-- 3. SEED THE EXACT 13 COURSES
INSERT INTO public.courses (
    id, slug, title, provider, description, category_id, category, level, duration,
    certification_available, certificate_type, course_url, image_url, requirements,
    what_you_learn, skills_gained, is_free, is_active, is_featured
) VALUES
(
    'b0000000-0000-0000-0000-000000000001',
    'aws-student-rewards',
    'AWS Student Rewards (brand new, Aug 2026)',
    'AWS Skill Builder',
    '12 months premium AWS Skill Builder (900+ cloud/AI courses) + a $100 voucher toward the AWS Certified Cloud Practitioner exam once you hit 21 community badges. Seven badges unlocks US$10 in AWS credits, 14 badges unlocks another US$20, and 21 badges unlocks an AWS Certification Foundational exam voucher worth US$100.',
    'a0000000-0000-0000-0000-000000000001',
    'Cloud Computing & AI',
    'Beginner',
    '3–6 weeks (instant access)',
    true,
    'AWS Certified Cloud Practitioner Exam Voucher ($100 Value)',
    'https://builder.aws.com',
    'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=800&q=80',
    'Yes — verification is handled through SheerID, with most checks completed within minutes; students must be 18 or over.',
    ARRAY['12 months premium AWS Skill Builder', 'Community badge challenges', '$30 in AWS cloud credits', '$100 Foundational Exam Voucher'],
    ARRAY['AWS', 'Cloud Architecture', 'IAM', 'EC2', 'S3', 'Generative AI on AWS'],
    true, true, true
),
(
    'b0000000-0000-0000-0000-000000000002',
    'github-student-developer-pack',
    'GitHub Student Developer Pack',
    'GitHub Education',
    'Not one certificate — a hub unlocking 100+ free partner tools & courses (JetBrains, Educative, MongoDB cert vouchers, cloud credits).',
    'a0000000-0000-0000-0000-000000000002',
    'Developer Tools & IDEs',
    'All Levels',
    'Approval in hours to days',
    true,
    'Multiple Certification Vouchers & Pro Tier Badges',
    'https://education.github.com/pack',
    'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80',
    'Yes — a school email address, plus a picture of your student ID for a higher chance of approval.',
    ARRAY['Free GitHub Pro subscription', 'JetBrains All Products Pack', 'MongoDB certification vouchers', 'Educative courses & cloud credits'],
    ARRAY['Git', 'GitHub', 'Open Source', 'MongoDB', 'DevOps'],
    true, true, true
),
(
    'b0000000-0000-0000-0000-000000000003',
    'microsoft-certifications-az900-ai900',
    'Microsoft Certifications (AZ-900, AI-900, etc.)',
    'Microsoft Learn',
    'Learning is always free; the exam itself ($99–165) is only free during voucher windows. Microsoft Certification Week runs September 28 – October 2, 2026 — score 80% or higher on a LevelUp practice assessment and you get a free exam voucher.',
    'a0000000-0000-0000-0000-000000000001',
    'Cloud Computing & AI',
    'Beginner',
    '~10–15 hrs self-paced',
    true,
    'Microsoft Certified Professional (AZ-900 / AI-900 Voucher)',
    'https://learn.microsoft.com',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    'Verified on Microsoft Learn student assessment portal with student email.',
    ARRAY['Azure Cloud fundamentals', 'Azure AI Services & Computer Vision', 'LevelUp practice assessment', 'Free exam voucher upon 80% score'],
    ARRAY['Azure', 'AI-900', 'AZ-900', 'Cloud Architecture'],
    true, true, true
),
(
    'b0000000-0000-0000-0000-000000000004',
    'jetbrains-student-pack',
    'JetBrains Student Pack',
    'JetBrains',
    'The full suite of JetBrains IDEs plus AI Assistant, Junie, and Academy courses.',
    'a0000000-0000-0000-0000-000000000002',
    'Developer Tools & IDEs',
    'All Levels',
    'Renews yearly while enrolled',
    true,
    'JetBrains Academy Certificates & Professional IDE Licenses',
    'https://www.jetbrains.com/community/education',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    'Yes — your university domain must be in JetBrains SWOT repository, or you can apply with a valid ISIC card.',
    ARRAY['IntelliJ IDEA Ultimate', 'PyCharm Professional', 'WebStorm and CLion', 'AI Assistant integration'],
    ARRAY['Java', 'Python', 'Web Development', 'IDEs'],
    true, true, true
),
(
    'b0000000-0000-0000-0000-000000000005',
    'linkedin-learning',
    'LinkedIn Learning',
    'LinkedIn Learning',
    'Shareable completion certificates on 16,000+ courses across engineering, business, and design.',
    'a0000000-0000-0000-0000-000000000005',
    'Academic Programs',
    'All Levels',
    'Most courses 1–4 hrs',
    true,
    'Shareable LinkedIn Completion Certificates',
    'https://www.linkedin.com/learning',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    'Depends entirely on your college — many universities now buy full student access through a library or IT subscription.',
    ARRAY['16,000+ expert-led courses', 'Add badges directly to LinkedIn profile', 'Self-paced video modules with exercise files'],
    ARRAY['LinkedIn Certificates', 'Software Engineering', 'Business'],
    true, true, false
),
(
    'b0000000-0000-0000-0000-000000000006',
    'google-cloud-skills-boost',
    'Google Cloud Skills Boost',
    'Google Cloud',
    'Free skill badges + a free 10-course Generative AI path; the full catalog needs a $29/month subscription unless your university has a partner deal.',
    'a0000000-0000-0000-0000-000000000001',
    'Cloud Computing & AI',
    'Beginner',
    'Skill badges: 2–6 hrs each',
    true,
    'Google Cloud Skill Badges & Course Badges',
    'https://www.cloudskillsboost.google',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    'None for the free tier; college students receive lab credit waivers.',
    ARRAY['Introduction to Generative AI', 'Large Language Models (LLMs)', 'Vertex AI Studio', 'Google Cloud Skill Badges'],
    ARRAY['Google Cloud', 'Vertex AI', 'Generative AI', 'LLMs'],
    true, true, true
),
(
    'b0000000-0000-0000-0000-000000000007',
    'coursera-financial-aid',
    'Coursera — Financial Aid route',
    'Coursera',
    'Google Data Analytics, IBM Data Science, Meta Marketing & other Professional Certificates, normally $49+/month.',
    'a0000000-0000-0000-0000-000000000003',
    'Data Science & Analytics',
    'All Levels',
    'Single course 10–40 hrs; Professional Certificates 2–6 months part-time',
    true,
    'Google, IBM & Meta Official Professional Certificates',
    'https://www.coursera.org',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    'Not student-specific — apply for Financial Aid on the course page; it is reviewed within about 15 days.',
    ARRAY['Google Data Analytics Certificate', 'IBM Full-Stack Certificate', 'Meta Front-End Certificate', 'Career resources'],
    ARRAY['Data Analytics', 'Python', 'SQL', 'React'],
    true, true, true
),
(
    'b0000000-0000-0000-0000-000000000008',
    'ibm-skillsbuild',
    'IBM SkillsBuild',
    'IBM SkillsBuild',
    'Certificate pathways in AI, Cybersecurity, Data Analytics, IT Support, UX Design, and Software Engineering.',
    'a0000000-0000-0000-0000-000000000001',
    'Cloud Computing & AI',
    'Beginner',
    'Hours to a few weeks per pathway',
    true,
    'Official IBM Digital Credential (Credly)',
    'https://skillsbuild.org',
    'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=800&q=80',
    'No — open to all college students, no email gate.',
    ARRAY['AI Fundamentals', 'Cybersecurity Analyst', 'Data Analytics', 'Design Thinking'],
    ARRAY['AI Fundamentals', 'Cybersecurity', 'Data Analytics', 'IBM Credly'],
    true, true, true
),
(
    'b0000000-0000-0000-0000-000000000009',
    'salesforce-trailhead',
    'Salesforce Trailhead',
    'Salesforce',
    'Free digital badges/Superbadges for your resume; the official proctored certification usually costs $200–300.',
    'a0000000-0000-0000-0000-000000000005',
    'Academic Programs',
    'Beginner to Advanced',
    'Roughly 60–100 hours of free modules to reach Admin-cert-ready',
    true,
    'Salesforce Superbadges & Resume Credentials',
    'https://trailhead.salesforce.com',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    'No — free and open to all students.',
    ARRAY['Salesforce Admin skills', 'Flow automations', 'Apex programming', 'Superbadges'],
    ARRAY['Salesforce', 'CRM', 'Apex', 'Flow'],
    true, true, false
),
(
    'b0000000-0000-0000-0000-000000000010',
    'hubspot-academy',
    'HubSpot Academy',
    'HubSpot Academy',
    'Free certifications with a passing exam and a downloadable, shareable credential — Marketing, Sales, SEO, etc.',
    'a0000000-0000-0000-0000-000000000005',
    'Academic Programs',
    'Beginner',
    'A few hours to ~2 months',
    true,
    'Official HubSpot Industry Certificate & Digital Badge',
    'https://academy.hubspot.com',
    'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80',
    'No — free for everyone.',
    ARRAY['Inbound marketing methodology', 'SEO fundamentals', 'Social media marketing', 'CRM workflows'],
    ARRAY['Digital Marketing', 'SEO', 'Content Strategy'],
    true, true, false
),
(
    'b0000000-0000-0000-0000-000000000011',
    'freecodecamp',
    'freeCodeCamp',
    'freeCodeCamp',
    'Certifications in Responsive Web Design, JavaScript, Python, Relational Databases, and Full-Stack Development.',
    'a0000000-0000-0000-0000-000000000004',
    'Full-Stack & Web Development',
    'Beginner to Advanced',
    'Self-paced; full curriculum 300+ hrs',
    true,
    'Verified freeCodeCamp Certification',
    'https://www.freecodecamp.org',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    'No — free for everyone.',
    ARRAY['Responsive Web Design', 'JavaScript Algorithms', 'Front End Libraries', 'Relational Databases'],
    ARRAY['HTML5', 'CSS3', 'JavaScript', 'Python', 'SQL'],
    true, true, true
),
(
    'b0000000-0000-0000-0000-000000000012',
    'infosys-springboard',
    'Infosys Springboard (India)',
    'Infosys Springboard',
    '20,000+ free courses and 6,600+ certifications across AI, data science, cybersecurity, soft skills.',
    'a0000000-0000-0000-0000-000000000005',
    'Academic Programs',
    'Beginner to Intermediate',
    'Hours to weeks',
    true,
    'Official Infosys Springboard Verified Certificate',
    'https://infyspringboard.onwingspan.com',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    'No — open to all, aimed at students.',
    ARRAY['Java & Python development', 'Cloud & Cybersecurity', 'Corporate interview preparation', 'Automated certificates'],
    ARRAY['Java', 'Python', 'Full-Stack', 'Cybersecurity'],
    true, true, true
),
(
    'b0000000-0000-0000-0000-000000000013',
    'nptel-swayam-govt-india',
    'NPTEL / SWAYAM (Govt. of India)',
    'NPTEL / SWAYAM',
    'Certificate from an IIT/IISc or top Indian university after a proctored exam. Learning is free; the certificate exam itself costs ₹1,000 for NPTEL, or ₹500–750 for SWAYAM depending on category.',
    'a0000000-0000-0000-0000-000000000005',
    'Academic Programs',
    'All Levels',
    '4, 8, or 12-week courses with assignments',
    true,
    'IIT / IISc Verified Certificate & College Credit Transfer',
    'https://swayam.gov.in',
    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80',
    'Learning is free; certificate exam itself costs ₹1,000 for NPTEL, or ₹500–750 for SWAYAM.',
    ARRAY['IIT & IISc academic curriculum', 'Graded assignments & tests', 'Academic credit transfer to degree', 'Proctored in-person exam option'],
    ARRAY['Data Structures', 'Computer Networks', 'Machine Learning', 'Academic Credits'],
    true, true, true
);

-- 4. SEED CAMPUS WORKSHOPS (FOR BMSIT & COLLEGES)
INSERT INTO public.workshops (
    id, college_id, title, organizer, description, date, time, venue, mode, registration_url, instructor, is_active, tags
) VALUES
(
    'd0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000005', -- BMSIT
    'Hands-on Generative AI & Vertex AI Campus Workshop',
    'Google Developer Student Clubs (GDSC) BMSIT & Dept. of CSE',
    'Live coding boot camp on building Retrieval-Augmented Generation (RAG) models, prompt engineering, and LLM applications using Google Cloud Vertex AI. Free lunch and Google Cloud swags provided.',
    'Saturday, Sept 26, 2026',
    '10:00 AM - 4:30 PM IST',
    'BMSIT Main Seminar Hall, Academic Block 1, Bangalore',
    'In-Person',
    'https://bmsit.in',
    'Google Developer Expert (AI/ML)',
    true,
    ARRAY['Generative AI', 'Vertex AI', 'Free Swags', 'Hands-on']
),
(
    'd0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000005', -- BMSIT
    'AWS Cloud Day: Practitioner Bootcamp & $100 Voucher Drop',
    'Dept. of Information Science & Engineering (ISE) x AWS Academy',
    'Hands-on architectural sandbox session on EC2, S3, IAM, and serverless architectures. All participating BMSIT students receive guidance on unlocking their $100 AWS certification voucher.',
    'Wednesday, Oct 7, 2026',
    '2:00 PM - 5:30 PM IST',
    'Tech Hub Lab 4, 3rd Floor, BMSIT Campus',
    'In-Person',
    'https://bmsit.in',
    'AWS Certified Solutions Architect',
    true,
    ARRAY['AWS', 'Cloud', '$100 Voucher', 'Hands-on Lab']
),
(
    'd0000000-0000-0000-0000-000000000003',
    'c0000000-0000-0000-0000-000000000005', -- BMSIT
    'Cybersecurity Incident Response & Capture The Flag (CTF)',
    'BMSIT Cyber Security Cell & Cisco Networking Academy',
    'Live Wireshark packet inspection, defensive host analysis, firewall rule configuration, and introductory CTF challenges with certificate of participation.',
    'Friday, Oct 16, 2026',
    '9:30 AM - 3:00 PM IST',
    'BMSIT Auditorium & Hybrid Online Stream',
    'Hybrid',
    'https://bmsit.in',
    'Senior SOC Security Specialist',
    true,
    ARRAY['Cybersecurity', 'CTF', 'Wireshark', 'Certificate']
),
(
    'd0000000-0000-0000-0000-000000000004',
    'c0000000-0000-0000-0000-000000000005', -- BMSIT
    'GitHub Campus Day & Open Source Hackathon',
    'GitHub Campus Experts @ BMSIT',
    'Demystifying Open Source contributions: branch management, PR workflows, automated tests with GitHub Actions, and 1-on-1 assistance claiming the GitHub Student Developer Pack.',
    'Saturday, Oct 24, 2026',
    '11:00 AM - 5:00 PM IST',
    'BMSIT Open Air Amphitheatre',
    'In-Person',
    'https://bmsit.in',
    'GitHub Campus Expert',
    true,
    ARRAY['Open Source', 'GitHub Pack', 'Hackathon']
);

-- 5. SEED COLLEGE_COURSES MAPPINGS FOR BMSIT
INSERT INTO public.college_courses (college_id, course_id, access_type, verification_required, special_instructions, is_active)
SELECT 
    'c0000000-0000-0000-0000-000000000005',
    c.id,
    'college_email',
    true,
    'Verified for BMSIT students. Use your @bmsit.in email or student ID card to claim free access.',
    true
FROM public.courses c;
