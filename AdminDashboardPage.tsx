import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  CreditCard,
  Settings,
  Sparkles,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Search,
  DollarSign,
  Activity,
  Layers,
  Save,
  Check,
  X,
  Clock,
  Smartphone,
  ToggleLeft,
  ToggleRight,
  Filter,
} from 'lucide-react';
import { usePixoraStore } from '../services/store';

interface AdminDashboardPageProps {
  navigate: (route: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ navigate }) => {
  const {
    user,
    paymentSettings,
    payments,
    auditLogs,
    tools,
    adminApprovePayment,
    adminRejectPayment,
    adminUpdatePaymentNumbers,
    toggleToolStatus,
  } = usePixoraStore();

  const [activeTab, setActiveTab] = useState<
    'payments' | 'settings' | 'overview' | 'tools' | 'audit'
  >('payments');

  // Filter state for payments
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [providerFilter, setProviderFilter] = useState<'all' | 'bKash' | 'Nagad'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Payment numbers form state (default: 01618238630)
  const [bkashNum, setBkashNum] = useState(paymentSettings.bkashNumber);
  const [nagadNum, setNagadNum] = useState(paymentSettings.nagadNumber);
  const [monthlyPrice, setMonthlyPrice] = useState(paymentSettings.monthlyPriceBdt);
  const [yearlyPrice, setYearlyPrice] = useState(paymentSettings.yearlyPriceBdt);
  const [settingsSuccess, setSettingsSuccess] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Action status message
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Sync settings when store updates
  useEffect(() => {
    setBkashNum(paymentSettings.bkashNumber);
    setNagadNum(paymentSettings.nagadNumber);
    setMonthlyPrice(paymentSettings.monthlyPriceBdt);
    setYearlyPrice(paymentSettings.yearlyPriceBdt);
  }, [paymentSettings]);

  // Authorization check
  const isAdmin = user.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 bg-rose-100 dark:bg-rose-950/60 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          Access Restricted: Admin Only
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          You are currently logged in as a standard user (<strong>{user.email}</strong>). To manage bKash/Nagad payment requests and verify subscriptions, you must have an authorized administrator role.
        </p>
        <div className="pt-2">
          <button
            onClick={() => navigate('dashboard')}
            className="px-6 py-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold text-xs rounded-xl shadow"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Filtered payments list
  const filteredPayments = payments.filter((p) => {
    const matchesStatus = paymentFilter === 'all' || p.status === paymentFilter;
    const matchesProvider = providerFilter === 'all' || p.provider === providerFilter;
    const matchesSearch =
      searchQuery === '' ||
      p.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.senderNumber && p.senderNumber.includes(searchQuery));

    return matchesStatus && matchesProvider && matchesSearch;
  });

  const pendingCount = payments.filter((p) => p.status === 'pending').length;
  const approvedCount = payments.filter((p) => p.status === 'approved').length;
  const bkashCount = payments.filter((p) => p.provider === 'bKash').length;
  const nagadCount = payments.filter((p) => p.provider === 'Nagad').length;

  const handleApprove = async (id: string) => {
    setActionMessage(null);
    const success = await adminApprovePayment(id);
    if (success) {
      setActionMessage({ text: 'Payment approved successfully! Pro membership activated.', type: 'success' });
      setTimeout(() => setActionMessage(null), 4000);
    } else {
      setActionMessage({ text: 'Failed to approve payment.', type: 'error' });
    }
  };

  const handleReject = async (id: string) => {
    setActionMessage(null);
    const success = await adminRejectPayment(id);
    if (success) {
      setActionMessage({ text: 'Payment rejected. Pro membership remains inactive.', type: 'success' });
      setTimeout(() => setActionMessage(null), 4000);
    } else {
      setActionMessage({ text: 'Failed to reject payment.', type: 'error' });
    }
  };

  const handleSavePaymentNumbers = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);
    const success = await adminUpdatePaymentNumbers({
      bkashNumber: bkashNum,
      nagadNumber: nagadNum,
      monthlyPriceBdt: monthlyPrice,
      yearlyPriceBdt: yearlyPrice,
    });
    setSettingsLoading(false);
    if (success) {
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-slate-900 text-white rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">Pixora Admin Control Center</h1>
              <span className="text-[10px] bg-rose-500/30 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                Authorized Admin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Admin: <strong>{user.email}</strong> • Pending Reviews:{' '}
              <span className="text-amber-400 font-bold">{pendingCount}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('dashboard')}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl transition-colors"
        >
          Return to User Dashboard
        </button>
      </div>

      {/* Global Notification Banner */}
      {actionMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between border text-xs font-bold ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/70 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button onClick={() => setActionMessage(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          {
            id: 'payments',
            label: `bKash & Nagad Requests (${pendingCount} Pending)`,
            icon: CreditCard,
            badge: pendingCount > 0 ? pendingCount : null,
          },
          { id: 'settings', label: 'Payment Numbers & Rates', icon: Smartphone },
          { id: 'overview', label: 'Platform Metrics', icon: BarChart3 },
          { id: 'tools', label: 'Tool Policies (24+)', icon: Layers },
          { id: 'audit', label: `Audit Trail (${auditLogs.length})`, icon: Activity },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-black flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: PAYMENTS VERIFICATION QUEUE (bKash & Nagad)        */}
      {/* ========================================================= */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Summary Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Pending Verification
              </div>
              <div className="text-2xl font-black text-amber-500 mt-1">{pendingCount}</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Approved & Active
              </div>
              <div className="text-2xl font-black text-emerald-500 mt-1">{approvedCount}</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                bKash Payments
              </div>
              <div className="text-2xl font-black text-pink-500 mt-1">{bkashCount}</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Nagad Payments
              </div>
              <div className="text-2xl font-black text-orange-500 mt-1">{nagadCount}</div>
            </div>
          </div>

          {/* Filters & Search Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Status:
              </span>
              {(['all', 'pending', 'approved', 'rejected'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setPaymentFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                    paymentFilter === st
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Provider Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 mr-1">Gateway:</span>
              {(['all', 'bKash', 'Nagad'] as const).map((pr) => (
                <button
                  key={pr}
                  onClick={() => setProviderFilter(pr)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    providerFilter === pr
                      ? pr === 'bKash'
                        ? 'bg-pink-600 text-white'
                        : pr === 'Nagad'
                        ? 'bg-orange-600 text-white'
                        : 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {pr}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search TrxID, User, Phone..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Payment Requests ({filteredPayments.length})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Approve or reject requests after matching the TrxID with your merchant app.
                </p>
              </div>
            </div>

            {filteredPayments.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400 space-y-2">
                <Clock className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
                <p className="font-bold text-slate-600 dark:text-slate-400">
                  No payment requests match your filter.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="p-4">User Name</th>
                      <th className="p-4">Method</th>
                      <th className="p-4">Sender Phone</th>
                      <th className="p-4">Transaction ID (TrxID)</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Request Date</th>
                      <th className="p-4">Payment Status</th>
                      <th className="p-4 text-right">Verification Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        {/* User Name & Email */}
                        <td className="p-4">
                          <div className="font-extrabold text-slate-900 dark:text-white">
                            {p.userName || 'Customer'}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{p.userEmail}</div>
                        </td>

                        {/* Payment Method */}
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black ${
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

                        {/* Sender Phone */}
                        <td className="p-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                          {p.senderNumber || '—'}
                        </td>

                        {/* Transaction ID */}
                        <td className="p-4 font-mono font-black text-indigo-600 dark:text-indigo-400 tracking-wider">
                          {p.transactionId}
                        </td>

                        {/* Amount */}
                        <td className="p-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          BDT {p.amount}
                        </td>

                        {/* Request Date */}
                        <td className="p-4 text-slate-400 text-[11px]">
                          {new Date(p.createdAt).toLocaleString()}
                        </td>

                        {/* Payment Status */}
                        <td className="p-4">
                          {p.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-black uppercase">
                              <Clock className="w-3 h-3" />
                              Pending
                            </span>
                          )}
                          {p.status === 'approved' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase">
                              <CheckCircle2 className="w-3 h-3" />
                              Approved
                            </span>
                          )}
                          {p.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 text-[10px] font-black uppercase">
                              <X className="w-3 h-3" />
                              Rejected
                            </span>
                          )}
                        </td>

                        {/* Action Buttons */}
                        <td className="p-4 text-right">
                          {p.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleApprove(p.id)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] rounded-lg shadow-sm transition-all flex items-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleReject(p.id)}
                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[11px] rounded-lg shadow-sm transition-all flex items-center gap-1"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </div>
                          ) : p.status === 'approved' ? (
                            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Pro Membership Active</span>
                            </div>
                          ) : (
                            <div className="text-[11px] text-rose-500 font-bold flex items-center justify-end gap-1">
                              <X className="w-3.5 h-3.5" />
                              <span>Membership Inactive</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: UPDATE PAYMENT NUMBERS (bKash & Nagad)             */}
      {/* ========================================================= */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Official Payment Numbers & SaaS Rates
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Authorized administrators can update the bKash and Nagad payment receiving numbers here. Any changes will immediately reflect for all users across the payment modals.
            </p>
          </div>

          <form onSubmit={handleSavePaymentNumbers} className="max-w-2xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* bKash Number */}
              <div className="p-4 rounded-2xl border border-pink-200 dark:border-pink-900/50 bg-pink-50/40 dark:bg-pink-950/20 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-pink-600 text-white text-[10px] font-black flex items-center justify-center">
                    bK
                  </span>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Official bKash Number
                  </label>
                </div>
                <input
                  type="text"
                  value={bkashNum}
                  onChange={(e) => setBkashNum(e.target.value)}
                  placeholder="01618238630"
                  className="w-full px-3.5 py-2 text-sm font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
                <p className="text-[10px] text-slate-500">Currently: {paymentSettings.bkashNumber}</p>
              </div>

              {/* Nagad Number */}
              <div className="p-4 rounded-2xl border border-orange-200 dark:border-orange-900/50 bg-orange-50/40 dark:bg-orange-950/20 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-600 text-white text-[10px] font-black flex items-center justify-center">
                    NG
                  </span>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Official Nagad Number
                  </label>
                </div>
                <input
                  type="text"
                  value={nagadNum}
                  onChange={(e) => setNagadNum(e.target.value)}
                  placeholder="01618238630"
                  className="w-full px-3.5 py-2 text-sm font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
                <p className="text-[10px] text-slate-500">Currently: {paymentSettings.nagadNumber}</p>
              </div>
            </div>

            {/* Pricing Rates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Monthly Pro Subscription Rate (BDT)
                </label>
                <input
                  type="number"
                  min="50"
                  max="5000"
                  value={monthlyPrice}
                  onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 text-sm font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Yearly Pro Subscription Rate (BDT)
                </label>
                <input
                  type="number"
                  min="500"
                  max="50000"
                  value={yearlyPrice}
                  onChange={(e) => setYearlyPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 text-sm font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              {settingsSuccess ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Payment numbers updated successfully!
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">
                  Default Payment Number: <strong>01618238630</strong> for both bKash and Nagad.
                </span>
              )}

              <button
                type="submit"
                disabled={settingsLoading}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{settingsLoading ? 'Saving...' : 'Update Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: PLATFORM OVERVIEW                                  */}
      {/* ========================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-bold text-slate-400 uppercase">Total User Accounts</div>
              <div className="text-3xl font-black mt-2">1,420</div>
              <div className="text-[11px] text-slate-400 mt-2">Free: 1,240 • Pro: 180</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-bold text-slate-400 uppercase">Image Processing Actions</div>
              <div className="text-3xl font-black text-indigo-600 mt-2">38,400+</div>
              <div className="text-[11px] text-slate-400 mt-2">Client-side & Neural engines</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-bold text-slate-400 uppercase">Pending Verifications</div>
              <div className="text-3xl font-black text-amber-500 mt-2">{pendingCount}</div>
              <div className="text-[11px] text-slate-400 mt-2">Review TrxIDs in Payments tab</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div className="text-xs font-bold text-slate-400 uppercase">Payment Gateways</div>
              <div className="text-xl font-black text-slate-800 dark:text-slate-100 mt-2">
                bKash & Nagad
              </div>
              <div className="text-[11px] text-slate-400 mt-2 font-mono">01618238630</div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: TOOL CONTROLS (24+ IMAGE TOOLS)                    */}
      {/* ========================================================= */}
      {activeTab === 'tools' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-sm">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Tool Availability & Access Policies
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Administrators can toggle individual image editing tools dynamically.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{t.name}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                    <span className="capitalize">{t.category}</span>
                    <span>•</span>
                    {t.isPro ? (
                      <span className="text-amber-500 font-bold uppercase">PRO</span>
                    ) : (
                      <span>Free</span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleToolStatus(t.id)}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                    t.enabled
                      ? 'text-emerald-600 hover:text-emerald-700'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {t.enabled ? (
                    <ToggleRight className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-slate-400" />
                  )}
                  <span>{t.enabled ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: AUDIT LOGS                                         */}
      {/* ========================================================= */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 font-bold text-sm text-slate-900 dark:text-white">
            Security & Administration Audit Trail ({auditLogs.length})
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase font-bold">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Admin</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="p-4 font-mono text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                      {log.adminEmail}
                    </td>
                    <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">{log.action}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
