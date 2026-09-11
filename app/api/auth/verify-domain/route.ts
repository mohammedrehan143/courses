import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailForCollege } from '@/lib/services/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, collegeId } = body;

    if (!email || !collegeId) {
      return NextResponse.json(
        { valid: false, message: 'Email and college ID are required' },
        { status: 400 }
      );
    }

    const result = await verifyEmailForCollege(email, collegeId);
    return NextResponse.json(result);
  } catch (err) {
    console.error('Domain verification error', err);
    return NextResponse.json(
      { valid: false, message: 'Verification service error' },
      { status: 500 }
    );
  }
}
