import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Lock,
  Layers,
  Crop,
  Minimize2,
  FileText,
  Wand2,
  Scissors,
  HelpCircle,
  ChevronDown,
  Star,
  Maximize,
  Sliders,
  Smartphone,
} from 'lucide-react';
import { TOOLS_LIST, usePixoraStore } from '../services/store';

interface HomePageProps {
  navigate: (route: string) => void;
  openPaymentModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate, openPaymentModal }) => {
  const { tools, paymentSettings } = usePixoraStore();
  const [activeCategory, setActiveCategory] = useState<'all' | 'ai' | 'basic' | 'conversion' | 'filters'>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredTools =
    activeCategory === 'all'
      ? tools
      : tools.filter((t) => t.category === activeCategory);

  const faqs = [
    {
      q: 'Do I need an account to use basic image editing tools?',
      a: 'No. All basic tools—including Image Compressor, Resizer, Cropper, Format Converter, and Image to PDF—are completely free and require no sign-up or login.',
    },
    {
      q: 'How does Pixora protect my photo privacy?',
      a: 'All standard and neural editing happens directly on your device via HTML5 Canvas and browser neural segmentation. Your pictures are never uploaded, analyzed, or stored on external servers.',
    },
    {
      q: 'Which AI photo tools are included in Pixora?',
      a: 'Pixora includes 1-click AI Background Remover with transparent PNG export, 2x/4x Super-Resolution Image Upscaler, AI Lighting & Contrast Enhancer, and AI Object Inpainting.',
    },
    {
      q: 'Which payment methods are supported for Pro subscriptions in Bangladesh?',
      a: `We accept bKash and Nagad to our official payment number: ${paymentSettings.bkashNumber}. Submit your Transaction ID (TrxID) after payment, and our team will verify and activate your Pro plan.`,
    },
    {
      q: 'When is my Pro plan activated after sending money?',
      a: 'Once you submit your bKash or Nagad Transaction ID, your request is reviewed by an authorized administrator against our merchant ledger. As soon as verified, your Pro membership and all premium features are immediately unlocked.',
    },
  ];

  return (
    <div className="space-y-24 animate-in fade-in duration-300 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden">
        {/* Ambient Gradient Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none -z-10 opacity-70">
          <div className="absolute top-[-10%] left-[20%] w-[450px] h-[450px] rounded-full bg-blue-400/20 dark:bg-blue-600/10 blur-[100px]" />
          <div className="absolute top-[10%] right-[20%] w-[500px] h-[500px] rounded-full bg-violet-400/20 dark:bg-violet-600/10 blur-[120px]" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/60 text-xs font-bold text-indigo-600 dark:text-indigo-400 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>All-in-One Online Image Editing & Neural Photo Studio</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            Edit, Crop, Compress & <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Enhance Images with Pixora.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Your complete online photo toolkit. Crop, resize, compress, remove backgrounds with transparent PNG export, and upscale photos directly in your browser.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('all-tools')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-indigo-500/25 hover:from-blue-700 hover:to-violet-700 transition-all flex items-center gap-2 hover:scale-105"
            >
              <Layers className="w-5 h-5" />
              <span>Explore 24+ Image Tools</span>
            </button>

            <button
              onClick={() => navigate('ai-background-remover')}
              className="px-8 py-4 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-extrabold text-sm rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all flex items-center gap-2"
            >
              <Scissors className="w-5 h-5 text-violet-500" />
              <span>Try Background Remover</span>
            </button>
          </div>

          {/* Quick-Trust Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              100% Client-Side Privacy
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              Instant Browser Processing
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-indigo-500" />
              No Account Required for Basic Tools
            </span>
          </div>
        </div>

        {/* Feature Hero Preview Card */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
          <div className="relative rounded-3xl bg-slate-900 p-2 sm:p-4 shadow-2xl border border-slate-800">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-[11px] text-slate-500 hidden sm:inline">
                  pixora.app/studio-workspace
                </span>
              </div>
              <span className="text-[11px] font-bold text-indigo-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Live Studio Engine
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 text-left">
              {/* Card 1 */}
              <div
                onClick={() => navigate('ai-background-remover')}
                className="group cursor-pointer p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-violet-500 transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center mb-3">
                  <Scissors className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors">
                  AI Background Remover
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Hair-level precision cutout with true alpha channel transparency.
                </p>
              </div>

              {/* Card 2 */}
              <div
                onClick={() => navigate('image-compressor')}
                className="group cursor-pointer p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-emerald-500 transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                  <Minimize2 className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Smart Image Compressor
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Save up to 85% bandwidth with zero perceptible quality degradation.
                </p>
              </div>

              {/* Card 3 */}
              <div
                onClick={() => navigate('ai-image-upscaler')}
                className="group cursor-pointer p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-pink-500 transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center mb-3">
                  <Maximize className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors">
                  AI Image Upscaler
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Upscale 2x and 4x ultra high-definition with unsharp mask sharpening.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tools Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Popular Image Tools
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Pick from 24+ production-ready tools for cropping, converting, compressing, watermarking, and AI photo editing.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {(
              [
                { id: 'all', label: 'All Tools' },
                { id: 'ai', label: 'AI Photo Tools' },
                { id: 'basic', label: 'Crop & Resize' },
                { id: 'conversion', label: 'Format Conversion' },
                { id: 'filters', label: 'Filters & Adjust' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => navigate(tool.slug)}
              className="group cursor-pointer bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {tool.category === 'ai' ? (
                      <Scissors className="w-6 h-6" />
                    ) : tool.slug.includes('compress') ? (
                      <Minimize2 className="w-6 h-6" />
                    ) : tool.slug.includes('crop') ? (
                      <Crop className="w-6 h-6" />
                    ) : tool.slug.includes('pdf') ? (
                      <FileText className="w-6 h-6" />
                    ) : (
                      <Layers className="w-6 h-6" />
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {tool.popular && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                        Popular
                      </span>
                    )}
                    {tool.isPro ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                        PRO
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        Free
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                <span>Launch Tool</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Value Props */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 rounded-3xl mx-4 sm:mx-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-black tracking-tight">Built for Creators & Businesses</h2>
            <p className="text-sm text-slate-400">
              The fastest way to prepare imagery for e-commerce, web development, and social media.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">100% Client-Side Privacy</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Basic image operations process on your device via HTML5 Canvas. Your sensitive documents, family photos, and graphics are never sent to external servers.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/20 text-violet-400 flex items-center justify-center">
                <Scissors className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Neural Background Cutouts</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                In-browser neural network isolates products and portraits with transparent alpha-channel output ready for your store or design canvas.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">bKash & Nagad Verified</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Upgrade seamlessly using Bangladesh&apos;s leading mobile payments (bKash & Nagad to {paymentSettings.bkashNumber}) with admin verification.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Free vs Pro Comparison Table */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Free vs. Pro Plan Comparison
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Transparent pricing without hidden catches.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="grid grid-cols-3 p-6 border-b border-slate-200 dark:border-slate-800 font-extrabold text-sm sm:text-base">
            <span className="text-slate-500">Feature</span>
            <span className="text-slate-800 dark:text-slate-200">Free Tier</span>
            <span className="text-indigo-600 dark:text-indigo-400">Pro Tier (BDT {paymentSettings.monthlyPriceBdt}/mo)</span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
            <div className="grid grid-cols-3 p-4 items-center">
              <span className="font-medium text-slate-700 dark:text-slate-300">Basic Image Tools (Compress, Resize, Crop)</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Unlimited
              </span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Unlimited
              </span>
            </div>

            <div className="grid grid-cols-3 p-4 items-center">
              <span className="font-medium text-slate-700 dark:text-slate-300">Format Conversion & Image to PDF</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Included
              </span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Included
              </span>
            </div>

            <div className="grid grid-cols-3 p-4 items-center">
              <span className="font-medium text-slate-700 dark:text-slate-300">AI Background Remover (Alpha PNG)</span>
              <span className="text-slate-400">Preview</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Full HD Export
              </span>
            </div>

            <div className="grid grid-cols-3 p-4 items-center">
              <span className="font-medium text-slate-700 dark:text-slate-300">AI Image Upscaler (2x & 4x Ultra HD)</span>
              <span className="text-slate-400">Standard</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Ultra HD 4K
              </span>
            </div>

            <div className="grid grid-cols-3 p-4 items-center">
              <span className="font-medium text-slate-700 dark:text-slate-300">AI Object Eraser & Background Replacer</span>
              <span className="text-slate-400">Not included</span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Full Access
              </span>
            </div>

            <div className="grid grid-cols-3 p-4 items-center">
              <span className="font-medium text-slate-700 dark:text-slate-300">Payment Methods Supported</span>
              <span className="text-slate-500">Free forever</span>
              <span className="text-indigo-600 font-bold">bKash & Nagad (01618238630)</span>
            </div>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              onClick={openPaymentModal}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Upgrade to Pro (BDT {paymentSettings.monthlyPriceBdt}/mo)
            </button>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Have questions about Pixora image processing or subscriptions?
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between font-bold text-sm text-slate-800 dark:text-slate-200"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-indigo-500' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-8 sm:p-14 text-white text-center shadow-2xl space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Transform Your Visuals?
          </h2>
          <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto">
            Join thousands of creators, digital artists, marketers, and photographers creating with Pixora every day.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('all-tools')}
              className="px-8 py-3.5 bg-white text-indigo-600 hover:bg-slate-100 font-extrabold text-sm rounded-2xl shadow-lg transition-all hover:scale-105"
            >
              Browse All 24+ Image Tools
            </button>
            <button
              onClick={openPaymentModal}
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm rounded-2xl border border-white/20 transition-all"
            >
              Get Pro Plan (bKash / Nagad)
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
