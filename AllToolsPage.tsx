import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  ArrowRight,
  Filter,
  Layers,
  Crop,
  Minimize2,
  FileText,
  Wand2,
  Sliders,
} from 'lucide-react';
import { TOOLS_LIST, usePixoraStore } from '../services/store';

interface AllToolsPageProps {
  navigate: (route: string) => void;
}

export const AllToolsPage: React.FC<AllToolsPageProps> = ({ navigate }) => {
  const { tools } = usePixoraStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<string>('all');

  const filtered = tools.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = category === 'all' || t.category === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          All Online Image Tools
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Everything you need for cropping, compressing, resizing, format conversion, neural background removal, and filters in one seamless workspace.
        </p>

        {/* Search Input */}
        <div className="relative max-w-lg mx-auto pt-4">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 translate-y-[-10%]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tools (e.g. compress, crop, watermark, pdf, ai)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {[
          { id: 'all', label: 'All Tools (24+)' },
          { id: 'ai', label: 'AI Studio Tools' },
          { id: 'basic', label: 'Crop, Resize & Rotate' },
          { id: 'conversion', label: 'Format Converters' },
          { id: 'filters', label: 'Filters & Watermark' },
          { id: 'documents', label: 'Document & PDF' },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              category === c.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No tools found matching &quot;{searchTerm}&quot;
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setCategory('all');
            }}
            className="mt-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((tool) => (
            <div
              key={tool.id}
              onClick={() => navigate(tool.slug)}
              className="group cursor-pointer bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {tool.category === 'ai' ? (
                      <Sparkles className="w-6 h-6" />
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
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
                        Free
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span>{tool.creditCost ? `${tool.creditCost} Credits` : 'Free Tool'}</span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Launch <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
