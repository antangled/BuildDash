'use client';

import { useCallback, useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { BufferGeometry } from 'three';
import STLUploader from '@/components/stl/STLUploader';
import DimensionDisplay from '@/components/stl/DimensionDisplay';
import MachineFilters from '@/components/machines/MachineFilters';
import MachineGrid from '@/components/machines/MachineGrid';
import { useBuyerStore } from '@/store/useBuyerStore';
import { useAppStore } from '@/store/useAppStore';
import { matchMachines, type SellerWithMachine } from '@/lib/machine-matcher';
import sampleSellers from '@/data/sample-sellers.json';
import type { SellerTier, GeoLocation } from '@/types/user';
import type { SellerMachine, MaterialCategory } from '@/types/machine';

// Dynamic import to avoid SSR issues with Three.js
const STLViewer = dynamic(() => import('@/components/stl/STLViewer'), { ssr: false });

// Flatten sample sellers into SellerWithMachine entries
function getSellersWithMachines(): SellerWithMachine[] {
  const results: SellerWithMachine[] = [];
  for (const seller of sampleSellers) {
    for (const machine of seller.machines) {
      results.push({
        machine: machine as unknown as SellerMachine,
        sellerName: seller.name,
        sellerRating: seller.rating,
        sellerTier: seller.tier as SellerTier,
        sellerLocation: seller.location as GeoLocation,
      });
    }
  }
  return results;
}

export default function BuyerPage() {
  const [geometry, setGeometry] = useState<BufferGeometry | null>(null);

  const {
    stlInfo,
    selectedMaterial,
    maxDistanceMiles,
    sortBy,
    selectedMachineTypes,
    setMatchResults,
    setIsSearching,
  } = useBuyerStore();

  const location = useAppStore((s) => s.location);

  const sellersWithMachines = useMemo(() => getSellersWithMachines(), []);

  // Run matching whenever filters change
  useEffect(() => {
    setIsSearching(true);
    const timeout = setTimeout(() => {
      let sellers = sellersWithMachines;

      // Filter by machine type if any selected
      if (selectedMachineTypes.length > 0) {
        sellers = sellers.filter((s) =>
          selectedMachineTypes.includes(s.machine.machineType)
        );
      }

      const results = matchMachines({
        stlDimensions: stlInfo?.dimensions ?? null,
        selectedMaterial: selectedMaterial as MaterialCategory | null,
        buyerLocation: location,
        sellers,
        maxDistanceMiles,
        sortBy,
      });
      setMatchResults(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [
    stlInfo,
    selectedMaterial,
    location,
    maxDistanceMiles,
    sortBy,
    selectedMachineTypes,
    sellersWithMachines,
    setMatchResults,
    setIsSearching,
  ]);

  const handleGeometryLoaded = useCallback((geo: BufferGeometry) => {
    setGeometry(geo);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Get Parts Made</h1>
        <p className="mt-1 text-sm text-slate-600">
          Upload your STL file, select a material, and find nearby makers with compatible equipment.
        </p>
      </div>

      {/* Upload Section */}
      <div className="mb-8">
        <STLUploader onGeometryLoaded={handleGeometryLoaded} />
      </div>

      {/* STL Preview + Dimensions */}
      {stlInfo && (
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <STLViewer geometry={geometry} className="h-[300px] md:h-[400px]" />
          </div>
          <div>
            <DimensionDisplay />
          </div>
        </div>
      )}

      {/* Filters + Results */}
      <div className="grid gap-6 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <div className="sticky top-20 rounded-lg border bg-white p-4">
            <MachineFilters />
          </div>
        </aside>
        <div className="lg:col-span-3">
          <MachineGrid />
        </div>
      </div>
    </div>
  );
}
