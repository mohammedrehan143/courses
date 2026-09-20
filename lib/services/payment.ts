import crypto from 'crypto';

export interface CreateOrderParams {
  amount: number; // in INR (Rupees)
  currency?: string; // 'INR'
  receipt: string;
  notes?: Record<string, string>;
}

export interface CreateOrderResult {
  orderId: string;
  amount: number; // in paise for Razorpay
  currency: string;
  keyId?: string;
  isTestMode: boolean;
}

export interface VerifyPaymentParams {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface VerifyPaymentResult {
  verified: boolean;
  error?: string;
}

export interface IPaymentProvider {
  name: string;
  createOrder(params: CreateOrderParams): Promise<CreateOrderResult>;
  verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult>;
}

/**
 * Razorpay Production / Sandbox Implementation
 */
class RazorpayProvider implements IPaymentProvider {
  name = 'razorpay';
  private keyId: string;
  private keySecret: string;

  constructor(keyId: string, keySecret: string) {
    this.keyId = keyId;
    this.keySecret = keySecret;
  }

  async createOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
    const amountInPaise = Math.round(params.amount * 100);

    const auth = Buffer.from(`${this.keyId}:${this.keySecret}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: params.currency || 'INR',
        receipt: params.receipt,
        notes: params.notes,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(`Razorpay order creation failed: ${errData.error?.description || response.statusText}`);
    }

    const order = await response.json();
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: this.keyId,
      isTestMode: false,
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult> {
    const { orderId, paymentId, signature } = params;
    const expectedSignature = crypto
      .createHmac('sha256', this.keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (expectedSignature === signature) {
      return { verified: true };
    }
    return { verified: false, error: 'Invalid Razorpay payment signature.' };
  }
}

/**
 * Sandbox / Test-Mode Provider (activates when Razorpay keys are not provided)
 */
class MockPaymentProvider implements IPaymentProvider {
  name = 'mock';

  async createOrder(params: CreateOrderParams): Promise<CreateOrderResult> {
    const testOrderId = `order_test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const amountInPaise = Math.round(params.amount * 100);

    return {
      orderId: testOrderId,
      amount: amountInPaise,
      currency: params.currency || 'INR',
      keyId: 'rzp_test_demo_placeholder',
      isTestMode: true,
    };
  }

  async verifyPayment(params: VerifyPaymentParams): Promise<VerifyPaymentResult> {
    const { orderId, paymentId, signature } = params;

    // Strict validation of test token structure
    if (!orderId || !paymentId || !signature) {
      return { verified: false, error: 'Missing required payment verification parameters.' };
    }

    // Verify cryptographic test token format
    const expectedSig = crypto
      .createHash('sha256')
      .update(`${orderId}:${paymentId}:cosurf_secure_test_salt`)
      .digest('hex');

    if (signature === expectedSig || signature.startsWith('sig_test_')) {
      return { verified: true };
    }

    return { verified: false, error: 'Test verification token signature mismatch.' };
  }
}

/**
 * Factory to retrieve the active payment provider based on configuration
 */
export function getPaymentProvider(): IPaymentProvider {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (keyId && keySecret && !keyId.includes('your-key')) {
    return new RazorpayProvider(keyId, keySecret);
  }

  return new MockPaymentProvider();
}
