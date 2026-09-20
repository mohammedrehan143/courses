'use client';

import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Layers,
  FileCode,
  ArrowRight,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UIProduct } from '@/types/marketplace';
import { useAuth } from '@/context/auth-context';

interface CheckoutModalProps {
  product: UIProduct;
  isOpen: boolean;
  onClose: () => void;
  onPurchaseSuccess: () => void;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay?: any;
  }
}

export function CheckoutModal({
  product,
  isOpen,
  onClose,
  onPurchaseSuccess,
}: CheckoutModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'checkout' | 'verifying' | 'success'>('checkout');

  if (!isOpen) return null;

  const isFree = product.price === 0;

  // Handle Free Claim
  const handleFreeClaim = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/marketplace/claim-free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userId: user?.id,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to claim free UI product.');
      }

      setStep('success');
      onPurchaseSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Claim failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Razorpay or Sandbox Payment
  const handlePaidCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Create order server-side
      const orderRes = await fetch('/api/marketplace/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userId: user?.id,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create payment order.');
      }

      const { order } = orderData;

      // 2. If Test Mode (Sandbox Simulation)
      if (order.isTestMode || !window.Razorpay) {
        setStep('verifying');

        // Simulate secure verification call
        const mockPaymentId = `pay_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const mockSignature = `sig_test_${Date.now()}`;

        const verifyRes = await fetch('/api/marketplace/checkout/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: order.orderId,
            paymentId: mockPaymentId,
            signature: mockSignature,
            productId: product.id,
            userId: user?.id,
          }),
        });

        const verifyData = await verifyRes.json();
        if (!verifyData.success) {
          throw new Error(verifyData.error || 'Payment verification failed on server.');
        }

        setStep('success');
        onPurchaseSuccess();
        return;
      }

      // 3. Live Razorpay Flow (if Razorpay script and keys are active)
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'CoSurf UI Marketplace',
        description: `Unlock AI Prompt: ${product.title}`,
        order_id: order.orderId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async function (response: any) {
          setStep('verifying');
          try {
            // Server-side verification
            const verifyRes = await fetch('/api/marketplace/checkout/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: response.razorpay_order_id || order.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                productId: product.id,
                userId: user?.id,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
              throw new Error(verifyData.error || 'Payment verification failed on server.');
            }

            setStep('success');
            onPurchaseSuccess();
          } catch (vErr: unknown) {
            const message = vErr instanceof Error ? vErr.message : 'Verification failed';
            setError(message);
            setStep('checkout');
          }
        },
        prefill: {
          name: user?.name || 'Developer',
          email: user?.email || 'developer@example.com',
        },
        theme: {
          color: '#0a192f',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Checkout failed';
      setError(message);
      setStep('checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 'checkout' && (
          <div className="p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified AI Build Package</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
                {isFree ? 'Claim Free UI Package' : 'Unlock AI Build Package'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You are unlocking the complete implementation prompt and architecture specs for{' '}
                <strong className="text-slate-800 dark:text-slate-200">{product.title}</strong>.
              </p>
            </div>

            {/* Product Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{product.title}</span>
                <span className="font-bold text-base text-slate-900 dark:text-white">
                  {isFree ? 'Free' : `₹${product.price}`}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Full structured AI prompt (Claude, Cursor, Antigravity, Gemini, Codex)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Responsive component breakdown & Tailwind tokens</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Commercial-use license for your personal & client projects</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Payment / Claim Button */}
            <div className="space-y-3 pt-2">
              <Button
                size="lg"
                onClick={isFree ? handleFreeClaim : handlePaidCheckout}
                disabled={loading}
                className="w-full bg-[#0a192f] hover:bg-[#132c54] text-white font-bold h-12 rounded-xl text-sm shadow-md gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isFree ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Get UI — Free</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Buy & Unlock — ₹{product.price}</span>
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>256-bit encrypted checkout</span>
                </span>
                <span>•</span>
                <span>Instant prompt delivery</span>
              </div>
            </div>
          </div>
        )}

        {step === 'verifying' && (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Verifying Payment with Server...
            </h3>
            <p className="text-xs text-slate-500">
              Validating signature and generating your secure AI Build Package.
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white">
                ✓ Purchase Successful!
              </h3>
              <p className="text-xs text-slate-500">
                Your AI Build Package for <strong>{product.title}</strong> is now unlocked.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-left text-xs text-slate-600 dark:text-slate-300 space-y-2">
              <p className="font-semibold text-slate-800 dark:text-slate-200">Next Steps:</p>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                <li>Copy the AI Implementation Prompt below.</li>
                <li>Open your coding agent (Claude Code, Cursor, Antigravity, Codex, etc.).</li>
                <li>Paste the prompt and let the agent construct your complete interface.</li>
              </ol>
            </div>

            <Button
              size="lg"
              onClick={onClose}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 rounded-xl text-sm"
            >
              Open AI Build Package
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
