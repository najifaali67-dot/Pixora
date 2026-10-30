export type PlanType = 'free' | 'pro';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: PlanType;
  credits: number;
  maxCredits: number;
  role: 'user' | 'admin';
  createdAt: string;
  avatarUrl?: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'edit' | 'refund' | 'subscription' | 'admin_adjustment';
  description: string;
  timestamp: string;
  status: 'completed' | 'refunded' | 'failed';
}

export interface EditedImageItem {
  id: string;
  userId: string;
  type: 'bg_remove' | 'upscale' | 'enhance' | 'object_remove' | 'bg_replace' | 'edit';
  toolName?: string;
  prompt?: string;
  imageUrl: string;
  originalImageUrl?: string;
  createdAt: string;
  creditsCost: number;
  metadata?: {
    width?: number;
    height?: number;
    model?: string;
  };
}

// Payment method strictly limited to bKash and Nagad per user requirements
export type SupportedPaymentProvider = 'bKash' | 'Nagad';

export interface PaymentTransaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  senderNumber: string;
  plan: PlanType;
  billingPeriod: 'monthly' | 'yearly';
  amount: number;
  currency: 'BDT';
  provider: SupportedPaymentProvider;
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  verifiedAt?: string;
  adminActionBy?: string;
}

export interface PaymentSettingsConfig {
  bkashNumber: string;
  nagadNumber: string;
  monthlyPriceBdt: number;
  yearlyPriceBdt: number;
}

export interface ToolDefinition {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: 'basic' | 'conversion' | 'filters' | 'ai' | 'documents';
  icon: string;
  isPro?: boolean;
  creditCost?: number;
  enabled: boolean;
  popular?: boolean;
}

export interface AdminAuditLog {
  id: string;
  adminEmail: string;
  action: string;
  targetUserId?: string;
  details: string;
  timestamp: string;
}

export interface PricingConfig {
  monthlyPriceBdt: number;
  yearlyPriceBdt: number;
  freeInitialCredits: number;
  proMonthlyCredits: number;
  editCost: number;
}
