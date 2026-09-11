import { NextRequest, NextResponse } from 'next/server';
import { trackCourseClick } from '@/lib/services/clicks';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const studentId = body?.studentId || null;

    await trackCourseClick(id, studentId);

    return NextResponse.json({ success: true, courseId: id });
  } catch (err) {
    console.error('Error logging click', err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
