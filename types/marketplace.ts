export type UICategory =
  | 'AI Websites'
  | 'SaaS'
  | 'Dashboards'
  | 'Portfolios'
  | 'E-commerce'
  | 'Admin Panels'
  | 'Landing Pages'
  | 'Authentication'
  | 'Pricing Pages'
  | 'Student Projects'
  | 'Mobile UI'
  | 'Full Website Kits';

export type UITechnology =
  | 'React'
  | 'Next.js'
  | 'Vue'
  | 'HTML/CSS'
  | 'Tailwind'
  | 'TypeScript'
  | 'Shadcn UI'
  | 'Supabase'
  | 'Framer Motion';

export type AIAgentType =
  | 'general'
  | 'claude'
  | 'cursor'
  | 'antigravity'
  | 'gemini'
  | 'codex';

export interface Creator {
  id: string;
  user_id?: string;
  display_name: string;
  avatar: string;
  bio: string;
  verified?: boolean;
  total_sales?: number;
  rating?: number;
  created_at?: string;
}

export interface UIProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: UICategory;
  price: number; // in INR (0 = free)
  currency: string; // 'INR'
  preview_image: string;
  gallery_images: string[];
  live_demo_url?: string;
  creator_id: string;
  creator?: Creator;
  technologies: UITechnology[];
  features: string[];
  components_included: string[];
  license_type: 'Personal' | 'Commercial' | 'Extended Commercial' | 'MIT';
  status: 'published' | 'pending_review' | 'draft' | 'rejected';
  responsive: boolean;
  rating: number;
  reviews_count: number;
  is_featured?: boolean;
  is_trending?: boolean;
  is_new?: boolean;
  sales_count?: number;
  created_at: string;
  updated_at: string;
}

export interface UIPrompt {
  id: string;
  ui_product_id: string;
  prompt_content: string;
  version: string;
  agent_prompts?: Partial<Record<AIAgentType, string>>;
  created_at?: string;
  updated_at?: string;
}

export interface UIPurchase {
  id: string;
  user_id: string;
  ui_product_id: string;
  payment_provider: 'razorpay' | 'free_claim' | 'mock';
  payment_order_id?: string;
  payment_id?: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  purchased_at: string;
  product?: UIProduct;
}

export interface CreatorSubmission {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  category: UICategory;
  price: number;
  technologies: UITechnology[];
  preview_image: string;
  gallery_images: string[];
  live_demo_url?: string;
  prompt_content: string;
  components_included: string[];
  features: string[];
  license_type: string;
  creator_name: string;
  creator_email: string;
  confirmed_ownership: boolean;
  status: 'pending_review' | 'approved' | 'rejected';
  created_at: string;
  notes?: string;
}

export interface MarketplaceFilterOptions {
  search?: string;
  category?: string;
  technology?: string;
  priceRange?: 'all' | 'free' | 'under-199' | '199-499' | '500-plus';
  sortBy?: 'popular' | 'newest' | 'price_asc' | 'price_desc' | 'featured';
  featuredOnly?: boolean;
  trendingOnly?: boolean;
  page?: number;
  limit?: number;
}
