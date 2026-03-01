'use client';

import { useBuyerStore } from '@/store/useBuyerStore';
import { Ruler } from 'lucide-react';

export default function DimensionDisplay() {
  const stlInfo = useBuyerStore((s) => s.stlInfo);

  if (!stlInfo) return null;

  const { dimensions } = stlInfo;

  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <Ruler className="h-4 w-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-700">Part Dimensions</h3>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-md bg-red-50 p-2 text-center">
          <p className="text-xs text-red-600 font-medium">X</p>
          <p className="text-lg font-bold text-red-700">{dimensions.x.toFixed(1)}</p>
          <p className="text-xs text-red-500">mm</p>
        </div>
        <div className="rounded-md bg-green-50 p-2 text-center">
          <p className="text-xs text-green-600 font-medium">Y</p>
          <p className="text-lg font-bold text-green-700">{dimensions.y.toFixed(1)}</p>
          <p className="text-xs text-green-500">mm</p>
        </div>
        <div className="rounded-md bg-blue-50 p-2 text-center">
          <p className="text-xs text-blue-600 font-medium">Z</p>
          <p className="text-lg font-bold text-blue-700">{dimensions.z.toFixed(1)}</p>
          <p className="text-xs text-blue-500">mm</p>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-500 text-center">
        {stlInfo.triangleCount.toLocaleString()} triangles
      </p>
    </div>
  );
}
