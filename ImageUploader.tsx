import React, { useRef, useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import { readFileAsDataURL } from '../utils/imageUtils';

interface ImageUploaderProps {
  onImageLoaded: (dataUrl: string, file: File) => void;
  title?: string;
  subtitle?: string;
  accept?: string;
  allowSample?: boolean;
}

// Sample images for 1-click test drive
const SAMPLES = [
  {
    name: 'Portrait Model',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Modern Architecture',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Neon Cyberpunk',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=800&q=80',
  },
];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageLoaded,
  title = 'Upload an image to start',
  subtitle = 'Supports JPG, PNG, and WebP up to 30MB',
  accept = 'image/*',
  allowSample = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingSample, setLoadingSample] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Support paste from clipboard
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) handleFile(file);
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleFile = async (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 35 * 1024 * 1024) {
      setError('File size exceeds 35MB limit.');
      return;
    }

    try {
      const dataUrl = await readFileAsDataURL(file);
      onImageLoaded(dataUrl, file);
    } catch (err) {
      setError('Failed to read image file.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSampleClick = async (sampleUrl: string, sampleName: string) => {
    setLoadingSample(true);
    setError(null);
    try {
      const res = await fetch(sampleUrl);
      const blob = await res.blob();
      const file = new File([blob], `${sampleName.toLowerCase().replace(/\s+/g, '-')}.jpg`, {
        type: 'image/jpeg',
      });
      const dataUrl = await readFileAsDataURL(file);
      onImageLoaded(dataUrl, file);
    } catch (err) {
      setError('Failed to load sample image. Please upload a local file.');
    } finally {
      setLoadingSample(false);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 scale-[0.99]'
            : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-slate-50/60 dark:hover:bg-slate-800/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500/10 via-indigo-500/10 to-violet-500/10 dark:from-indigo-900/30 dark:to-violet-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
          <Upload className="w-8 h-8" />
        </div>

        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
          {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{subtitle}</p>

        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-500/20 hover:from-blue-700 hover:to-indigo-700 transition-all">
          <ImageIcon className="w-4 h-4" />
          <span>Select Photo or Drop Here</span>
        </div>

        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3">
          Tip: You can also press <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px]">Ctrl+V</kbd> to paste
        </p>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1-Click Samples */}
      {allowSample && (
        <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-center gap-3">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-violet-500" />
            Try with sample:
          </span>
          {SAMPLES.map((s) => (
            <button
              key={s.name}
              type="button"
              disabled={loadingSample}
              onClick={(e) => {
                e.stopPropagation();
                handleSampleClick(s.url, s.name);
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              {s.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
