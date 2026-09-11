import { createClient } from '@/lib/supabase/client';
import { College } from '@/types/database';
import { MOCK_COLLEGES } from '@/lib/mock-data';

const isDemo = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || !url || url.includes('your-project-ref');
};

// In-memory/local cache for demo operations
let localColleges = [...MOCK_COLLEGES];

export async function getColleges(): Promise<College[]> {
  if (isDemo()) {
    return localColleges.filter((c) => c.is_active);
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      return localColleges;
    }

    return data as College[];
  } catch {
    return localColleges;
  }
}

export async function getAllCollegesForAdmin(): Promise<College[]> {
  if (isDemo()) {
    return localColleges;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return localColleges;
    }
    return data as College[];
  } catch {
    return localColleges;
  }
}

export async function getCollegeById(id: string): Promise<College | null> {
  if (isDemo()) {
    return localColleges.find((c) => c.id === id) || null;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return localColleges.find((c) => c.id === id) || null;
    }
    return data as College;
  } catch {
    return localColleges.find((c) => c.id === id) || null;
  }
}

export async function getCollegeByDomain(domain: string): Promise<College | null> {
  const cleanDomain = domain.toLowerCase().trim();
  if (isDemo()) {
    return localColleges.find((c) => c.domain.toLowerCase() === cleanDomain || cleanDomain.endsWith('.' + c.domain.toLowerCase())) || null;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .eq('domain', cleanDomain)
      .single();

    if (error || !data) {
      return localColleges.find((c) => c.domain.toLowerCase() === cleanDomain) || null;
    }
    return data as College;
  } catch {
    return localColleges.find((c) => c.domain.toLowerCase() === cleanDomain) || null;
  }
}

export async function createCollege(college: Omit<College, 'id' | 'created_at'>): Promise<College> {
  const newCollege: College = {
    ...college,
    id: 'col_' + Math.random().toString(36).substring(2, 11),
    created_at: new Date().toISOString(),
  };

  if (isDemo()) {
    localColleges.unshift(newCollege);
    return newCollege;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('colleges')
      .insert([college])
      .select()
      .single();

    if (error) throw error;
    return data as College;
  } catch {
    localColleges.unshift(newCollege);
    return newCollege;
  }
}

export async function updateCollege(id: string, updates: Partial<College>): Promise<College | null> {
  if (isDemo()) {
    const idx = localColleges.findIndex((c) => c.id === id);
    if (idx !== -1) {
      localColleges[idx] = { ...localColleges[idx], ...updates };
      return localColleges[idx];
    }
    return null;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('colleges')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as College;
  } catch {
    const idx = localColleges.findIndex((c) => c.id === id);
    if (idx !== -1) {
      localColleges[idx] = { ...localColleges[idx], ...updates };
      return localColleges[idx];
    }
    return null;
  }
}

export async function deleteCollege(id: string): Promise<boolean> {
  if (isDemo()) {
    localColleges = localColleges.filter((c) => c.id !== id);
    return true;
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from('colleges').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch {
    localColleges = localColleges.filter((c) => c.id !== id);
    return true;
  }
}
