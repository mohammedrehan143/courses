import { createClient } from '@/lib/supabase/client';
import {
  UIProduct,
  UIPurchase,
  MarketplaceFilterOptions,
  CreatorSubmission,
} from '@/types/marketplace';
import { MOCK_UI_PRODUCTS, MOCK_CREATORS } from '@/lib/mock-marketplace';

const isDemo = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || !url || url.includes('your-project-ref');
};

// In-memory runtime store for purchases during demo mode
const inMemoryPurchases: UIPurchase[] = [
  // Seed with one unlocked product for alex@stanford.edu / guest user
  {
    id: 'purch-seed-001',
    user_id: 'user_alex_stanford',
    ui_product_id: 'ui-prod-008', // DevKit UI (free kit already unlocked)
    payment_provider: 'free_claim',
    amount: 0,
    currency: 'INR',
    status: 'completed',
    purchased_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

// In-memory submissions store
const inMemorySubmissions: CreatorSubmission[] = [];

/**
 * Hydrates creator details into product
 */
function attachCreator(product: UIProduct): UIProduct {
  const creator = MOCK_CREATORS[product.creator_id] || {
    id: product.creator_id,
    display_name: 'Verified Creator',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    bio: 'Independent UI architect & developer.',
    verified: true,
  };
  return { ...product, creator };
}

/**
 * Filter and fetch UI products
 */
export async function getUIProducts(
  options: MarketplaceFilterOptions = {}
): Promise<{ products: UIProduct[]; total: number }> {
  const {
    search,
    category,
    technology,
    priceRange = 'all',
    sortBy = 'popular',
    featuredOnly,
    trendingOnly,
    page = 1,
    limit = 50,
  } = options;

  if (isDemo()) {
    let result = MOCK_UI_PRODUCTS.map(attachCreator).filter((p) => p.status === 'published');

    // Filter search
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.technologies.some((t) => t.toLowerCase().includes(q)) ||
          p.creator?.display_name.toLowerCase().includes(q)
      );
    }

    // Filter category
    if (category && category !== 'all') {
      result = result.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter technology
    if (technology && technology !== 'all') {
      result = result.filter((p) =>
        p.technologies.some((t) => t.toLowerCase() === technology.toLowerCase())
      );
    }

    // Filter price range
    if (priceRange === 'free') {
      result = result.filter((p) => p.price === 0);
    } else if (priceRange === 'under-199') {
      result = result.filter((p) => p.price > 0 && p.price < 199);
    } else if (priceRange === '199-499') {
      result = result.filter((p) => p.price >= 199 && p.price <= 499);
    } else if (priceRange === '500-plus') {
      result = result.filter((p) => p.price > 499);
    }

    // Filters for featured / trending
    if (featuredOnly) {
      result = result.filter((p) => p.is_featured);
    }
    if (trendingOnly) {
      result = result.filter((p) => p.is_trending);
    }

    // Sorting
    if (sortBy === 'popular') {
      result.sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'featured') {
      result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    const total = result.length;
    const startIndex = (page - 1) * limit;
    const paginated = result.slice(startIndex, startIndex + limit);

    return { products: paginated, total };
  }

  // Live Supabase Mode
  const supabase = createClient();
  let query = supabase.from('ui_products').select('*, creator:creators(*)', { count: 'exact' });

  query = query.eq('status', 'published');

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }
  if (priceRange === 'free') {
    query = query.eq('price', 0);
  } else if (priceRange === 'under-199') {
    query = query.gt('price', 0).lt('price', 199);
  } else if (priceRange === '199-499') {
    query = query.gte('price', 199).lte('price', 499);
  } else if (priceRange === '500-plus') {
    query = query.gt('price', 499);
  }

  if (sortBy === 'popular') {
    query = query.order('sales_count', { ascending: false });
  } else if (sortBy === 'newest') {
    query = query.order('created_at', { ascending: false });
  } else if (sortBy === 'price_asc') {
    query = query.order('price', { ascending: true });
  } else if (sortBy === 'price_desc') {
    query = query.order('price', { ascending: false });
  }

  const { data, count, error } = await query;
  if (error) {
    console.error('Error fetching UI products:', error);
    return { products: [], total: 0 };
  }

  return { products: (data as unknown as UIProduct[]) || [], total: count || 0 };
}

/**
 * Get product by slug
 */
export async function getUIProductBySlug(slug: string): Promise<UIProduct | null> {
  if (isDemo()) {
    const found = MOCK_UI_PRODUCTS.find((p) => p.slug === slug);
    return found ? attachCreator(found) : null;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('ui_products')
    .select('*, creator:creators(*)')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data as unknown as UIProduct;
}

/**
 * Get product by ID
 */
export async function getUIProductById(id: string): Promise<UIProduct | null> {
  if (isDemo()) {
    const found = MOCK_UI_PRODUCTS.find((p) => p.id === id);
    return found ? attachCreator(found) : null;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('ui_products')
    .select('*, creator:creators(*)')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as unknown as UIProduct;
}

/**
 * Check if a user has purchased a product
 */
export async function checkUserPurchase(userId: string, productId: string): Promise<boolean> {
  if (!userId || !productId) return false;

  if (isDemo()) {
    return inMemoryPurchases.some(
      (p) => (p.user_id === userId || p.user_id === 'user_alex_stanford') && p.ui_product_id === productId && p.status === 'completed'
    );
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('ui_purchases')
    .select('id')
    .eq('user_id', userId)
    .eq('ui_product_id', productId)
    .eq('status', 'completed')
    .maybeSingle();

  if (error || !data) return false;
  return true;
}

/**
 * Record a purchase (called after server payment verification)
 */
export async function recordPurchase(params: {
  userId: string;
  productId: string;
  amount: number;
  currency?: string;
  provider: 'razorpay' | 'free_claim' | 'mock';
  orderId?: string;
  paymentId?: string;
}): Promise<UIPurchase> {
  const purchase: UIPurchase = {
    id: `purch_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user_id: params.userId,
    ui_product_id: params.productId,
    amount: params.amount,
    currency: params.currency || 'INR',
    payment_provider: params.provider,
    payment_order_id: params.orderId,
    payment_id: params.paymentId,
    status: 'completed',
    purchased_at: new Date().toISOString(),
  };

  if (isDemo()) {
    // Check if already exists
    const existing = inMemoryPurchases.find(
      (p) => p.user_id === params.userId && p.ui_product_id === params.productId
    );
    if (!existing) {
      inMemoryPurchases.unshift(purchase);
    }
    return existing || purchase;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('ui_purchases')
    .insert([
      {
        id: purchase.id,
        user_id: purchase.user_id,
        ui_product_id: purchase.ui_product_id,
        amount: purchase.amount,
        currency: purchase.currency,
        payment_provider: purchase.payment_provider,
        payment_order_id: purchase.payment_order_id,
        payment_id: purchase.payment_id,
        status: purchase.status,
        purchased_at: purchase.purchased_at,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to record purchase: ${error.message}`);
  }

  return data as unknown as UIPurchase;
}

/**
 * Get all purchases for a user
 */
export async function getUserPurchases(userId: string): Promise<UIPurchase[]> {
  if (!userId) return [];

  if (isDemo()) {
    const list = inMemoryPurchases.filter(
      (p) => (p.user_id === userId || p.user_id === 'user_alex_stanford') && p.status === 'completed'
    );
    return list.map((item) => {
      const prod = MOCK_UI_PRODUCTS.find((p) => p.id === item.ui_product_id);
      return {
        ...item,
        product: prod ? attachCreator(prod) : undefined,
      };
    });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('ui_purchases')
    .select('*, product:ui_products(*, creator:creators(*))')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .order('purchased_at', { ascending: false });

  if (error || !data) return [];
  return data as unknown as UIPurchase[];
}

/**
 * Submit a creator UI design for review
 */
export async function submitCreatorDesign(submission: Omit<CreatorSubmission, 'id' | 'status' | 'created_at'>): Promise<CreatorSubmission> {
  const newSubmission: CreatorSubmission = {
    ...submission,
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    status: 'pending_review',
    created_at: new Date().toISOString(),
  };

  if (isDemo()) {
    inMemorySubmissions.unshift(newSubmission);
    return newSubmission;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('creator_submissions')
    .insert([newSubmission])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as unknown as CreatorSubmission;
}

/**
 * Get creator submissions
 */
export async function getCreatorSubmissions(): Promise<CreatorSubmission[]> {
  if (isDemo()) {
    return inMemorySubmissions;
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from('creator_submissions')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as unknown as CreatorSubmission[];
}
