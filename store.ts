import { useState, useEffect } from 'react';
import {
  UserProfile,
  PlanType,
  EditedImageItem,
  CreditTransaction,
  PaymentTransaction,
  PaymentSettingsConfig,
  AdminAuditLog,
  PricingConfig,
  ToolDefinition,
  SupportedPaymentProvider,
} from '../types';
import {
  storeImageInDB,
  getImageFromDB,
  deleteImageFromDB,
  clearAllImagesFromDB,
} from './imageStorage';

export const TOOLS_LIST: ToolDefinition[] = [
  // AI Neural Photo Tools (Real background remover, upscaler, enhancer, eraser, background replacer)
  {
    id: 'ai-bg-remover',
    name: 'AI Background Remover',
    slug: 'ai-background-remover',
    description: 'Instantly isolate subjects and cut out background with pixel-perfect transparency (PNG).',
    category: 'ai',
    icon: 'Scissors',
    isPro: true,
    creditCost: 3,
    enabled: true,
    popular: true,
  },
  {
    id: 'ai-upscaler',
    name: 'AI Image Upscaler',
    slug: 'ai-image-upscaler',
    description: 'Upscale resolution up to 4x while recovering sharp details and textures without blur.',
    category: 'ai',
    icon: 'Maximize',
    isPro: true,
    creditCost: 3,
    enabled: true,
    popular: true,
  },
  {
    id: 'ai-enhancer',
    name: 'AI Image Enhancer',
    slug: 'ai-image-enhancer',
    description: 'Automatically balance lighting, colors, remove digital noise and optimize clarity.',
    category: 'ai',
    icon: 'Wand2',
    isPro: true,
    creditCost: 3,
    enabled: true,
    popular: true,
  },
  {
    id: 'ai-object-remover',
    name: 'AI Object Remover',
    slug: 'ai-object-remover',
    description: 'Erase unwanted people, text, power lines or blemishes seamlessly with inpainting.',
    category: 'ai',
    icon: 'Eraser',
    isPro: true,
    creditCost: 3,
    enabled: true,
  },
  {
    id: 'ai-bg-generator',
    name: 'AI Background Generator',
    slug: 'ai-background-generator',
    description: 'Replace photo background with professional studio or scenic backgrounds.',
    category: 'ai',
    icon: 'Layers',
    isPro: true,
    creditCost: 3,
    enabled: true,
  },

  // Basic Image Tools
  {
    id: 'image-compressor',
    name: 'Image Compressor',
    slug: 'image-compressor',
    description: 'Reduce JPG, PNG, and WebP file size by up to 85% while keeping crisp visual quality.',
    category: 'basic',
    icon: 'Minimize2',
    isPro: false,
    creditCost: 0,
    enabled: true,
    popular: true,
  },
  {
    id: 'image-resizer',
    name: 'Image Resizer',
    slug: 'image-resizer',
    description: 'Resize dimensions in pixels with aspect ratio preservation and popular social presets.',
    category: 'basic',
    icon: 'Scaling',
    isPro: false,
    creditCost: 0,
    enabled: true,
    popular: true,
  },
  {
    id: 'image-cropper',
    name: 'Image Cropper',
    slug: 'image-cropper',
    description: 'Crop images freehand or snap to exact ratios (1:1, 16:9, 9:16, 4:3).',
    category: 'basic',
    icon: 'Crop',
    isPro: false,
    creditCost: 0,
    enabled: true,
    popular: true,
  },
  {
    id: 'image-rotator',
    name: 'Image Rotator',
    slug: 'image-rotator',
    description: 'Rotate images clockwise or counter-clockwise by 90°, 180°, or 270° without quality loss.',
    category: 'basic',
    icon: 'RotateCw',
    isPro: false,
    creditCost: 0,
    enabled: true,
  },
  {
    id: 'image-flipper',
    name: 'Image Flipper',
    slug: 'image-flipper',
    description: 'Mirror flip photos horizontally or vertically in a single click.',
    category: 'basic',
    icon: 'FlipHorizontal',
    isPro: false,
    creditCost: 0,
    enabled: true,
  },

  // Format Converters
  {
    id: 'image-converter',
    name: 'Format Converter',
    slug: 'image-converter',
    description: 'Convert between JPG, PNG, WebP, GIF and BMP formats with instant browser processing.',
    category: 'conversion',
    icon: 'ArrowRightLeft',
    isPro: false,
    creditCost: 0,
    enabled: true,
    popular: true,
  },
  {
    id: 'jpg-to-png',
    name: 'JPG to PNG',
    slug: 'jpg-to-png',
    description: 'Convert JPEG images to PNG format with maximum fidelity and transparency preservation.',
    category: 'conversion',
    icon: 'FileCode',
    isPro: false,
    creditCost: 0,
    enabled: true,
  },
  {
    id: 'png-to-jpg',
    name: 'PNG to JPG',
    slug: 'png-to-jpg',
    description: 'Convert transparent or heavy PNG graphics into lightweight standard JPEG.',
    category: 'conversion',
    icon: 'FileImage',
    isPro: false,
    creditCost: 0,
    enabled: true,
  },
  {
    id: 'png-to-webp',
    name: 'PNG to WebP',
    slug: 'png-to-webp',
    description: 'Convert PNG images to modern lightweight Google WebP with full alpha transparency.',
    category: 'conversion',
    icon: 'Zap',
    isPro: false,
    creditCost: 0,
    enabled: true,
  },
  {
    id: 'webp-to-jpg',
    name: 'WebP to JPG',
    slug: 'webp-to-jpg',
    description: 'Convert WebP internet images into universally compatible JPEG photos.',
    category: 'conversion',
    icon: 'RefreshCw',
    isPro: false,
    creditCost: 0,
    enabled: true,
  },

  // Documents & PDF
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    slug: 'image-to-pdf',
    description: 'Merge and convert multiple photos or scanned receipts into a single downloadable PDF document.',
    category: 'documents',
    icon: 'FileText',
    isPro: false,
    creditCost: 0,
    enabled: true,
    popular: true,
  },

  // Watermark & Brand
  {
    id: 'image-watermark',
    name: 'Watermark Photo',
    slug: 'image-watermark',
    description: 'Add custom copyright text or logos to protect your images with opacity & position control.',
    category: 'filters',
    icon: 'Stamp',
    isPro: false,
    creditCost: 0,
    enabled: true,
  },

  // Creative Filters & Effects
  {
    id: 'rounded-corners',
    name: 'Rounded Corners',
    slug: 'rounded-corners',
    description: 'Create smooth round border corners and circular avatar cutouts on transparent backgrounds.',
    category: 'filters',
    icon: 'Smile',
    isPro: false,
    creditCost: 0,
    enabled: true,
  },
  {
    id: 'grayscale',
    name: 'Grayscale & B/W',
    slug: 'grayscale',
    description: 'Transform vibrant color images into artistic high-contrast black and white photos.',
    category: 'filters',
    icon: 'Contrast',
    isPro: false,
    creditCost: 0,
    enabled: true,
  },
  {
    id: 'blur-image',
    name: 'Blur Image',
    slug: 'blur-image',
    description: 'Apply Gaussian defocus blur to hide sensitive regions, backgrounds, or create soft aesthetic looks.',
    category: 'filters',
    icon: 'EyeOff',
    isPro: false,
    creditCost: 0,
    enabled: true,
  },
  {
    id: 'image-color-adjuster',
    name: 'Color Adjuster',
    slug: 'image-color-adjuster',
    description: 'Fine-tune brightness, contrast, saturation, hue and sepia with real-time canvas sliders.',
    category: 'filters',
    icon: 'Sliders',
    isPro: false,
    creditCost: 0,
    enabled: true,
  },
  {
    id: 'image-metadata-viewer',
    name: 'Metadata Viewer',
    slug: 'image-metadata-viewer',
    description: 'Inspect image technical data, dimensions, resolution, color space, and file attributes.',
    category: 'basic',
    icon: 'Info',
    isPro: false,
    creditCost: 0,
    enabled: true,
  },
];

