import { createClient } from '@/lib/supabase/client';
import { Category } from '@/types/database';
import { MOCK_CATEGORIES } from '@/lib/mock-data';

const isDemo = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || !url || url.includes('your-project-ref');
};

let localCategories = [...MOCK_CATEGORIES];

export async function getCategories(): Promise<Category[]> {
  if (isDemo()) {
    return localCategories;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      return localCategories;
    }
    return data as Category[];
  } catch {
    return localCategories;
  }
}

export async function createCategory(category: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
  const newCat: Category = {
    ...category,
    id: 'cat_' + Math.random().toString(36).substring(2, 11),
    created_at: new Date().toISOString(),
  };

  if (isDemo()) {
    localCategories.push(newCat);
    return newCat;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  } catch {
    localCategories.push(newCat);
    return newCat;
  }
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
  if (isDemo()) {
    const idx = localCategories.findIndex((c) => c.id === id);
    if (idx !== -1) {
      localCategories[idx] = { ...localCategories[idx], ...updates };
      return localCategories[idx];
    }
    return null;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  } catch {
    const idx = localCategories.findIndex((c) => c.id === id);
    if (idx !== -1) {
      localCategories[idx] = { ...localCategories[idx], ...updates };
      return localCategories[idx];
    }
    return null;
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  if (isDemo()) {
    localCategories = localCategories.filter((c) => c.id !== id);
    return true;
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch {
    localCategories = localCategories.filter((c) => c.id !== id);
    return true;
  }
}
