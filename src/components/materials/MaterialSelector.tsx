'use client';

import { useBuyerStore } from '@/store/useBuyerStore';
import type { MaterialCategory } from '@/types/machine';
import materialsData from '@/data/materials.json';

const groupedMaterials = materialsData.reduce<Record<string, typeof materialsData>>((acc, mat) => {
  const cat = mat.category;
  if (!acc[cat]) acc[cat] = [];
  acc[cat].push(mat);
  return acc;
}, {});

export default function MaterialSelector() {
  const { selectedMaterial, setSelectedMaterial } = useBuyerStore();

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        Material
      </label>
      <select
        value={selectedMaterial ?? ''}
        onChange={(e) =>
          setSelectedMaterial(
            e.target.value ? (e.target.value as MaterialCategory) : null
          )
        }
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
      >
        <option value="">Select a material...</option>
        {Object.entries(groupedMaterials).map(([category, materials]) => (
          <optgroup key={category} label={category}>
            {materials.map((mat) => (
              <option key={mat.id} value={mat.id}>
                {mat.name} — {mat.description}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      {selectedMaterial && (
        <p className="mt-1 text-xs text-slate-500">
          {materialsData.find((m) => m.id === selectedMaterial)?.description}
        </p>
      )}
    </div>
  );
}
