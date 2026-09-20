import { NextRequest, NextResponse } from 'next/server';
import { getUIProductById } from '@/lib/services/marketplace';
import { getPaymentProvider } from '@/lib/services/payment';

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

    if (product.price <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'This is a free product. Use the free claim endpoint instead.',
          isFree: true,
        },
        { status: 400 }
      );
    }

    const provider = getPaymentProvider();
    const orderResult = await provider.createOrder({
      amount: product.price,
      currency: 'INR',
      receipt: `rcpt_${product.slug.substring(0, 10)}_${Date.now()}`,
      notes: {
        productId: product.id,
        productSlug: product.slug,
        productTitle: product.title,
        userId: userId || 'anonymous_buyer',
      },
    });

    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        title: product.title,
        price: product.price,
        currency: product.currency,
      },
      order: orderResult,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Order creation failed';
    console.error('Create Order API Error:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
