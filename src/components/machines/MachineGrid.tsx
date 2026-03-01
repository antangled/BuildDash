'use client';

import { useBuyerStore } from '@/store/useBuyerStore';
import MachineCard from './MachineCard';
import type { MatchResult } from '@/lib/machine-matcher';
import { Search, Loader2 } from 'lucide-react';

interface MachineGridProps {
  onRequestQuote?: (result: MatchResult) => void;
}

export default function MachineGrid({ onRequestQuote }: MachineGridProps) {
  const { matchResults, isSearching, stlInfo } = useBuyerStore();

  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-3" />
        <p className="text-sm">Finding compatible machines...</p>
      </div>
    );
  }

  if (!stlInfo) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <Search className="h-10 w-10 mb-3" />
        <p className="font-medium">Upload an STL file to get started</p>
        <p className="text-sm mt-1">We&apos;ll match you with compatible machines nearby</p>
      </div>
    );
  }

  if (matchResults.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <Search className="h-10 w-10 mb-3" />
        <p className="font-medium">No matching machines found</p>
        <p className="text-sm mt-1">Try increasing the distance or changing the material</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-slate-900">{matchResults.length}</span> machines available
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {matchResults.map((result) => (
          <MachineCard
            key={result.machine.id}
            result={result}
            onRequestQuote={onRequestQuote}
          />
        ))}
      </div>
    </div>
  );
}
