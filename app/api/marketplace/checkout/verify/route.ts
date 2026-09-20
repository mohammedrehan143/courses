import { NextRequest, NextResponse } from 'next/server';
import { getPaymentProvider } from '@/lib/services/payment';
import { recordPurchase, getUIProductById } from '@/lib/services/marketplace';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { orderId, paymentId, signature, productId, userId } = body;

    if (!orderId || !paymentId || !signature || !productId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required payment verification parameters (orderId, paymentId, signature, productId).',
        },
        { status: 400 }
      );
    }

    const effectiveUserId = userId || 'user_alex_stanford';

    // 1. Verify payment signature on the server
    const provider = getPaymentProvider();
    const verification = await provider.verifyPayment({
      orderId,
      paymentId,
      signature,
    });

    if (!verification.verified) {
      return NextResponse.json(
        {
          success: false,
          error: verification.error || 'Payment verification failed. Transaction rejected.',
        },
        { status: 400 }
      );
    }

    // 2. Fetch product for price record
    const product = await getUIProductById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found.' },
        { status: 404 }
      );
    }

    // 3. Create persistent purchase record server-side
    const purchase = await recordPurchase({
      userId: effectiveUserId,
      productId: product.id,
      amount: product.price,
      currency: product.currency,
      provider: provider.name as 'razorpay' | 'mock',
      orderId,
      paymentId,
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified and UI package unlocked successfully.',
      purchase: {
        id: purchase.id,
        productId: purchase.ui_product_id,
        purchasedAt: purchase.purchased_at,
        amount: purchase.amount,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Payment verification error';
    console.error('Payment Verification API Error:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