const DEFAULT_USER: UserProfile = {
  id: 'user_pixora_demo',
  name: 'Tanvir Hossain',
  email: 'najifaali67@gmail.com',
  plan: 'free', // Default is free until admin approves payment!
  credits: 15,
  maxCredits: 250,
  role: 'admin', // Demo includes admin toggle to test approval workflows
  createdAt: new Date().toISOString(),
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
};

const DEFAULT_PAYMENT_SETTINGS: PaymentSettingsConfig = {
  bkashNumber: '01618238630',
  nagadNumber: '01618238630',
  monthlyPriceBdt: 199,
  yearlyPriceBdt: 1499,
};

const STORAGE_KEYS = {
  USER: 'pixora_user_profile',
  HISTORY: 'pixora_image_edit_history',
  CREDIT_TX: 'pixora_credit_transactions',
  PAYMENTS: 'pixora_payment_transactions',
  PAYMENT_SETTINGS: 'pixora_payment_settings',
  AUDIT: 'pixora_admin_audit_logs',
  TOOLS: 'pixora_tools_list',
};

export class PixoraStore {
  private static user: UserProfile = (() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return DEFAULT_USER;
  })();

  private static history: EditedImageItem[] = (() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const items: EditedImageItem[] = parsed.slice(0, 10).map((it: any) => ({
            ...it,
            imageUrl: it.imageUrl || '',
          }));
          setTimeout(() => {
            Promise.all(
              items.map(async (it) => {
                const dbImage = await getImageFromDB(it.id);
                if (dbImage) it.imageUrl = dbImage;
              })
            ).then(() => PixoraStore.notify());
          }, 0);
          return items;
        }
      }
    } catch (_) {}
    return [];
  })();

  private static creditTransactions: CreditTransaction[] = (() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CREDIT_TX);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [
      {
        id: 'tx_init',
        userId: 'user_pixora_demo',
        amount: 15,
        type: 'subscription',
        description: 'Welcome Free Tier Photo Credits',
        timestamp: new Date().toISOString(),
        status: 'completed',
      },
    ];
  })();

  private static payments: PaymentTransaction[] = (() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [
      {
        id: 'pay_demo_01',
        userId: 'user_pixora_demo',
        userName: 'Tanvir Hossain',
        userEmail: 'najifaali67@gmail.com',
        senderNumber: '01711987654',
        provider: 'bKash',
        transactionId: 'BK9X249A11',
        plan: 'pro',
        billingPeriod: 'monthly',
        amount: 199,
        currency: 'BDT',
        status: 'pending',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ];
  })();

  private static paymentSettings: PaymentSettingsConfig = (() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAYMENT_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return DEFAULT_PAYMENT_SETTINGS;
  })();

  private static auditLogs: AdminAuditLog[] = (() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [
      {
        id: 'log_01',
        adminEmail: 'najifaali67@gmail.com',
        action: 'System initialized',
        details: 'Pixora Image Tools and bKash/Nagad Payment Engine loaded',
        timestamp: new Date().toISOString(),
      },
    ];
  })();

  private static listeners: Set<() => void> = new Set();

  static subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private static notify() {
    this.listeners.forEach((fn) => fn());
  }

  // Initial backend sync
  static async syncWithBackend() {
    try {
      // 1. Fetch live payment settings (numbers)
      const res = await fetch('/api/payments/settings');
      if (res.ok) {
        const settings = await res.json();
        if (settings.bkashNumber && settings.nagadNumber) {
          this.paymentSettings = settings;
          localStorage.setItem(STORAGE_KEYS.PAYMENT_SETTINGS, JSON.stringify(settings));
        }
      }

      // 2. Fetch payments list from server
      const roleParam = this.user.role === 'admin' ? '&role=admin' : '';
      const payRes = await fetch(`/api/payments?userId=${this.user.id}${roleParam}`);
      if (payRes.ok) {
        const data = await payRes.json();
        if (Array.isArray(data.payments) && data.payments.length > 0) {
          this.payments = data.payments;
          localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(this.payments));
        }
      }

      // 3. Verify server-authoritative membership
      const memRes = await fetch(`/api/user/membership/${this.user.id}`);
      if (memRes.ok) {
        const memData = await memRes.json();
        if (memData.plan && memData.plan !== this.user.plan) {
          this.user = {
            ...this.user,
            plan: memData.plan,
          };
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));
        }
      }

      this.notify();
    } catch (err) {
      console.warn('Backend sync fallback to local storage:', err);
    }
  }

  // Getters
  static getUser(): UserProfile {
    return { ...this.user };
  }

  static getHistory(): EditedImageItem[] {
    return [...this.history];
  }

  static getCreditTransactions(): CreditTransaction[] {
    return [...this.creditTransactions];
  }

  static getPayments(): PaymentTransaction[] {
    return [...this.payments];
  }

  static getPaymentSettings(): PaymentSettingsConfig {
    return { ...this.paymentSettings };
  }

  static getPricing(): PricingConfig {
    return {
      monthlyPriceBdt: this.paymentSettings.monthlyPriceBdt,
      yearlyPriceBdt: this.paymentSettings.yearlyPriceBdt,
      freeInitialCredits: 15,
      proMonthlyCredits: 250,
      editCost: 3,
    };
  }

  static getAuditLogs(): AdminAuditLog[] {
    return [...this.auditLogs];
  }

  static getTools(): ToolDefinition[] {
    return TOOLS_LIST;
  }

  // User Actions
  static login(email: string, name = 'Pixora Creator') {
    this.user = {
      ...this.user,
      email,
      name,
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));
    this.notify();
  }

  static logout() {
    this.user = {
      ...DEFAULT_USER,
      email: 'guest@pixora.app',
      name: 'Guest User',
      role: 'user',
      plan: 'free',
      credits: 5,
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));
    this.notify();
  }

  static toggleAdminRole() {
    this.user = {
      ...this.user,
      role: this.user.role === 'admin' ? 'user' : 'admin',
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));
    this.syncWithBackend();
    this.notify();
  }

  static updateUserProfile(data: Partial<UserProfile>) {
    this.user = { ...this.user, ...data };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));
    this.notify();
  }

  // Credit Deduction & Failure Refund
  static checkCredits(cost: number): boolean {
    return this.user.credits >= cost;
  }

  static deductCredits(cost: number, description: string): boolean {
    if (this.user.credits < cost) return false;

    this.user = {
      ...this.user,
      credits: Math.max(0, this.user.credits - cost),
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));

    const tx: CreditTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: this.user.id,
      amount: -cost,
      type: 'edit',
      description,
      timestamp: new Date().toISOString(),
      status: 'completed',
    };
    this.creditTransactions.unshift(tx);
    localStorage.setItem(STORAGE_KEYS.CREDIT_TX, JSON.stringify(this.creditTransactions));

    this.notify();
    return true;
  }

  static refundCredits(cost: number, reason: string) {
    this.user = {
      ...this.user,
      credits: this.user.credits + cost,
    };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));

    const tx: CreditTransaction = {
      id: `tx_ref_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: this.user.id,
      amount: cost,
      type: 'refund',
      description: `Refund: ${reason}`,
      timestamp: new Date().toISOString(),
      status: 'refunded',
    };
    this.creditTransactions.unshift(tx);
    localStorage.setItem(STORAGE_KEYS.CREDIT_TX, JSON.stringify(this.creditTransactions));

    this.notify();
  }

  // Edit History Storage
  static addEditHistory(item: Omit<EditedImageItem, 'id' | 'userId' | 'createdAt'>): EditedImageItem {
    const id = `img_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newItem: EditedImageItem = {
      ...item,
      id,
      userId: this.user.id,
      createdAt: new Date().toISOString(),
    };

    if (item.imageUrl) {
      storeImageInDB(id, item.imageUrl);
    }

    this.history.unshift(newItem);
    if (this.history.length > 10) {
      const removed = this.history.slice(10);
      removed.forEach((r) => deleteImageFromDB(r.id));
      this.history = this.history.slice(0, 10);
    }

    try {
      const metadataOnly = this.history.map(({ imageUrl, originalImageUrl, ...meta }) => ({
        ...meta,
        imageUrl: '',
      }));
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(metadataOnly));
    } catch (_) {}

    this.notify();
    return newItem;
  }

  static deleteEditHistory(id: string) {
    this.history = this.history.filter((item) => item.id !== id);
    deleteImageFromDB(id);
    try {
      const metadataOnly = this.history.map(({ imageUrl, originalImageUrl, ...meta }) => ({
        ...meta,
        imageUrl: '',
      }));
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(metadataOnly));
    } catch (_) {}
    this.notify();
  }

  static clearHistory() {
    this.history = [];
    clearAllImagesFromDB();
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([]));
    } catch (_) {}
    this.notify();
  }

  // ========================================================
  // Real bKash / Nagad Payment Request System
  // ========================================================

  /**
   * Submits a payment request for Pro subscription.
   * CRITICAL RULE: Sets status to 'pending'. Pro plan is NEVER activated before admin approval!
   */
  static async submitPaymentRequest(
    plan: PlanType,
    billingPeriod: 'monthly' | 'yearly',
    provider: SupportedPaymentProvider,
    senderNumber: string,
    transactionId: string
  ): Promise<{ success: boolean; message: string; payment?: PaymentTransaction }> {
    const cleanTrx = transactionId.trim().toUpperCase();
    const amount =
      billingPeriod === 'monthly'
        ? this.paymentSettings.monthlyPriceBdt
        : this.paymentSettings.yearlyPriceBdt;

    try {
      // Call backend API endpoint
      const res = await fetch('/api/payments/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.user.id,
          userName: this.user.name,
          userEmail: this.user.email,
          senderNumber: senderNumber.trim(),
          provider,
          transactionId: cleanTrx,
          plan,
          billingPeriod,
          amount,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit payment request.');
      }

      const payment: PaymentTransaction = data.payment || {
        id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: this.user.id,
        userName: this.user.name,
        userEmail: this.user.email,
        senderNumber: senderNumber.trim(),
        plan,
        billingPeriod,
        amount,
        currency: 'BDT',
        provider,
        transactionId: cleanTrx,
        status: 'pending', // Pending admin approval
        createdAt: new Date().toISOString(),
      };

      // Add to local state with 'pending' status
      this.payments.unshift(payment);
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(this.payments));

      // Record audit log
      this.addAuditLog(
        `Submitted ${provider} Payment Request`,
        `TrxID: ${cleanTrx}, Sender: ${senderNumber}, Amount: BDT ${amount}. Status: Pending Verification.`
      );

      this.notify();
      return {
        success: true,
        message: 'Payment request submitted successfully. Status is Pending Admin Review.',
        payment,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Payment submission failed.',
      };
    }
  }

  // ========================================================
  // Admin Approval & Management
  // ========================================================

  /**
   * Approves a pending payment request.
   * Activates the target user's Pro Membership and adds Pro credits.
   */
  static async adminApprovePayment(paymentId: string): Promise<boolean> {
    if (this.user.role !== 'admin') {
      console.error('Unauthorized: Admin role required');
      return false;
    }

    try {
      const res = await fetch(`/api/admin/payments/${paymentId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-role': 'admin',
        },
        body: JSON.stringify({
          adminRole: 'admin',
          adminEmail: this.user.email,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to approve payment on server');
      }

      // Update in local payment list
      const paymentIndex = this.payments.findIndex((p) => p.id === paymentId);
      if (paymentIndex !== -1) {
        this.payments[paymentIndex] = {
          ...this.payments[paymentIndex],
          status: 'approved',
          verifiedAt: new Date().toISOString(),
          adminActionBy: this.user.email,
        };
        localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(this.payments));

        // If the approved payment belongs to the current user, activate Pro Plan!
        if (this.payments[paymentIndex].userId === this.user.id) {
          this.user = {
            ...this.user,
            plan: 'pro',
            credits: this.user.credits + 250,
            maxCredits: 250,
          };
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));

          const creditTx: CreditTransaction = {
            id: `tx_pro_${Date.now()}`,
            userId: this.user.id,
            amount: 250,
            type: 'subscription',
            description: `Pro Plan Activated (${this.payments[paymentIndex].provider} TrxID: ${this.payments[paymentIndex].transactionId})`,
            timestamp: new Date().toISOString(),
            status: 'completed',
          };
          this.creditTransactions.unshift(creditTx);
          localStorage.setItem(STORAGE_KEYS.CREDIT_TX, JSON.stringify(this.creditTransactions));
        }

        this.addAuditLog(
          'Approved Payment Request',
          `Approved ${this.payments[paymentIndex].provider} TrxID: ${this.payments[paymentIndex].transactionId} for ${this.payments[paymentIndex].userEmail}. Pro plan activated.`
        );

        this.notify();
        return true;
      }
    } catch (err) {
      console.error('Error approving payment:', err);
    }
    return false;
  }

  /**
   * Rejects a payment request.
   * Pro membership remains inactive.
   */
  static async adminRejectPayment(paymentId: string, reason = 'TrxID could not be verified on merchant statement'): Promise<boolean> {
    if (this.user.role !== 'admin') {
      console.error('Unauthorized: Admin role required');
      return false;
    }

    try {
      const res = await fetch(`/api/admin/payments/${paymentId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-role': 'admin',
        },
        body: JSON.stringify({
          adminRole: 'admin',
          adminEmail: this.user.email,
          reason,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to reject payment on server');
      }

      const paymentIndex = this.payments.findIndex((p) => p.id === paymentId);
      if (paymentIndex !== -1) {
        this.payments[paymentIndex] = {
          ...this.payments[paymentIndex],
          status: 'rejected',
          verifiedAt: new Date().toISOString(),
          adminActionBy: this.user.email,
        };
        localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(this.payments));

        // If the rejected payment was for current user, keep plan as free
        if (this.payments[paymentIndex].userId === this.user.id) {
          const hasOtherApproved = this.payments.some(
            (p) => p.userId === this.user.id && p.id !== paymentId && p.status === 'approved'
          );
          if (!hasOtherApproved) {
            this.user = {
              ...this.user,
              plan: 'free',
            };
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.user));
          }
        }

        this.addAuditLog(
          'Rejected Payment Request',
          `Rejected TrxID: ${this.payments[paymentIndex].transactionId} (${this.payments[paymentIndex].provider}). Reason: ${reason}`
        );

        this.notify();
        return true;
      }
    } catch (err) {
      console.error('Error rejecting payment:', err);
    }
    return false;
  }

  /**
   * Allows authorized admins to update payment numbers (e.g. bKash and Nagad).
   */
  static async adminUpdatePaymentNumbers(newSettings: Partial<PaymentSettingsConfig>): Promise<boolean> {
    if (this.user.role !== 'admin') return false;

    try {
      const res = await fetch('/api/admin/payment-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-role': 'admin',
        },
        body: JSON.stringify({
          adminRole: 'admin',
          ...newSettings,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        this.paymentSettings = {
          ...this.paymentSettings,
          ...data.settings,
        };
        localStorage.setItem(STORAGE_KEYS.PAYMENT_SETTINGS, JSON.stringify(this.paymentSettings));

        this.addAuditLog(
          'Updated Payment Numbers',
          `bKash: ${this.paymentSettings.bkashNumber}, Nagad: ${this.paymentSettings.nagadNumber}`
        );

        this.notify();
        return true;
      }
    } catch (err) {
      console.error('Error updating payment numbers:', err);
    }
    return false;
  }

  static addAuditLog(action: string, details: string) {
    const log: AdminAuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      adminEmail: this.user.email,
      action,
      details,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 50) this.auditLogs = this.auditLogs.slice(0, 50);
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(this.auditLogs));
    } catch (_) {}
    this.notify();
  }

  static toggleToolStatus(toolId: string) {
    const tool = TOOLS_LIST.find((t) => t.id === toolId);
    if (tool) {
      tool.enabled = !tool.enabled;
      this.addAuditLog(
        `Tool policy updated: ${tool.name}`,
        `Status set to ${tool.enabled ? 'ACTIVE' : 'DISABLED'}`
      );
      this.notify();
    }
  }
}

