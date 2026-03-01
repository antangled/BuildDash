import type { PriceBreakdown, DeliveryMethod } from '@/types/order';
import type { SellerTier } from '@/types/user';
import {
  BUILD_PASS_FREE_SHIPPING_MIN,
  LOCAL_PICKUP_SELLER_BONUS_RATE,
} from '@/types/pricing';
import { getShippingCost } from './distance';

const COMMISSION_RATES: Record<SellerTier, number> = {
  basic: 0.12,
  pro: 0.15,
  premium: 0.18,
};

export function calculatePriceBreakdown(params: {
  fabricationCost: number;
  materialCost: number;
  sellerTier: SellerTier;
  deliveryMethod: DeliveryMethod;
  distanceMiles: number;
  hasBuildPass: boolean;
  shippingWeightLbs?: number;
}): PriceBreakdown {
  const {
    fabricationCost,
    materialCost,
    sellerTier,
    deliveryMethod,
    distanceMiles,
    hasBuildPass,
    shippingWeightLbs = 1,
  } = params;

  const subtotal = fabricationCost + materialCost;
  const commissionRate = COMMISSION_RATES[sellerTier];
  const platformFee = Math.round(subtotal * commissionRate * 100) / 100;

  let shippingCost = 0;
  if (deliveryMethod === 'shipping') {
    shippingCost = getShippingCost(distanceMiles, shippingWeightLbs);
  }

  let buildPassDiscount = 0;
  if (hasBuildPass && deliveryMethod === 'shipping' && subtotal >= BUILD_PASS_FREE_SHIPPING_MIN) {
    buildPassDiscount = shippingCost;
    shippingCost = 0;
  }

  let localPickupBonus = 0;
  if (deliveryMethod === 'local_pickup') {
    localPickupBonus = Math.round(subtotal * LOCAL_PICKUP_SELLER_BONUS_RATE * 100) / 100;
  }

  const total = Math.round((subtotal + platformFee + shippingCost) * 100) / 100;

  return {
    fabricationCost,
    materialCost,
    platformFee,
    shippingCost,
    buildPassDiscount,
    localPickupBonus,
    total,
  };
}

export function getSellerEarnings(breakdown: PriceBreakdown): number {
  return Math.round(
    (breakdown.fabricationCost + breakdown.materialCost + breakdown.localPickupBonus) * 100
  ) / 100;
}

export function getPlatformRevenue(breakdown: PriceBreakdown): number {
  return breakdown.platformFee;
}

export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function estimatePartCost(params: {
  volumeCm3: number;
  materialCostPerGram: number;
  densityGPerCm3?: number;
  pricePerHour: number;
  estimatedHours?: number;
}): { fabricationCost: number; materialCost: number } {
  const density = params.densityGPerCm3 ?? 1.24; // PLA default
  const weightGrams = params.volumeCm3 * density;
  const materialCost = Math.round(weightGrams * params.materialCostPerGram * 100) / 100;

  // Rough estimate: 1 hour per 50cm³ for FDM
  const hours = params.estimatedHours ?? Math.max(0.5, params.volumeCm3 / 50);
  const fabricationCost = Math.round(hours * params.pricePerHour * 100) / 100;

  return { fabricationCost, materialCost };
}
