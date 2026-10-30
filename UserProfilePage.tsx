import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Shield,
  CreditCard,
  Key,
  CheckCircle2,
  Save,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { usePixoraStore } from '../services/store';

interface UserProfilePageProps {
  navigate: (route: string) => void;
  openPaymentModal: () => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  navigate,
  openPaymentModal,
}) => {
  const { user, updateUserProfile } = usePixoraStore();
  const [name, setName] = useState(user.name);
  const [saved, setSaved] = useState(false);
  const [apiHealth, setApiHealth] = useState<{ status: string; hasGeminiKey: boolean } | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => setApiHealth(data))
      .catch(() => {});
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      <div>
        <button
          onClick={() => navigate('dashboard')}
          className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          Account Settings & Profile
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal information, subscription plan, and system integration status.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Summary */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/25">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">{user.name}</h3>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Plan</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                {user.plan} Tier
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Credits</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">
                {user.credits} Remaining
              </span>
            </div>
          </div>

          {user.plan !== 'pro' ? (
            <button
              onClick={openPaymentModal}
              className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs rounded-xl shadow-md transition-all hover:scale-105"
            >
              Upgrade to Pro (BDT 199)
            </button>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-xs font-bold border border-emerald-300 dark:border-emerald-800 flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Pro Member</span>
            </div>
          )}
        </div>

        {/* Right Column: Profile Form & Integration Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Personal Information
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Display Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/40 text-slate-500 font-medium cursor-not-allowed"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Email is locked to your account identifier.
                </span>
              </div>

              <div className="flex items-center justify-between pt-2">
                {saved && (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Profile saved successfully!
                  </span>
                )}
                <button
                  type="submit"
                  className="ml-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>

          {/* Photo Processing Engine Status Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Client & Neural Engine Status</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Active & Standalone
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Pixora runs fully standalone with client-side Canvas and neural segmentation engines. AI Background Removal, Upscaling, and Photo Tools work directly on your device with complete privacy, requiring no external Gemini API key or cloud billing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
