import type { SellerTier } from './user';

export interface ShippingTier {
  minMiles: number;
  maxMiles: number;
  baseCost: number;
}

export interface CommissionTier {
  tier: SellerTier;
  rate: number;
  features: string[];
  monthlyFee: number;
}

export const SHIPPING_TIERS: ShippingTier[] = [
  { minMiles: 0, maxMiles: 25, baseCost: 5.99 },
  { minMiles: 25, maxMiles: 50, baseCost: 8.99 },
  { minMiles: 50, maxMiles: 100, baseCost: 12.99 },
];

export const COMMISSION_TIERS: CommissionTier[] = [
  {
    tier: 'basic',
    rate: 0.12,
    features: ['Standard listing', 'Basic analytics'],
    monthlyFee: 0,
  },
  {
    tier: 'pro',
    rate: 0.15,
    features: ['Featured placement', 'Advanced analytics', 'Priority support'],
    monthlyFee: 19.99,
  },
  {
    tier: 'premium',
    rate: 0.18,
    features: ['Top placement', 'Promoted listings', 'Dedicated support', 'Bulk order tools'],
    monthlyFee: 49.99,
  },
];

export const BUILD_PASS_MONTHLY = 14.99;
export const BUILD_PASS_FREE_SHIPPING_MIN = 25;
export const LOCAL_PICKUP_SELLER_BONUS_RATE = 0.05;
export const WEIGHT_BASED_SHIPPING_RATE = 0.05; // per lb per mile over 100 miles
