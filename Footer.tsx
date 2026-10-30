import React from 'react';
import { Sparkles, Shield, Heart, Lock, Cloud, Terminal } from 'lucide-react';

interface FooterProps {
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                PIXORA
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Everything You Need to Create & Edit Images. High-precision online browser tools, client-side privacy, and cutting-edge generative AI.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 p-2.5 rounded-xl max-w-sm">
              <Shield className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>
                <strong>100% Client-Side Privacy:</strong> Basic image processing runs locally in your browser. No uploads required.
              </span>
            </div>

            <div className="pt-2">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500 block mb-2">
                Accepted Payment Methods (Bangladesh)
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-pink-950/60 border border-pink-700/50 text-pink-400 rounded-md text-xs font-bold flex items-center gap-1">
                  bKash: 01618238630
                </span>
                <span className="px-2.5 py-1 bg-amber-950/60 border border-amber-700/50 text-amber-400 rounded-md text-xs font-bold flex items-center gap-1">
                  Nagad: 01618238630
                </span>
              </div>
            </div>
          </div>

          {/* AI Tools Column */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              AI Photo Tools
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => navigate('ai-background-remover')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  AI Background Remover
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('ai-image-upscaler')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  AI Image Upscaler
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('ai-image-enhancer')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  AI Image Enhancer
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('ai-object-remover')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  AI Object Remover
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('ai-background-generator')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  AI Background Generator
                </button>
              </li>
            </ul>
          </div>

          {/* Core Tools Column */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Popular Tools
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => navigate('image-compressor')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Image Compressor
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('image-resizer')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Image Resizer
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('image-cropper')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Image Cropper
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('image-converter')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Image Converter
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('image-to-pdf')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Image to PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('all-tools')}
                  className="hover:text-indigo-400 transition-colors text-indigo-400 font-medium"
                >
                  Browse all 24+ tools →
                </button>
              </li>
            </ul>
          </div>

          {/* SaaS & Company */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Pixora Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => navigate('pricing')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Pricing Plans (BDT 199)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('dashboard')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  User Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('about')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  About Pixora
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('contact')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Contact Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('privacy')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('terms')}
                  className="hover:text-indigo-400 transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Pixora Inc. All rights reserved.</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Cloud className="w-3.5 h-3.5 text-indigo-400" />
              Netlify & Cloud Ready
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('admin')}
              className="text-slate-400 hover:text-white flex items-center gap-1"
            >
              <Terminal className="w-3.5 h-3.5" />
              Admin Portal
            </button>
            <span>•</span>
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Creators
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
