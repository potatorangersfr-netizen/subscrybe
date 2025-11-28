// User types
export interface User {
  id: string;
  walletAddress: string;
  createdAt: string;
  preferences: Record<string, any>;
  budgetLimit?: number;
}

// Merchant types
export interface Merchant {
  id: string;
  walletAddress: string;
  businessName: string;
  logoUrl?: string;
  verified: boolean;
}

// Subscription Plan types
export interface SubscriptionPlan {
  id: string;
  merchantId: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  interval: 'monthly' | 'yearly';
}

// Subscription types
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

// Payment types
export interface Payment {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'pending';
  txHash?: string;
  executedAt: string;
  isHydraSimulation?: boolean;
  processingTime?: number;
}

// Hydra types
export interface HydraPaymentOptions {
  enabled: boolean;
  estimatedTime: number;
  estimatedFee: number;
  description: string;
}

// Wallet Connection types
export interface WalletConnection {
  address: string;
  network: string;
  balance: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Analytics types
export interface SpendingAnalytics {
  totalMonthly: number;
  totalYearly: number;
  byCategory: Record<string, number>;
  byMerchant: Record<string, number>;
  averagePerSubscription: number;
}

// Privacy types
export interface UserData {
  user: User;
  subscriptions: Subscription[];
  payments: Payment[];
}