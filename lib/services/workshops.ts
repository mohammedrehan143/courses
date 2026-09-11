import { createClient } from '@/lib/supabase/client';
import { Workshop } from '@/types/database';
import { MOCK_WORKSHOPS, MOCK_COLLEGES } from '@/lib/mock-data';

const isDemo = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || !url || url.includes('your-project-ref');
};

let localWorkshops = [...MOCK_WORKSHOPS];

export async function getWorkshopsForCollege(collegeId?: string): Promise<Workshop[]> {
  if (isDemo()) {
    if (!collegeId) return localWorkshops.filter((w) => w.is_active);
    
    // Return workshops for this specific college + any global
    return localWorkshops.filter(
      (w) => w.is_active && (w.college_id === collegeId || !w.college_id)
    );
  }

  try {
    const supabase = createClient();
    let query = supabase.from('workshops').select('*').eq('is_active', true).order('date', { ascending: true });
    
    if (collegeId) {
      query = query.eq('college_id', collegeId);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return getWorkshopsForCollege(collegeId);
    }
    return data as Workshop[];
  } catch {
    return localWorkshops;
  }
}

export async function createWorkshop(data: Omit<Workshop, 'id'>): Promise<Workshop> {
  const newWorkshop: Workshop = {
    ...data,
    id: 'ws_' + Math.random().toString(36).substring(2, 9),
  };

  if (isDemo()) {
    localWorkshops.unshift(newWorkshop);
    return newWorkshop;
  }

  try {
    const supabase = createClient();
    const { data: res, error } = await supabase.from('workshops').insert([data]).select().single();
    if (error) throw error;
    return res as Workshop;
  } catch {
    localWorkshops.unshift(newWorkshop);
    return newWorkshop;
  }
}
