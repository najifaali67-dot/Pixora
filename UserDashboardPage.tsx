import React from 'react';
import {
  User,
  Zap,
  CreditCard,
  Download,
  ArrowRight,
  Shield,
  Layers,
  CheckCircle2,
  Settings,
  Scissors,
  Clock,
  X,
  Smartphone,
  Minimize2,
  FileText,
  Sliders,
} from 'lucide-react';
import { usePixoraStore } from '../services/store';

interface UserDashboardPageProps {
  navigate: (route: string) => void;
  openPaymentModal: () => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  navigate,
  openPaymentModal,
}) => {
  const { user, payments, creditTransactions, paymentSettings } = usePixoraStore();

  const isPro = user.plan === 'pro';

  // User's own payment requests
  const userPayments = payments.filter((p) => p.userId === user.id || p.userEmail === user.email);
  const pendingPayment = userPayments.find((p) => p.status === 'pending');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-300">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
              {user.plan} Account
            </span>
            {user.role === 'admin' && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-xs font-bold uppercase tracking-wider">
                Admin
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-white/80 max-w-lg">
            Manage your photo editing tools, track bKash/Nagad payment requests, and upgrade your plan.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isPro ? (
            <button
              onClick={openPaymentModal}
              className="px-6 py-3 bg-white text-indigo-600 hover:bg-slate-100 font-extrabold text-xs rounded-2xl shadow-lg transition-all hover:scale-105 flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Upgrade to Pro (BDT {paymentSettings.monthlyPriceBdt})</span>
            </button>
          ) : (
            <div className="px-5 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Pro Membership Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Pending Payment Alert Banner */}
      {pendingPayment && (
        <div className="p-4 sm:p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-amber-900 dark:text-amber-200">
                Payment Verification in Progress
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                We received your {pendingPayment.provider} request (TrxID: <strong>{pendingPayment.transactionId}</strong>) for BDT {pendingPayment.amount}. Your Pro Plan will be activated as soon as an administrator verifies the merchant statement.
              </p>
            </div>
          </div>

          <span className="self-start sm:self-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-200/60 dark:bg-amber-900 text-amber-800 dark:text-amber-300 shrink-0">
            Pending Admin Approval
          </span>
        </div>
      )}

      {/* Key Stats Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Available Credits */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Photo Credits</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {user.credits}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              {isPro ? 'Pro monthly balance' : 'Standard credits'}
            </span>
            <button
              onClick={openPaymentModal}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Get More →
            </button>
          </div>
        </div>

        {/* Current Plan */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Membership</span>
            <CreditCard className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white capitalize">
            {user.plan} Tier
          </div>
          <div className="mt-4">
            <button
              onClick={() => navigate('pricing')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View Plan Features →
            </button>
          </div>
        </div>

        {/* Total Payments */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Payment Requests</span>
            <Smartphone className="w-4 h-4 text-pink-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {userPayments.length}
          </div>
          <div className="mt-4 text-[11px] text-slate-400">
            bKash & Nagad transactions
          </div>
        </div>

        {/* User Role */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Privilege</span>
            <Shield className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white capitalize">
            {user.role}
          </div>
          <div className="mt-4">
            {user.role === 'admin' ? (
              <button
                onClick={() => navigate('admin')}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
              >
                Open Admin Portal →
              </button>
            ) : (
              <span className="text-[11px] text-slate-400">Standard Access</span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Launch Tools */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Quick Launch Tools
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('ai-background-remover')}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-500 rounded-2xl text-left transition-all shadow-sm"
          >
            <Scissors className="w-5 h-5 text-violet-600 mb-2" />
            <div className="text-xs font-bold text-slate-900 dark:text-white">Background Remover</div>
            <div className="text-[10px] text-slate-400">Alpha transparent PNG</div>
          </button>

          <button
            onClick={() => navigate('image-compressor')}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 rounded-2xl text-left transition-all shadow-sm"
          >
            <Minimize2 className="w-5 h-5 text-emerald-600 mb-2" />
            <div className="text-xs font-bold text-slate-900 dark:text-white">Compressor</div>
            <div className="text-[10px] text-slate-400">Reduce file size up to 85%</div>
          </button>

          <button
            onClick={() => navigate('ai-image-enhancer')}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 rounded-2xl text-left transition-all shadow-sm"
          >
            <Sliders className="w-5 h-5 text-indigo-600 mb-2" />
            <div className="text-xs font-bold text-slate-900 dark:text-white">Image Enhancer</div>
            <div className="text-[10px] text-slate-400">Crisp detail & lighting</div>
          </button>

          <button
            onClick={() => navigate('image-to-pdf')}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-rose-500 rounded-2xl text-left transition-all shadow-sm"
          >
            <FileText className="w-5 h-5 text-rose-600 mb-2" />
            <div className="text-xs font-bold text-slate-900 dark:text-white">Image to PDF</div>
            <div className="text-[10px] text-slate-400">Merge multi-page PDF</div>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* Payment History & Transaction Status Table               */}
      {/* ======================================================== */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm space-y-0">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Subscription Payments & Transaction History
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Track the verification status of your bKash and Nagad payment requests.
            </p>
          </div>

          <button
            onClick={openPaymentModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
          >
            New Payment Request
          </button>
        </div>

        {userPayments.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-400 space-y-2">
            <Smartphone className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
            <p className="font-bold text-slate-600 dark:text-slate-400">
              No payment transactions recorded yet.
            </p>
            <p className="text-[11px] text-slate-400">
              When you purchase a Pro plan via bKash or Nagad, your transaction details and approval status will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-4">Transaction ID (TrxID)</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Sender Mobile</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Request Date</th>
                  <th className="p-4">Approval Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {userPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {p.transactionId}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          p.provider === 'bKash'
                            ? 'bg-pink-100 text-pink-700 dark:bg-pink-950/80 dark:text-pink-300'
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-950/80 dark:text-orange-300'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            p.provider === 'bKash' ? 'bg-pink-500' : 'bg-orange-500'
                          }`}
                        />
                        {p.provider}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-600 dark:text-slate-400">
                      {p.senderNumber || '—'}
                    </td>
                    <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      BDT {p.amount}
                    </td>
                    <td className="p-4 text-slate-400 text-[11px]">
                      {new Date(p.createdAt).toLocaleDateString()} at{' '}
                      {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4">
                      {p.status === 'pending' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[11px] font-bold">
                          <Clock className="w-3.5 h-3.5 animate-pulse" />
                          <span>Pending Admin Approval</span>
                        </span>
                      )}
                      {p.status === 'approved' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approved (Pro Active)</span>
                        </span>
                      )}
                      {p.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[11px] font-bold">
                          <X className="w-3.5 h-3.5" />
                          <span>Rejected (Invalid TrxID)</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Credit Ledger / Transactions */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Credit Activity Ledger
        </h3>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {creditTransactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  {tx.description}
                </div>
                <div className="text-[10px] text-slate-400">
                  {new Date(tx.timestamp).toLocaleString()}
                </div>
              </div>
              <div
                className={`font-mono font-bold ${
                  tx.amount > 0 ? 'text-emerald-500' : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {tx.amount > 0 ? `+${tx.amount}` : tx.amount} credits
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
