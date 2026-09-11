import { createClient } from '@/lib/supabase/client';
import { getCollegeById } from './colleges';
import { validateDomainMatch } from '@/lib/utils';

export interface VerifyDomainResult {
  valid: boolean;
  message: string;
  collegeName?: string;
  expectedDomain?: string;
}

export async function verifyEmailForCollege(email: string, collegeId: string): Promise<VerifyDomainResult> {
  if (!email || !email.includes('@')) {
    return { valid: false, message: 'Please provide a valid email address.' };
  }

  const college = await getCollegeById(collegeId);
  if (!college) {
    return { valid: false, message: 'The selected college was not found in our directory.' };
  }

  const isValid = validateDomainMatch(email, college.domain);
  if (!isValid) {
    return {
      valid: false,
      message: `Your email domain does not match ${college.name}. Please use an email ending in @${college.domain}`,
      collegeName: college.name,
      expectedDomain: college.domain,
    };
  }

  return {
    valid: true,
    message: `Verified: Email matches ${college.name} (@${college.domain})!`,
    collegeName: college.name,
    expectedDomain: college.domain,
  };
}

export async function checkIsUserAdmin(): Promise<boolean> {
  if (typeof window !== 'undefined') {
    const adminSession = localStorage.getItem('edupass_admin_session');
    if (adminSession === 'true') return true;
  }

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
      .from('admins')
      .select('id, role')
      .eq('auth_user_id', user.id)
      .single();

    return Boolean(data);
  } catch {
    return false;
  }
}
