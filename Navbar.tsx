import React, { useState } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Layers,
  ChevronDown,
  User,
  Shield,
  CreditCard,
  LogOut,
  Moon,
  Sun,
  Wand2,
  Crop,
  Minimize2,
  FileText,
  Menu,
  X,
  Zap,
  Scissors,
  Eraser,
  Sliders,
} from 'lucide-react';
import { usePixoraStore } from '../services/store';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  openPaymentModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  navigate,
  darkMode,
  setDarkMode,
  openPaymentModal,
}) => {
  const { user, logout, toggleAdminRole } = usePixoraStore();
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPro = user.plan === 'pro';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                <circle cx="12" cy="13" r="3" />
                <path d="m18 10 2-2" />
                <path d="m17 7 3 3" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  PIXORA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/50">
                  SaaS
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                All-in-One Image Studio
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => navigate('home')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                currentRoute === 'home'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Home
            </button>

            {/* AI Photo Tools Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setAiMenuOpen(true)}
              onMouseLeave={() => setAiMenuOpen(false)}
            >
              <button
                onClick={() => navigate('ai-background-remover')}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-violet-500" />
                <span>AI Photo Tools</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {aiMenuOpen && (
                <div className="absolute top-full left-0 w-72 p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  <div className="text-[11px] font-semibold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                    Neural & Precision Editing
                  </div>

                  <button
                    onClick={() => {
                      navigate('ai-background-remover');
                      setAiMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-left transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                      <Scissors className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        AI Background Remover
                        <span className="text-[10px] bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300 font-bold px-1.5 py-0.2 rounded">
                          POPULAR
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        1-Click cutout with alpha channel
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      navigate('ai-image-upscaler');
                      setAiMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-left transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-900/60 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        AI Image Upscaler
                        <span className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 font-bold px-1.5 py-0.2 rounded">
                          PRO
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        2x - 4x detail reconstruction
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      navigate('ai-image-enhancer');
                      setAiMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-left transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Wand2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        AI Photo Enhancer
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Lighting, contrast & clarity
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      navigate('ai-object-remover');
                      setAiMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-left transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <Eraser className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        AI Object Remover
                        <span className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 font-bold px-1.5 py-0.2 rounded">
                          PRO
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Seamless patch inpainting
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Basic Tools Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setToolsMenuOpen(true)}
              onMouseLeave={() => setToolsMenuOpen(false)}
            >
              <button
                onClick={() => navigate('all-tools')}
                className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Layers className="w-4 h-4 text-blue-500" />
                <span>Image Tools</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {toolsMenuOpen && (
                <div className="absolute top-full left-0 w-80 p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-150 z-50 grid grid-cols-2 gap-1">
                  <button
                    onClick={() => {
                      navigate('image-compressor');
                      setToolsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                  >
                    <Minimize2 className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      Compressor
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('image-resizer');
                      setToolsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                  >
                    <ImageIcon className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      Resizer
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('image-cropper');
                      setToolsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                  >
                    <Crop className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      Cropper
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('image-converter');
                      setToolsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                  >
                    <Zap className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      Converter
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('image-to-pdf');
                      setToolsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
                  >
                    <FileText className="w-4 h-4 text-rose-500" />
                    <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                      Image to PDF
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('all-tools');
                      setToolsMenuOpen(false);
                    }}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left font-bold text-indigo-600 dark:text-indigo-400"
                  >
                    <Layers className="w-4 h-4" />
                    <span className="text-xs">Browse All 24+</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('all-tools')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                currentRoute === 'all-tools'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              All Tools
            </button>

            <button
              onClick={() => navigate('pricing')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                currentRoute === 'pricing'
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/40'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Pricing
            </button>
          </nav>
        </div>

        {/* Right Section: Theme Toggle, Upgrade CTA, User Menu */}
        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Upgrade Button or Pro Badge */}
          <div className="hidden sm:flex items-center">
            {!isPro ? (
              <button
                onClick={openPaymentModal}
                className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Get Pro (BDT 199)</span>
              </button>
            ) : (
              <span className="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 rounded-full border border-emerald-300/40">
                PRO ACTIVE
              </span>
            )}
          </div>

          {/* User Profile / Dashboard Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {user.name.charAt(0)}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                      {user.plan} tier
                    </span>
                    {user.role === 'admin' && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 uppercase">
                        Admin
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigate('dashboard');
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>User Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    navigate('profile');
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                >
                  <User className="w-4 h-4 text-indigo-500" />
                  <span>Account & Profile</span>
                </button>

                <button
                  onClick={() => {
                    navigate('pricing');
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                >
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <span>Subscription & Plans</span>
                </button>

                {/* Admin Dashboard */}
                <button
                  onClick={() => {
                    navigate('admin');
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors text-left"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </button>

                <div className="border-t border-slate-100 dark:border-slate-800 my-1 pt-1">
                  <button
                    onClick={() => {
                      toggleAdminRole();
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-left"
                  >
                    <span>Role Toggle: {user.role}</span>
                    <span className="text-[10px] text-indigo-500 font-bold">Switch</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-2">
          <button
            onClick={() => {
              navigate('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Home
          </button>
          <button
            onClick={() => {
              navigate('ai-background-remover');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-2"
          >
            <Scissors className="w-4 h-4" />
            AI Background Remover
          </button>
          <button
            onClick={() => {
              navigate('all-tools');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            All 24+ Image Tools
          </button>
          <button
            onClick={() => {
              navigate('pricing');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            Pricing (bKash / Nagad)
          </button>
          <button
            onClick={() => {
              navigate('dashboard');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            User Dashboard
          </button>
          <button
            onClick={() => {
              navigate('admin');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 text-sm font-medium text-rose-600 dark:text-rose-400"
          >
            Admin Dashboard
          </button>
        </div>
      )}
    </header>
  );
};
