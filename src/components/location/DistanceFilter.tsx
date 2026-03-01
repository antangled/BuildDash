'use client';

import { useBuyerStore } from '@/store/useBuyerStore';
import { Slider } from '@/components/ui/slider';

export default function DistanceFilter() {
  const { maxDistanceMiles, setMaxDistance } = useBuyerStore();

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-slate-700">Max Distance</label>
        <span className="text-sm font-medium text-orange-600">{maxDistanceMiles} mi</span>
      </div>
      <Slider
        value={[maxDistanceMiles]}
        onValueChange={([val]) => setMaxDistance(val)}
        min={5}
        max={500}
        step={5}
        className="w-full"
      />
      <div className="flex justify-between mt-1 text-xs text-slate-400">
        <span>5 mi</span>
        <span>500 mi</span>
      </div>
    </div>
  );
}