// React Hook
export function usePixoraStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    // Initial sync with backend
    PixoraStore.syncWithBackend();
    return PixoraStore.subscribe(() => setTick((t) => t + 1));
  }, []);

  return {
    user: PixoraStore.getUser(),
    history: PixoraStore.getHistory(),
    creditTransactions: PixoraStore.getCreditTransactions(),
    payments: PixoraStore.getPayments(),
    paymentSettings: PixoraStore.getPaymentSettings(),
    pricing: PixoraStore.getPricing(),
    auditLogs: PixoraStore.getAuditLogs(),
    tools: PixoraStore.getTools(),
    login: PixoraStore.login.bind(PixoraStore),
    logout: PixoraStore.logout.bind(PixoraStore),
    toggleAdminRole: PixoraStore.toggleAdminRole.bind(PixoraStore),
    updateUserProfile: PixoraStore.updateUserProfile.bind(PixoraStore),
    checkCredits: PixoraStore.checkCredits.bind(PixoraStore),
    deductCredits: PixoraStore.deductCredits.bind(PixoraStore),
    refundCredits: PixoraStore.refundCredits.bind(PixoraStore),
    addEditHistory: PixoraStore.addEditHistory.bind(PixoraStore),
    addGeneration: PixoraStore.addEditHistory.bind(PixoraStore),
    deleteEditHistory: PixoraStore.deleteEditHistory.bind(PixoraStore),
    clearHistory: PixoraStore.clearHistory.bind(PixoraStore),
    submitPaymentRequest: PixoraStore.submitPaymentRequest.bind(PixoraStore),
    adminApprovePayment: PixoraStore.adminApprovePayment.bind(PixoraStore),
    adminRejectPayment: PixoraStore.adminRejectPayment.bind(PixoraStore),
    adminUpdatePaymentNumbers: PixoraStore.adminUpdatePaymentNumbers.bind(PixoraStore),
    toggleToolStatus: PixoraStore.toggleToolStatus.bind(PixoraStore),
  };
}
