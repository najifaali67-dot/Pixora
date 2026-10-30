import React, { useState } from 'react';
import { Check, Sparkles, Shield, Zap, HelpCircle, ArrowRight, Smartphone, Scissors, Maximize, Wand2 } from 'lucide-react';
import { usePixoraStore } from '../services/store';

interface PricingPageProps {
  navigate: (route: string) => void;
  openPaymentModal: () => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({
  navigate,
  openPaymentModal,
}) => {
  const { user, paymentSettings } = usePixoraStore();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const currentPrice =
    billingPeriod === 'monthly'
      ? paymentSettings.monthlyPriceBdt
      : paymentSettings.yearlyPriceBdt;

  const isPro = user.plan === 'pro';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-in fade-in duration-300">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-600 dark:text-indigo-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Flexible Plans for Creators & Teams</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Simple, Transparent Pricing
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Start for free with basic editing tools, or upgrade to Pro to unlock neural background removal, 4K upscaling, and advanced inpainting.
        </p>

        {/* Period Selector */}
        <div className="inline-flex items-center p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 mt-4">
          <button
            type="button"
            onClick={() => setBillingPeriod('monthly')}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all ${
              billingPeriod === 'monthly'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setBillingPeriod('yearly')}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              billingPeriod === 'yearly'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Yearly Billing</span>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold px-1.5 py-0.5 rounded-full">
              Save 37%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Starter Tier
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Active by Default
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Free Plan</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Essential image manipulation with zero subscription cost.
            </p>

            <div className="mt-6 mb-8 flex items-baseline gap-1">
              <span className="text-4xl font-black text-slate-900 dark:text-white">BDT 0</span>
              <span className="text-xs text-slate-400">/ forever</span>
            </div>

            <ul className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Unlimited Image Compressor & Resizer</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Format Converter (JPG, PNG, WebP)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Multi-Image to PDF Compiler</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Cropper, Rotator & Flipper tools</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Watermark & Color Filter adjustment</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-400">
                <span>✕ AI Background Remover (preview mode)</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-400">
                <span>✕ AI 4K Upscaler & Object Eraser</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => navigate('all-tools')}
            className="mt-8 w-full py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-2xl transition-all"
          >
            Start Using Free Tools
          </button>
        </div>

        {/* Pro Plan */}
        <div className="relative bg-gradient-to-b from-white to-indigo-50/40 dark:from-slate-900 dark:to-indigo-950/40 rounded-3xl p-8 border-2 border-indigo-500 shadow-xl flex flex-col justify-between">
          <div className="absolute -top-3.5 right-6 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-full shadow-md">
            Most Popular
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Studio Tier
              </span>
              {isPro && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  Current Plan
                </span>
              )}
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Pixora Pro</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Supercharged photo tools for designers, e-commerce, & creators.
            </p>

            <div className="mt-6 mb-8 flex items-baseline gap-1.5">
              <span className="text-4xl font-black text-slate-900 dark:text-white">
                BDT {currentPrice}
              </span>
              <span className="text-xs text-slate-400">
                / {billingPeriod === 'monthly' ? 'month' : 'year'}
              </span>
            </div>

            <ul className="space-y-3.5 text-xs text-slate-700 dark:text-slate-200 font-semibold">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>AI Background Remover with transparent PNG export</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>AI Image Upscaler (2x & 4x Ultra HD Sharpening)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>AI Photo Enhancer & Noise Reduction</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>AI Object Remover & Inpainting</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Batch Image Processing & Maximum Resolution</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>Priority Admin Verification on bKash & Nagad</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={openPaymentModal}
            className="mt-8 w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-indigo-500/30 transition-all hover:scale-[1.02]"
          >
            {isPro ? 'Manage Pro Subscription' : `Upgrade via bKash / Nagad (BDT ${currentPrice})`}
          </button>
        </div>
      </div>

      {/* Payment Security Notice - bKash & Nagad ONLY */}
      <div className="max-w-2xl mx-auto p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
          <Smartphone className="w-4 h-4 text-indigo-600" />
          <span>Supported Payment Methods (Bangladesh)</span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Pixora supports exclusively <strong>bKash</strong> and <strong>Nagad</strong> mobile payments. Send money to our official number <strong>{paymentSettings.bkashNumber}</strong> and submit your Transaction ID (TrxID) for instant verification.
        </p>
        <div className="flex items-center justify-center gap-3 pt-1">
          <span className="px-3 py-1 rounded-lg bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 font-extrabold text-xs">
            bKash: {paymentSettings.bkashNumber}
          </span>
          <span className="px-3 py-1 rounded-lg bg-orange-100 dark:dark:bg-orange-950 text-orange-700 dark:text-orange-300 font-extrabold text-xs">
            Nagad: {paymentSettings.nagadNumber}
          </span>
        </div>
      </div>
    </div>
  );
};
