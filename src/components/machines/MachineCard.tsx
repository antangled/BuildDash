'use client';

import { Star, MapPin, Clock, Check, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { MatchResult } from '@/lib/machine-matcher';
import { formatDistance } from '@/lib/distance';
import { formatPrice } from '@/lib/pricing';
import { volumeFitPercentage } from '@/lib/machine-matcher';
import { useBuyerStore } from '@/store/useBuyerStore';

const TYPE_COLORS: Record<string, string> = {
  FDM: 'bg-blue-100 text-blue-700',
  SLA: 'bg-purple-100 text-purple-700',
  SLS: 'bg-violet-100 text-violet-700',
  CNC: 'bg-green-100 text-green-700',
  Laser: 'bg-red-100 text-red-700',
  Plasma: 'bg-orange-100 text-orange-700',
  Waterjet: 'bg-cyan-100 text-cyan-700',
  EDM: 'bg-yellow-100 text-yellow-700',
  Wire_EDM: 'bg-amber-100 text-amber-700',
  Other: 'bg-slate-100 text-slate-700',
};

interface MachineCardProps {
  result: MatchResult;
  onRequestQuote?: (result: MatchResult) => void;
}

export default function MachineCard({ result, onRequestQuote }: MachineCardProps) {
  const { machine, sellerName, sellerRating, distanceMiles, estimatedPrice, turnaroundDays } = result;
  const stlInfo = useBuyerStore((s) => s.stlInfo);

  const fitPct = stlInfo
    ? volumeFitPercentage(stlInfo.dimensions, machine.buildVolume)
    : 0;
  const isTightFit = fitPct > 0.85;

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-slate-900">
            {machine.machineName || machine.customName || 'Custom Machine'}
          </h3>
          <p className="text-sm text-slate-500">
            {machine.machineManufacturer && `${machine.machineManufacturer} · `}
            {sellerName}
          </p>
        </div>
        <Badge className={TYPE_COLORS[machine.machineType] || TYPE_COLORS.Other}>
          {machine.machineType}
        </Badge>
      </div>

      {/* Rating & Distance */}
      <div className="flex items-center gap-4 mb-3 text-sm">
        <div className="flex items-center gap-1 text-amber-500">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span className="font-medium">{sellerRating.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-500">
          <MapPin className="h-3.5 w-3.5" />
          <span>{formatDistance(distanceMiles)}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-500">
          <Clock className="h-3.5 w-3.5" />
          <span>{turnaroundDays}d turnaround</span>
        </div>
      </div>

      {/* Build Volume */}
      <div className="mb-3 rounded bg-slate-50 p-2 text-xs text-slate-600">
        <span className="font-medium">Build volume:</span>{' '}
        {machine.buildVolume.x} × {machine.buildVolume.y} × {machine.buildVolume.z} mm
        {stlInfo && (
          <span className="ml-2">
            {isTightFit ? (
              <span className="text-amber-600 inline-flex items-center gap-0.5">
                <AlertTriangle className="h-3 w-3" /> Tight fit
              </span>
            ) : (
              <span className="text-green-600 inline-flex items-center gap-0.5">
                <Check className="h-3 w-3" /> Fits
              </span>
            )}
          </span>
        )}
      </div>

      {/* Materials */}
      <div className="flex flex-wrap gap-1 mb-4">
        {machine.availableMaterials.slice(0, 5).map((mat) => (
          <Badge key={mat} variant="outline" className="text-xs">
            {mat.replace(/_/g, ' ')}
          </Badge>
        ))}
        {machine.availableMaterials.length > 5 && (
          <Badge variant="outline" className="text-xs text-slate-400">
            +{machine.availableMaterials.length - 5}
          </Badge>
        )}
      </div>

      {/* Price & Action */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xl font-bold text-slate-900">{formatPrice(estimatedPrice)}</p>
          <p className="text-xs text-slate-500">estimated total</p>
        </div>
        <Button
          size="sm"
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => onRequestQuote?.(result)}
        >
          Request Quote
        </Button>
      </div>
    </div>
  );
}
