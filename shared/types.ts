/* shared/types.ts - SINGLE SOURCE OF TRUTH */

export interface User {
  id: string;
  walletAddress: string;
  createdAt: string;
  preferences: Record<string, any>;
  budgetLimit?: number;
}

export interface Merchant {
  id: string;
  walletAddress: string;
  businessName: string;
  logoUrl?: string;
  verified: boolean;
}

export interface SubscriptionPlan {
  id: string;
  merchantId: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  interval: 'monthly' | 'yearly';
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  merchantName: string;
  amount: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  status: 'active' | 'paused' | 'cancelled';
  nextPaymentDate: string;
  vaultAddress: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'pending';
  txHash?: string;
  executedAt: string;

  // Hydra simulation extensions
  isHydraSimulation?: boolean;
  processingTime?: number; // milliseconds
}

export interface WalletConnection {
  address: string;
  network: 'mainnet' | 'preprod' | 'preview';
  balance: number;
}

export interface HydraPaymentOptions {
  enabled: boolean;
  estimatedTime: number; // milliseconds
  estimatedFee: number; // ADA
  description: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SpendingAnalytics {
  totalMonthly: number;
  totalYearly: number;
  byCategory: Record<string, number>;
  byMerchant: Record<string, number>;
  avgPerSubscription: number;
}
