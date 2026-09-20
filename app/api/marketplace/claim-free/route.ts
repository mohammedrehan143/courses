import { NextRequest, NextResponse } from 'next/server';
import { getUIProductById, recordPurchase } from '@/lib/services/marketplace';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { productId, userId } = body;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required.' },
        { status: 400 }
      );
    }

    const product = await getUIProductById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found.' },
        { status: 404 }
      );
    }

    if (product.price > 0) {
      return NextResponse.json(
        { success: false, error: 'This is a paid product. Please use standard checkout.' },
        { status: 400 }
      );
    }

    const effectiveUserId = userId || 'user_alex_stanford';

    const purchase = await recordPurchase({
      userId: effectiveUserId,
      productId: product.id,
      amount: 0,
      currency: product.currency,
      provider: 'free_claim',
      orderId: `free_claim_${Date.now()}`,
      paymentId: `free_grant_${Math.random().toString(36).substring(2, 8)}`,
    });

    return NextResponse.json({
      success: true,
      message: 'Free UI package successfully claimed and unlocked!',
      purchase,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Free claim error';
    console.error('Claim Free API Error:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
