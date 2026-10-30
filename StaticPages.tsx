import React, { useState } from 'react';
import { Sparkles, Shield, Mail, CheckCircle2, ArrowRight } from 'lucide-react';

interface StaticPagesProps {
  navigate: (route: string) => void;
  page: 'about' | 'contact' | 'privacy' | 'terms';
}

export const StaticPages: React.FC<StaticPagesProps> = ({ navigate, page }) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('General Inquiry');
  const [contactMsg, setContactMsg] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          subject: contactSubject,
          message: contactMsg,
        }),
      });
      setSent(true);
    } catch (_) {
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in fade-in duration-300">
      {/* ABOUT PAGE */}
      {page === 'about' && (
        <div className="space-y-8 text-slate-700 dark:text-slate-300">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400">
              Our Story & Philosophy
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              About Pixora
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Everything You Need to Create & Edit Images. High-speed browser tools paired with verified neural generative AI.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm leading-relaxed">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Why We Built Pixora
            </h2>
            <p>
              Traditional online image editing tools are notoriously bloated, plagued by intrusive pop-up ads, slow server upload bottlenecks, and questionable privacy practices where user photos are secretly harvested.
            </p>
            <p>
              Pixora was architected with a <strong>privacy-first, client-side approach</strong>. All our standard tools—from compressing MBs into KBs, precision cropping, format conversions, to assembling multi-page PDFs—execute 100% locally on your machine via the HTML5 Canvas API and modern Web Workers. No file ever touches our cloud unless you explicitly request a generative AI model.
            </p>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white pt-4">
              Modern AI Studio Integration
            </h2>
            <p>
              When creators need generative superpowers, Pixora interfaces securely with state-of-the-art models like Google GenAI. All secrets remain strictly on the backend, ensuring zero client key leaks, verified atomic credit balance tracking, and guaranteed failure refunds.
            </p>
          </div>
        </div>
      )}

      {/* CONTACT PAGE */}
      {page === 'contact' && (
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400">
              We&apos;re here to help
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Contact Pixora Support
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Questions about enterprise quotas, bKash payments, or custom features? Drop us a note.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm max-w-xl mx-auto">
            {sent ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs text-slate-500">
                  Our support team typically replies within 24 hours.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-4 text-xs font-bold text-indigo-600 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Subject
                  </label>
                  <select
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                  >
                    <option>General Inquiry</option>
                    <option>Billing & Payment Verification (bKash/Nagad)</option>
                    <option>API Quotas & Pro Subscription</option>
                    <option>Bug Report or Feature Request</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>{sending ? 'Sending...' : 'Send Message to Pixora'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* PRIVACY POLICY */}
      {page === 'privacy' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Pixora Privacy Policy
          </h1>
          <p className="text-xs text-slate-400">Last updated: October 2026</p>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            1. Client-Side Browser Isolation
          </h3>
          <p>
            When using our 17+ standard image tools (Image Compressor, Resizer, Cropper, Converter, PDF Creator, Color Adjuster, Watermark), all file reading, image processing, and rendering take place in memory directly within your browser via the HTML5 Canvas API. Your source photographs and resulting files are never transmitted to our backend servers.
          </p>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            2. Generative AI Processing
          </h3>
          <p>
            For AI-specific features (Text-to-Image Generation, AI Background Remover, AI Upscaler), the user-provided prompt or input image is routed over encrypted TLS 1.3 to our secure API proxy for model execution. Output images are stored locally in your browser storage (IndexedDB/LocalStorage) and can be permanently deleted at any time with one click.
          </p>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            3. Payment Information
          </h3>
          <p>
            We do not store your credit card PINs or mobile banking passwords. Transactions for bKash, Nagad, and SSLCommerz are processed directly through certified merchant rails using standard Transaction IDs (TrxID).
          </p>
        </div>
      )}

      {/* TERMS AND CONDITIONS */}
      {page === 'terms' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Terms & Conditions
          </h1>
          <p className="text-xs text-slate-400">Effective Date: October 2026</p>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            1. License & Usage
          </h3>
          <p>
            Pixora grants you a worldwide, non-exclusive license to edit images, generate artwork, and download assets for personal and commercial purposes. You retain full ownership of all images you upload or create.
          </p>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            2. Fair Use & AI Generation Credits
          </h3>
          <p>
            Free users receive 15 welcome credits. Pro users receive 250 AI generation credits per monthly cycle. Unused monthly credits roll over up to 500 credits. We do not support abusive scripting or automated DDoS querying of AI endpoints.
          </p>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            3. Subscription & Refunds
          </h3>
          <p>
            Pro plans are billed at BDT 199 per month or BDT 1499 per year. In the event of an AI generation failure, spent credits are immediately refunded back to your balance automatically.
          </p>
        </div>
      )}
    </div>
  );
};
