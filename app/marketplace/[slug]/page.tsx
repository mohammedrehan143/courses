'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getUIProductBySlug } from '@/lib/services/marketplace';
import { UIProduct, AIAgentType } from '@/types/marketplace';
import { DevicePreview } from '@/components/marketplace/device-preview';
import { PromptViewer } from '@/components/marketplace/prompt-viewer';
import { CheckoutModal } from '@/components/marketplace/checkout-modal';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Check,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ArrowLeft,
  Calendar,
  Layers,
  Star,
  FileCheck,
  Code2,
  Terminal,
  Clock,
  HelpCircle,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function UIProductDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const { user } = useAuth();

  const [product, setProduct] = useState<UIProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  // Unlocked prompt state
  const [promptContent, setPromptContent] = useState<string | null>(null);
  const [promptVersion, setPromptVersion] = useState('1.0.0');
  const [activeAgent, setActiveAgent] = useState<AIAgentType>('general');
  const [loadingPrompt, setLoadingPrompt] = useState(false);

  // 1. Fetch Product details
  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const prod = await getUIProductBySlug(slug);
        if (!prod) {
          setProduct(null);
        } else {
          setProduct(prod);
        }
      } catch (err) {
        console.error('Failed to load UI product:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  // 2. Check if user already owns this product
  useEffect(() => {
    if (!product) return;
    const currentProductId = product.id;

    async function checkOwnership() {
      try {
        const res = await fetch('/api/marketplace/purchases', {
          headers: user?.id ? { 'x-user-id': user.id } : {},
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.purchases)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const owned = data.purchases.some((p: any) => p.ui_product_id === currentProductId);
          setIsPurchased(owned);
        }
      } catch (err) {
        console.error('Error checking purchases:', err);
      }
    }

    checkOwnership();
  }, [product, user]);

  // 3. Load secure prompt ONLY when verified purchased
  useEffect(() => {
    if (!product || !isPurchased) {
      setPromptContent(null);
      return;
    }

    async function fetchSecurePrompt() {
      setLoadingPrompt(true);
      try {
        const res = await fetch(
          `/api/marketplace/prompt?productId=${product!.id}&agent=${activeAgent}`,
          {
            headers: user?.id ? { 'x-user-id': user.id } : {},
          }
        );
        const data = await res.json();
        if (data.success) {
          setPromptContent(data.prompt);
          setPromptVersion(data.version || '1.0.0');
        } else {
          console.warn('Secure prompt access denied:', data.error);
        }
      } catch (err) {
        console.error('Error retrieving prompt package:', err);
      } finally {
        setLoadingPrompt(false);
      }
    }

    fetchSecurePrompt();
  }, [product, isPurchased, activeAgent, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 py-16 px-4 max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-96 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const isFree = product.price === 0;

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 pb-24">
      {/* Breadcrumb Bar */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between text-xs">
          <Link
            href="/marketplace"
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to UI Marketplace</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
              {product.category}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-500 dark:text-slate-400 font-semibold truncate max-w-[200px]">
              {product.title}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Top Two-Column Grid: Preview on Left, Purchase/Specs on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Device Preview (Desktop & Mobile) & Gallery */}
          <div className="lg:col-span-8 space-y-6">
            <DevicePreview
              title={product.title}
              previewImage={product.preview_image}
              galleryImages={product.gallery_images}
              liveDemoUrl={product.live_demo_url}
            />

            {/* Prompt Section Anchor */}
            <div id="ai-prompt-section" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isPurchased ? (
                    <Unlock className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Lock className="w-5 h-5 text-slate-400" />
                  )}
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    AI Build Prompt Package
                  </h2>
                </div>
                {isPurchased && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 text-xs font-semibold flex items-center gap-1 border border-emerald-500/20">
                    <Check className="w-3.5 h-3.5" />
                    Unlocked & Ready
                  </span>
                )}
              </div>

              {/* Locked Prompt Banner vs Unlocked Viewer */}
              {isPurchased && promptContent ? (
                <PromptViewer
                  productId={product.id}
                  productTitle={product.title}
                  promptContent={promptContent}
                  version={promptVersion}
                  activeAgent={activeAgent}
                  onAgentChange={(agent) => setActiveAgent(agent)}
                  loadingPrompt={loadingPrompt}
                />
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-8 text-center space-y-4 shadow-subtle">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      🔒 AI Build Prompt Package is Locked
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Purchase this UI design to unlock the complete structured implementation prompt, responsive design tokens, and component breakdown for Claude Code, Cursor, Antigravity, and Gemini.
                    </p>
                  </div>
                  <Button
                    size="lg"
                    onClick={() => setCheckoutModalOpen(true)}
                    className="bg-[#0a192f] hover:bg-[#132c54] text-white font-bold px-6 h-11 text-xs rounded-xl shadow-md gap-2"
                  >
                    {isFree ? (
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
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Product Purchase & Information Card */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-premium space-y-6">
              {/* Title & Category */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                    {product.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold">{product.rating.toFixed(1)}</span>
                    <span className="text-slate-400">({product.reviews_count} reviews)</span>
                  </div>
                </div>

                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-snug">
                  {product.title}
                </h1>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price & Purchase CTA */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500 font-medium">Full Package Price</span>
                  <div className="text-right">
                    {isFree ? (
                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                        Free
                      </span>
                    ) : (
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        ₹{product.price}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 block">One-time payment</span>
                  </div>
                </div>

                {isPurchased ? (
                  <div className="space-y-2">
                    <div className="w-full p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold text-center border border-emerald-500/20 flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Purchased ✓</span>
                    </div>
                    <Button
                      size="lg"
                      onClick={() => {
                        const el = document.getElementById('ai-prompt-section');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full bg-[#0a192f] hover:bg-[#132c54] text-white text-xs font-bold h-11 rounded-xl"
                    >
                      Open AI Build Package
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="lg"
                    onClick={() => setCheckoutModalOpen(true)}
                    className="w-full bg-[#0a192f] hover:bg-[#132c54] text-white font-bold h-12 rounded-xl text-sm shadow-md gap-2"
                  >
                    {isFree ? (
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
                )}
              </div>

              {/* What You Get Breakdown */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                  What You Get
                </h3>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>High-quality production-ready UI design specification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Responsive layout spec (Mobile + Tablet + Desktop)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Modular component breakdown & prop definitions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Structured AI prompt optimized for Claude, Cursor, Antigravity, & Gemini</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Commercial-use license ({product.license_type})</span>
                  </li>
                </ul>
              </div>

              {/* Components Included Pills */}
              {product.components_included.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    Components Included
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {product.components_included.map((comp) => (
                      <span
                        key={comp}
                        className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Creator Profile */}
              {product.creator && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                  <Image
                    src={product.creator.avatar}
                    alt={product.creator.display_name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {product.creator.display_name}
                      </span>
                      {product.creator.verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {product.creator.bio}
                    </p>
                  </div>
                </div>
              )}

              {/* Metadata Specs */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                <div>
                  <span className="block text-slate-400">License:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {product.license_type}
                  </span>
                </div>
                <div>
                  <span className="block text-slate-400">Updated:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {new Date(product.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        product={product}
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        onPurchaseSuccess={() => {
          setIsPurchased(true);
        }}
      />
    </div>
  );
}
