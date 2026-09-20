import { NextRequest, NextResponse } from 'next/server';
import { submitCreatorDesign } from '@/lib/services/marketplace';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      title,
      description,
      category,
      price,
      technologies,
      preview_image,
      gallery_images,
      live_demo_url,
      prompt_content,
      components_included,
      features,
      license_type,
      creator_name,
      creator_email,
      confirmed_ownership,
    } = body;

    if (!title || !description || !category || !preview_image || !prompt_content) {
      return NextResponse.json(
        { success: false, error: 'Missing required submission fields (title, description, category, preview image, and AI prompt).' },
        { status: 400 }
      );
    }

    if (!confirmed_ownership) {
      return NextResponse.json(
        { success: false, error: 'You must confirm ownership or distribution rights to submit a UI package.' },
        { status: 400 }
      );
    }

    const submission = await submitCreatorDesign({
      title,
      description,
      category,
      price: typeof price === 'number' ? price : parseFloat(price) || 0,
      technologies: Array.isArray(technologies) ? technologies : ['React', 'Tailwind'],
      preview_image,
      gallery_images: Array.isArray(gallery_images) ? gallery_images : [preview_image],
      live_demo_url: live_demo_url || undefined,
      prompt_content,
      components_included: Array.isArray(components_included) ? components_included : [],
      features: Array.isArray(features) ? features : [],
      license_type: license_type || 'Commercial',
      creator_name: creator_name || 'Anonymous Creator',
      creator_email: creator_email || 'creator@example.com',
      confirmed_ownership: true,
    });

    return NextResponse.json({
      success: true,
      message: 'UI submission received successfully! Our review team will review and approve within 24-48 hours.',
      submission,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Submission failed';
    console.error('Creator Submit API Error:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
