import React from 'react';
import { Sparkles, ShieldCheck, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { ToolDefinition } from '../types';
import { TOOLS_LIST } from '../services/store';

interface ToolWrapperProps {
  tool: ToolDefinition;
  navigate: (route: string) => void;
  children: React.ReactNode;
  instructions?: { step: number; title: string; description: string }[];
}

export const ToolWrapper: React.FC<ToolWrapperProps> = ({
  tool,
  navigate,
  children,
  instructions,
}) => {
  const relatedTools = TOOLS_LIST.filter(
    (t) => t.category === tool.category && t.id !== tool.id
  ).slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <button onClick={() => navigate('home')} className="hover:text-indigo-600 transition-colors">
          Home
        </button>
        <span>/</span>
        <button onClick={() => navigate('all-tools')} className="hover:text-indigo-600 transition-colors">
          Tools
        </button>
        <span>/</span>
        <span className="text-slate-800 dark:text-slate-200 font-semibold">{tool.name}</span>
      </nav>

      {/* Tool Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-3">
          {tool.category === 'ai' ? (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Neural Engine</span>
              <span>•</span>
              <span>{tool.creditCost} Credits</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>100% Free & Browser-Based (No Uploads)</span>
            </>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {tool.name}
        </h1>
        <p className="mt-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Main Interactive Tool Body */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 mb-12 transition-colors">
        {children}
      </div>

      {/* Step by Step Guide (SEO & User clarity) */}
      {instructions && instructions.length > 0 && (
        <div className="mb-14">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            How to use {tool.name} in 3 Simple Steps
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {instructions.map((item) => (
              <div
                key={item.step}
                className="bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 relative"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-sm mb-4">
                  0{item.step}
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Related Image Tools
            </h3>
            <button
              onClick={() => navigate('all-tools')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Explore all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedTools.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigate(rel.slug)}
                className="group cursor-pointer p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all hover:-translate-y-0.5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {rel.category}
                  </span>
                  {rel.isPro && (
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-1.5 py-0.2 rounded">
                      PRO
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {rel.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {rel.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
