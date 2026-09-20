import { NextRequest, NextResponse } from 'next/server';
import { checkUserPurchase, getUIProductById } from '@/lib/services/marketplace';
import { MOCK_UI_PROMPTS, formatPromptForAgent } from '@/lib/mock-marketplace-prompts';
import { AIAgentType } from '@/types/marketplace';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const agent = (searchParams.get('agent') as AIAgentType) || 'general';

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required.' },
        { status: 400 }
      );
    }

    // 1. Identify User (from Supabase Auth or fallback header/cookie)
    let userId: string | null = null;

    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
      }
    } catch {
      // In demo mode or if Supabase session is not set in cookies
    }

    // Fallback to client user header (in demo mode)
    if (!userId) {
      userId = request.headers.get('x-user-id');
    }

    // If still null in demo mode, default to the demo student account
    const isDemo =
      process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-ref');

    if (!userId && isDemo) {
      userId = 'user_alex_stanford';
    }

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required. Please sign in to access your unlocked UI prompts.',
        },
        { status: 401 }
      );
    }

    // 2. Fetch Product to verify existence and check if it's free
    const product = await getUIProductById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'UI Product not found.' },
        { status: 404 }
      );
    }

    // 3. Verify Purchase Authorization Server-Side
    const isPurchased = await checkUserPurchase(userId, productId);

    if (!isPurchased) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized. You must purchase this UI to unlock the AI implementation package.',
        },
        { status: 403 }
      );
    }

    // 4. Retrieve Secure Prompt
    let promptRecord = MOCK_UI_PROMPTS[productId];

    // If not in mock prompt dictionary, try Supabase ui_prompts
    if (!promptRecord && !isDemo) {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('ui_prompts')
        .select('*')
        .eq('ui_product_id', productId)
        .single();

      if (!error && data) {
        promptRecord = data;
      }
    }

    if (!promptRecord) {
      return NextResponse.json(
        {
          success: false,
          error: 'Prompt package is being generated for this new product. Please check back shortly.',
        },
        { status: 404 }
      );
    }

    // 5. Tailor prompt to requested AI Coding Agent
    const formattedPrompt = formatPromptForAgent(promptRecord.prompt_content, agent);

    return NextResponse.json({
      success: true,
      productId,
      productTitle: product.title,
      version: promptRecord.version,
      agent,
      prompt: formattedPrompt,
      license: product.license_type,
    });
  } catch (error) {
    console.error('Secure Prompt API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while retrieving prompt package.' },
      { status: 500 }
    );
  }
}
