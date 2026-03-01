'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MachineSearch from './MachineSearch';
import { useSellerStore } from '@/store/useSellerStore';
import { useAppStore } from '@/store/useAppStore';
import type { MachineDefinition, MachineType, MaterialCategory, SellerMachine } from '@/types/machine';
import materialsData from '@/data/materials.json';

// We'll load the machine catalog from a static import for the MVP
// In production this would query Supabase
import machinesCatalog from '@/data/machines-catalog.json';

const MACHINE_TYPES: MachineType[] = ['FDM', 'SLA', 'SLS', 'CNC', 'Laser', 'Plasma', 'Waterjet', 'EDM', 'Other'];

export default function AddMachineForm() {
  const router = useRouter();
  const addMachine = useSellerStore((s) => s.addMachine);
  const userId = useAppStore((s) => s.userId);

  const [selectedCatalog, setSelectedCatalog] = useState<MachineDefinition | null>(null);
  const [isManual, setIsManual] = useState(false);

  // Form state
  const [customName, setCustomName] = useState('');
  const [machineType, setMachineType] = useState<MachineType>('FDM');
  const [buildX, setBuildX] = useState('');
  const [buildY, setBuildY] = useState('');
  const [buildZ, setBuildZ] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState<MaterialCategory[]>([]);
  const [pricePerHour, setPricePerHour] = useState('');
  const [pricePerGram, setPricePerGram] = useState('');
  const [turnaroundDays, setTurnaroundDays] = useState('2');

  const handleCatalogSelect = useCallback((machine: MachineDefinition) => {
    setSelectedCatalog(machine);
    setIsManual(false);
    setMachineType(machine.type);
    setBuildX(String(machine.buildVolume.x));
    setBuildY(String(machine.buildVolume.y));
    setBuildZ(String(machine.buildVolume.z));
    setSelectedMaterials(machine.supportedMaterials as MaterialCategory[]);
  }, []);

  const toggleMaterial = (mat: MaterialCategory) => {
    if (selectedMaterials.includes(mat)) {
      setSelectedMaterials(selectedMaterials.filter((m) => m !== mat));
    } else {
      setSelectedMaterials([...selectedMaterials, mat]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const machine: SellerMachine = {
      id: uuidv4(),
      sellerId: userId,
      catalogMachineId: selectedCatalog?.id ?? null,
      customName: customName || undefined,
      machineType,
      machineName: selectedCatalog?.name,
      machineManufacturer: selectedCatalog?.manufacturer,
      buildVolume: {
        x: parseFloat(buildX) || 0,
        y: parseFloat(buildY) || 0,
        z: parseFloat(buildZ) || 0,
      },
      availableMaterials: selectedMaterials,
      pricePerHour: parseFloat(pricePerHour) || 0,
      pricePerGram: parseFloat(pricePerGram) || undefined,
      turnaroundDays: parseInt(turnaroundDays) || 2,
      isAvailable: true,
    };

    await addMachine(machine);
    router.push('/seller');
  };

  // Get materials compatible with the selected machine type
  const compatibleMaterials = materialsData.filter((m) =>
    m.compatibleTypes.includes(machineType)
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Step 1: Search or Manual */}
      <div>
        <Label className="text-base font-semibold">Find Your Machine</Label>
        <p className="text-sm text-slate-500 mb-3">
          Search our database of 300+ machines for auto-fill, or enter specs manually.
        </p>
        <MachineSearch
          machines={machinesCatalog as MachineDefinition[]}
          onSelect={handleCatalogSelect}
        />
        <button
          type="button"
          onClick={() => { setIsManual(true); setSelectedCatalog(null); }}
          className="mt-2 text-sm text-orange-600 hover:text-orange-700"
        >
          My machine isn&apos;t listed — enter manually
        </button>
      </div>

      {/* Show form once a machine is selected or manual mode */}
      {(selectedCatalog || isManual) && (
        <>
          {/* Machine info banner */}
          {selectedCatalog && (
            <div className="rounded-lg bg-blue-50 p-3 text-sm">
              <p className="font-medium text-blue-900">
                {selectedCatalog.manufacturer} {selectedCatalog.name}
              </p>
              <p className="text-blue-700">
                Specs auto-filled. Adjust below if needed.
              </p>
            </div>
          )}

          {/* Custom name */}
          <div>
            <Label htmlFor="customName">Nickname (optional)</Label>
            <Input
              id="customName"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. My Workshop Printer"
              className="mt-1"
            />
          </div>

          {/* Machine Type */}
          <div>
            <Label>Machine Type</Label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {MACHINE_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMachineType(type)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    machineType === type
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Build Volume */}
          <div>
            <Label>Build Volume (mm)</Label>
            <div className="grid grid-cols-3 gap-3 mt-1">
              <div>
                <span className="text-xs text-slate-500">X (width)</span>
                <Input value={buildX} onChange={(e) => setBuildX(e.target.value)} type="number" />
              </div>
              <div>
                <span className="text-xs text-slate-500">Y (depth)</span>
                <Input value={buildY} onChange={(e) => setBuildY(e.target.value)} type="number" />
              </div>
              <div>
                <span className="text-xs text-slate-500">Z (height)</span>
                <Input value={buildZ} onChange={(e) => setBuildZ(e.target.value)} type="number" />
              </div>
            </div>
          </div>

          {/* Materials */}
          <div>
            <Label>Available Materials</Label>
            <p className="text-xs text-slate-500 mb-2">Select materials you have in stock</p>
            <div className="flex flex-wrap gap-1.5">
              {compatibleMaterials.map((mat) => (
                <button
                  key={mat.id}
                  type="button"
                  onClick={() => toggleMaterial(mat.id as MaterialCategory)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    selectedMaterials.includes(mat.id as MaterialCategory)
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {mat.name}
                </button>
              ))}
            </div>
            {selectedMaterials.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {selectedMaterials.map((mat) => (
                  <Badge key={mat} variant="secondary" className="text-xs">
                    {mat.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Pricing */}
          <div>
            <Label className="text-base font-semibold">Pricing</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <Label htmlFor="pricePerHour">Price per hour ($)</Label>
                <Input
                  id="pricePerHour"
                  value={pricePerHour}
                  onChange={(e) => setPricePerHour(e.target.value)}
                  type="number"
                  step="0.50"
                  placeholder="8.00"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="pricePerGram">Price per gram ($)</Label>
                <Input
                  id="pricePerGram"
                  value={pricePerGram}
                  onChange={(e) => setPricePerGram(e.target.value)}
                  type="number"
                  step="0.01"
                  placeholder="0.05"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Turnaround */}
          <div>
            <Label htmlFor="turnaround">Typical Turnaround (days)</Label>
            <Input
              id="turnaround"
              value={turnaroundDays}
              onChange={(e) => setTurnaroundDays(e.target.value)}
              type="number"
              min="1"
              max="30"
              className="mt-1 w-24"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
              Add Machine
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/seller')}>
              Cancel
            </Button>
          </div>
        </>
      )}
    </form>
  );
}
