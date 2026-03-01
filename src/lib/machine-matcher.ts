import type { STLDimensions } from '@/types/stl';
import type { SellerMachine, MaterialCategory, BuildVolume } from '@/types/machine';
import type { GeoLocation } from '@/types/user';
import type { SellerTier } from '@/types/user';
import { calculateDistanceMiles } from './distance';
import { estimatePartCost, calculatePriceBreakdown } from './pricing';

export interface MatchResult {
  machine: SellerMachine;
  sellerName: string;
  sellerRating: number;
  sellerTier: SellerTier;
  sellerLocation: GeoLocation;
  distanceMiles: number;
  fitsVolume: boolean;
  materialMatch: boolean;
  estimatedPrice: number;
  turnaroundDays: number;
}

export function fitsInBuildVolume(
  stl: STLDimensions,
  buildVolume: BuildVolume
): boolean {
  // Sort both dimension sets ascending, then compare element-by-element.
  // This checks if the part fits in any rotation/orientation.
  const dims = [stl.x, stl.y, stl.z].sort((a, b) => a - b);
  const vol = [buildVolume.x, buildVolume.y, buildVolume.z].sort((a, b) => a - b);
  return dims[0] <= vol[0] && dims[1] <= vol[1] && dims[2] <= vol[2];
}

export function volumeFitPercentage(
  stl: STLDimensions,
  buildVolume: BuildVolume
): number {
  const dims = [stl.x, stl.y, stl.z].sort((a, b) => a - b);
  const vol = [buildVolume.x, buildVolume.y, buildVolume.z].sort((a, b) => a - b);
  // How much of the build volume the part uses (average across axes)
  const percentages = dims.map((d, i) => (vol[i] > 0 ? d / vol[i] : 1));
  return Math.max(...percentages);
}

export interface SellerWithMachine {
  machine: SellerMachine;
  sellerName: string;
  sellerRating: number;
  sellerTier: SellerTier;
  sellerLocation: GeoLocation;
}

export function matchMachines(params: {
  stlDimensions: STLDimensions | null;
  selectedMaterial: MaterialCategory | null;
  buyerLocation: GeoLocation | null;
  sellers: SellerWithMachine[];
  maxDistanceMiles: number;
  sortBy: 'distance' | 'price' | 'rating';
}): MatchResult[] {
  const {
    stlDimensions,
    selectedMaterial,
    buyerLocation,
    sellers,
    maxDistanceMiles,
    sortBy,
  } = params;

  let results: MatchResult[] = sellers
    .map((seller) => {
      const { machine, sellerName, sellerRating, sellerTier, sellerLocation } = seller;

      // Material filter
      const materialMatch = selectedMaterial
        ? machine.availableMaterials.includes(selectedMaterial)
        : true;

      // Volume filter
      const fitsVolume = stlDimensions
        ? fitsInBuildVolume(stlDimensions, machine.buildVolume)
        : true;

      // Distance calculation
      let distanceMiles = 0;
      if (buyerLocation && sellerLocation) {
        distanceMiles = calculateDistanceMiles(buyerLocation, sellerLocation);
      }

      // Estimate price
      let estimatedPrice = machine.flatRate ?? 0;
      if (!machine.flatRate && stlDimensions) {
        const volumeCm3 =
          (stlDimensions.x * stlDimensions.y * stlDimensions.z) / 1000000 * 0.3; // ~30% infill
        const { fabricationCost, materialCost } = estimatePartCost({
          volumeCm3: Math.max(volumeCm3, 0.1),
          materialCostPerGram: machine.pricePerGram ?? 0.04,
          pricePerHour: machine.pricePerHour,
        });
        const breakdown = calculatePriceBreakdown({
          fabricationCost,
          materialCost,
          sellerTier,
          deliveryMethod: 'shipping',
          distanceMiles,
          hasBuildPass: false,
        });
        estimatedPrice = breakdown.total;
      }

      return {
        machine,
        sellerName,
        sellerRating,
        sellerTier,
        sellerLocation,
        distanceMiles,
        fitsVolume,
        materialMatch,
        estimatedPrice,
        turnaroundDays: machine.turnaroundDays,
      };
    })
    .filter((r) => r.materialMatch && r.fitsVolume && r.machine.isAvailable)
    .filter((r) => {
      if (!buyerLocation) return true;
      return r.distanceMiles <= maxDistanceMiles;
    });

  // Sort
  switch (sortBy) {
    case 'distance':
      results.sort((a, b) => a.distanceMiles - b.distanceMiles);
      break;
    case 'price':
      results.sort((a, b) => a.estimatedPrice - b.estimatedPrice);
      break;
    case 'rating':
      results.sort((a, b) => b.sellerRating - a.sellerRating);
      break;
  }

  return results;
}
