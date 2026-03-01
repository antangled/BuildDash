'use client';

import { useBuyerStore } from '@/store/useBuyerStore';
import MaterialSelector from '@/components/materials/MaterialSelector';
import DistanceFilter from '@/components/location/DistanceFilter';
import LocationInput from '@/components/location/LocationInput';
import { Button } from '@/components/ui/button';
import { Filter, RotateCcw } from 'lucide-react';
import type { MachineType } from '@/types/machine';

const MACHINE_TYPES: { value: MachineType; label: string }[] = [
  { value: 'FDM', label: 'FDM' },
  { value: 'SLA', label: 'SLA/Resin' },
  { value: 'SLS', label: 'SLS' },
  { value: 'CNC', label: 'CNC' },
  { value: 'Laser', label: 'Laser' },
  { value: 'Plasma', label: 'Plasma' },
  { value: 'Waterjet', label: 'Waterjet' },
  { value: 'EDM', label: 'EDM' },
  { value: 'Other', label: 'Other' },
];

export default function MachineFilters() {
  const {
    sortBy,
    setSortBy,
    selectedMachineTypes,
    setSelectedMachineTypes,
    clearSearch,
  } = useBuyerStore();

  const toggleType = (type: string) => {
    if (selectedMachineTypes.includes(type)) {
      setSelectedMachineTypes(selectedMachineTypes.filter((t) => t !== type));
    } else {
      setSelectedMachineTypes([...selectedMachineTypes, type]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-slate-500" />
        <h3 className="font-semibold text-slate-800">Filters</h3>
      </div>

      <MaterialSelector />
      <LocationInput />
      <DistanceFilter />

      {/* Machine Type Filter */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Machine Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {MACHINE_TYPES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => toggleType(value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedMachineTypes.includes(value)
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'distance' | 'price' | 'rating')}
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="distance">Nearest First</option>
          <option value="price">Lowest Price</option>
          <option value="rating">Highest Rated</option>
        </select>
      </div>

      <Button variant="ghost" size="sm" onClick={clearSearch} className="w-full gap-1.5">
        <RotateCcw className="h-3.5 w-3.5" />
        Clear All
      </Button>
    </div>
  );
}
