-- =========================================================
-- CoSurf - UI Marketplace Database Schema
-- Developer-grade UI designs & structured AI build prompts
-- =========================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CREATORS TABLE
CREATE TABLE IF NOT EXISTS public.creators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    display_name TEXT NOT NULL,
    avatar TEXT NOT NULL,
    bio TEXT NOT NULL,
    verified BOOLEAN DEFAULT false NOT NULL,
    total_sales INTEGER DEFAULT 0 NOT NULL,
    rating NUMERIC(3,2) DEFAULT 5.00 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_creators_user_id ON public.creators(user_id);

-- 2. UI_PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.ui_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (
        category IN (
            'AI Websites',
            'SaaS',
            'Dashboards',
            'Portfolios',
            'E-commerce',
            'Admin Panels',
            'Landing Pages',
            'Authentication',
            'Pricing Pages',
            'Student Projects',
            'Mobile UI',
            'Full Website Kits'
        )
    ),
    price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    currency TEXT NOT NULL DEFAULT 'INR',
    preview_image TEXT NOT NULL,
    gallery_images TEXT[] DEFAULT '{}',
    live_demo_url TEXT,
    creator_id UUID NOT NULL REFERENCES public.creators(id) ON DELETE CASCADE,
    technologies TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    components_included TEXT[] DEFAULT '{}',
    license_type TEXT NOT NULL DEFAULT 'Commercial',
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'pending_review', 'draft', 'rejected')),
    responsive BOOLEAN DEFAULT true NOT NULL,
    rating NUMERIC(3,2) DEFAULT 4.90 NOT NULL,
    reviews_count INTEGER DEFAULT 0 NOT NULL,
    sales_count INTEGER DEFAULT 0 NOT NULL,
    is_featured BOOLEAN DEFAULT false NOT NULL,
    is_trending BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ui_products_slug ON public.ui_products(slug);
CREATE INDEX IF NOT EXISTS idx_ui_products_category ON public.ui_products(category);
CREATE INDEX IF NOT EXISTS idx_ui_products_status ON public.ui_products(status);
CREATE INDEX IF NOT EXISTS idx_ui_products_price ON public.ui_products(price);
CREATE INDEX IF NOT EXISTS idx_ui_products_is_featured ON public.ui_products(is_featured);

-- 3. UI_PROMPTS TABLE (SECURITY CRITICAL: Never exposed in public queries)
CREATE TABLE IF NOT EXISTS public.ui_prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ui_product_id UUID NOT NULL REFERENCES public.ui_products(id) ON DELETE CASCADE UNIQUE,
    prompt_content TEXT NOT NULL,
    agent_prompts JSONB DEFAULT '{}'::jsonb,
    version TEXT NOT NULL DEFAULT '1.0.0',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ui_prompts_product ON public.ui_prompts(ui_product_id);

-- 4. PURCHASES TABLE
CREATE TABLE IF NOT EXISTS public.ui_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    ui_product_id UUID NOT NULL REFERENCES public.ui_products(id) ON DELETE CASCADE,
    payment_provider TEXT NOT NULL CHECK (payment_provider IN ('razorpay', 'free_claim', 'mock')),
    payment_order_id TEXT,
    payment_id TEXT,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
    purchased_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    CONSTRAINT unique_user_ui_purchase UNIQUE (user_id, ui_product_id)
);

CREATE INDEX IF NOT EXISTS idx_ui_purchases_user ON public.ui_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_ui_purchases_product ON public.ui_purchases(ui_product_id);

-- 5. CREATOR SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.creator_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    technologies TEXT[] DEFAULT '{}',
    preview_image TEXT NOT NULL,
    gallery_images TEXT[] DEFAULT '{}',
    live_demo_url TEXT,
    prompt_content TEXT NOT NULL,
    components_included TEXT[] DEFAULT '{}',
    features TEXT[] DEFAULT '{}',
    license_type TEXT NOT NULL DEFAULT 'Commercial',
    creator_name TEXT NOT NULL,
    creator_email TEXT NOT NULL,
    confirmed_ownership BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- RLS POLICIES
ALTER TABLE public.creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ui_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ui_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ui_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_submissions ENABLE ROW LEVEL SECURITY;

-- Products: Everyone can view published products
CREATE POLICY "Public can view published UI products"
    ON public.ui_products FOR SELECT
    USING (status = 'published');

-- Prompts: Only users with a completed purchase (or for free items claimed) can view
CREATE POLICY "Purchasers can view prompts"
    ON public.ui_prompts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.ui_purchases
            WHERE ui_purchases.ui_product_id = ui_prompts.ui_product_id
            AND ui_purchases.status = 'completed'
            AND ui_purchases.user_id = auth.uid()::text
        )
    );

-- Purchases: Users can view their own purchases
CREATE POLICY "Users can view own purchases"
    ON public.ui_purchases FOR SELECT
    USING (user_id = auth.uid()::text);
