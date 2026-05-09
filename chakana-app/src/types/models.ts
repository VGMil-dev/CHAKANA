export interface User {
  id: string;
  email: string;
  displayName: string;
  walletPubKey: string | null;
  aurioBalance: number;
  createdAt: string;
}

export interface Business {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string | null;
  address: string;
  ownerId: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface Review {
  id: string;
  businessId: string;
  userId: string;
  text: string;
  solanaMemoSignature: string | null;
  auriosRewarded: number;
  createdAt: string;
}

export interface DiscountResult {
  auriosToSpend: number;
  discountUSD: number;
  finalTotal: number;
  maxAuriosAllowed: number;
  isAtMaxDiscount: boolean;
  isBalanceLimited: boolean;
  percentageUsed: number;
}

export type ActiveModal = 'propina' | 'confirmCheckout' | 'reviewSuccess' | 'error' | null;
