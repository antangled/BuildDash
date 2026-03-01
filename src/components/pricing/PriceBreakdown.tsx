'use client';

import type { PriceBreakdown as PriceBreakdownType } from '@/types/order';
import { formatPrice } from '@/lib/pricing';

interface PriceBreakdownProps {
  breakdown: PriceBreakdownType;
  showSellerView?: boolean;
}

export default function PriceBreakdown({ breakdown, showSellerView = false }: PriceBreakdownProps) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="font-semibold text-slate-800 mb-3">Price Breakdown</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">Fabrication</span>
          <span className="font-medium">{formatPrice(breakdown.fabricationCost)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Material</span>
          <span className="font-medium">{formatPrice(breakdown.materialCost)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Platform fee</span>
          <span className="font-medium">{formatPrice(breakdown.platformFee)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Shipping</span>
          <span className="font-medium">
            {breakdown.shippingCost === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              formatPrice(breakdown.shippingCost)
            )}
          </span>
        </div>
        {breakdown.buildPassDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>BuildPass discount</span>
            <span>-{formatPrice(breakdown.buildPassDiscount)}</span>
          </div>
        )}
        <div className="border-t pt-2 flex justify-between">
          <span className="font-semibold text-slate-900">Total</span>
          <span className="font-bold text-lg text-slate-900">{formatPrice(breakdown.total)}</span>
        </div>
      </div>

      {showSellerView && (
        <div className="mt-4 pt-3 border-t">
          <p className="text-sm text-slate-600">
            Seller earns:{' '}
            <span className="font-semibold text-green-600">
              {formatPrice(breakdown.fabricationCost + breakdown.materialCost + breakdown.localPickupBonus)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
