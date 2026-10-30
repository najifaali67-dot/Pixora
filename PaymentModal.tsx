import React, { useState } from 'react';
import {
  X,
  Check,
  ShieldCheck,
  Zap,
  Smartphone,
  AlertCircle,
  Copy,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { usePixoraStore } from '../services/store';
import { SupportedPaymentProvider } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPeriod?: 'monthly' | 'yearly';
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  defaultPeriod = 'monthly',
}) => {
  const { paymentSettings, submitPaymentRequest } = usePixoraStore();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>(defaultPeriod);
  const [provider, setProvider] = useState<SupportedPaymentProvider>('bKash');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedPayment, setSubmittedPayment] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentPrice =
    billingPeriod === 'monthly'
      ? paymentSettings.monthlyPriceBdt
      : paymentSettings.yearlyPriceBdt;

  // Payment number for both bKash and Nagad is 01618238630
  const activePaymentNumber =
    provider === 'bKash' ? paymentSettings.bkashNumber : paymentSettings.nagadNumber;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanTrx = trxId.trim();
    if (!cleanTrx || cleanTrx.length < 4) {
      setError('Please enter a valid Transaction ID (e.g., 9X7A2B11 or similar).');
      return;
    }

    const cleanSender = senderNumber.trim();
    if (!cleanSender || cleanSender.length < 10) {
      setError('Please enter your 11-digit sender mobile number (e.g., 017xxxxxxxx).');
      return;
    }

    setLoading(true);

    try {
      const result = await submitPaymentRequest(
        'pro',
        billingPeriod,
        provider,
        cleanSender,
        cleanTrx
      );

      if (!result.success) {
        throw new Error(result.message || 'Payment submission failed.');
      }

      setSubmittedPayment(result.payment);
    } catch (err: any) {
      setError(err.message || 'Failed to submit payment request.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedPayment(null);
    setTrxId('');
    setSenderNumber('');
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 text-white relative shrink-0">
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-amber-300" />
            <span className="text-[11px] font-bold tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded-full">
              Pixora Pro Upgrade
            </span>
          </div>
          <h3 className="text-2xl font-black tracking-tight">Upgrade to Pixora Pro</h3>
          <p className="text-white/80 text-xs sm:text-sm mt-1">
            Unlock AI background removal, 4K upscaler, object eraser & priority processing.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {submittedPayment ? (
            /* Pending Verification Status Confirmation Screen */
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Clock className="w-10 h-10 animate-pulse" />
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                  <Clock className="w-3.5 h-3.5" />
                  Status: Pending Admin Verification
                </span>
                <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
                  Payment Request Submitted!
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1.5 max-w-sm mx-auto leading-relaxed">
                  Thank you! Your payment information has been sent to our verification queue. An administrator will review your Transaction ID on the merchant statement and activate your Pro plan shortly.
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2.5 max-w-sm mx-auto">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Selected Plan:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 uppercase">
                    Pro ({billingPeriod})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Amount:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    BDT {submittedPayment.amount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Method:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        submittedPayment.provider === 'bKash' ? 'bg-pink-500' : 'bg-orange-500'
                      }`}
                    />
                    {submittedPayment.provider}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Sender Phone:</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    {submittedPayment.senderNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="font-mono font-black text-indigo-600 dark:text-indigo-400">
                    {submittedPayment.transactionId}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span className="text-slate-500">Verification:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    Awaiting Admin Approval
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
                >
                  Done (View Status in Dashboard)
                </button>
              </div>
            </div>
          ) : (
            /* Active Payment Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Billing Cycle Picker */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  1. Choose Billing Cycle
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBillingPeriod('monthly')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      billingPeriod === 'monthly'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold">Monthly Plan</div>
                    <div className="text-base font-black text-indigo-600 dark:text-indigo-400 mt-1">
                      BDT {paymentSettings.monthlyPriceBdt}
                    </div>
                    <div className="text-[10px] text-slate-500">Billed monthly</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBillingPeriod('yearly')}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                      billingPeriod === 'yearly'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-500'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="absolute -top-2 right-2 text-[9px] font-extrabold uppercase bg-emerald-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                      Best Value
                    </span>
                    <div className="text-xs font-bold">Yearly Plan</div>
                    <div className="text-base font-black text-indigo-600 dark:text-indigo-400 mt-1">
                      BDT {paymentSettings.yearlyPriceBdt}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-semibold">Save ~37%</div>
                  </button>
                </div>
              </div>

              {/* Supported Payment Methods: strictly bKash & Nagad */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  2. Select Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* bKash */}
                  <button
                    type="button"
                    onClick={() => setProvider('bKash')}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                      provider === 'bKash'
                        ? 'border-pink-500 bg-pink-50/60 dark:bg-pink-950/40 ring-2 ring-pink-500'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-pink-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                        bK
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                          bKash
                        </div>
                        <div className="text-[10px] text-slate-500">Send Money / Pay</div>
                      </div>
                    </div>
                    {provider === 'bKash' && (
                      <div className="w-5 h-5 rounded-full bg-pink-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>

                  {/* Nagad */}
                  <button
                    type="button"
                    onClick={() => setProvider('Nagad')}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                      provider === 'Nagad'
                        ? 'border-orange-500 bg-orange-50/60 dark:bg-orange-950/40 ring-2 ring-orange-500'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                        NG
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                          Nagad
                        </div>
                        <div className="text-[10px] text-slate-500">Send Money / Pay</div>
                      </div>
                    </div>
                    {provider === 'Nagad' && (
                      <div className="w-5 h-5 rounded-full bg-orange-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Payment Number & Instructions Card */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  provider === 'bKash'
                    ? 'bg-pink-50/80 dark:bg-pink-950/30 border-pink-200 dark:border-pink-900/60'
                    : 'bg-orange-50/80 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900/60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Official {provider} Payment Number:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(activePaymentNumber)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? 'Copied!' : 'Copy Number'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="font-mono text-lg font-black tracking-wider text-slate-900 dark:text-white">
                    {activePaymentNumber}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                    Active
                  </span>
                </div>

                {/* Instructions steps */}
                <ol className="mt-3 text-[11px] text-slate-600 dark:text-slate-400 space-y-1 list-decimal list-inside leading-relaxed">
                  <li>
                    Open your <strong>{provider} App</strong> and send <strong>BDT {currentPrice}</strong> to <strong>{activePaymentNumber}</strong>.
                  </li>
                  <li>Use your Name or Email as reference.</li>
                  <li>Copy the <strong>Transaction ID (TrxID)</strong> and enter it below.</li>
                </ol>
              </div>

              {/* Form Input: Sender Phone & TrxID */}
              <div className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    3. Your {provider} Sender Phone Number
                  </label>
                  <input
                    type="tel"
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    placeholder="e.g. 01712345678"
                    className="w-full px-4 py-2.5 text-sm font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    4. {provider} Transaction ID (TrxID)
                  </label>
                  <input
                    type="text"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                    placeholder="e.g. BK9X249A11 or 9A8B7C6D"
                    className="w-full px-4 py-2.5 text-sm font-mono font-bold tracking-wider rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    You can find this in your {provider} confirmation SMS or app statement.
                  </p>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-2 text-rose-700 dark:text-rose-400 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Payment Request (BDT {currentPrice})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-slate-400 mt-2.5 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Payment will be approved by an authorized administrator after verification.</span>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
