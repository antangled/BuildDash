export type MachineType = 'FDM' | 'SLA' | 'SLS' | 'CNC' | 'Laser' | 'Plasma' | 'Waterjet' | 'EDM' | 'Wire_EDM' | 'Other';

export type MaterialCategory =
  | 'PLA' | 'PETG' | 'ABS' | 'Nylon' | 'TPU' | 'ASA' | 'PC' | 'HIPS'
  | 'Wood_PLA' | 'Carbon_Fiber' | 'Metal_Fill'
  | 'Standard_Resin' | 'Tough_Resin' | 'Flexible_Resin' | 'Castable_Resin' | 'Dental_Resin'
  | 'Nylon_SLS' | 'TPU_SLS'
  | 'Aluminum' | 'Steel' | 'Stainless_Steel' | 'Titanium' | 'Brass' | 'Copper' | 'Bronze'
  | 'Wood' | 'Acrylic' | 'Delrin' | 'HDPE' | 'MDF' | 'Plywood' | 'Polycarbonate_Sheet'
  | 'Leather' | 'Glass' | 'Fabric' | 'Paper' | 'Cardboard'
  | 'Vinyl' | 'Foam';

export interface BuildVolume {
  x: number; // mm
  y: number; // mm
  z: number; // mm
}

export interface MachineDefinition {
  id: string;
  name: string;
  manufacturer: string;
  type: MachineType;
  buildVolume: BuildVolume;
  supportedMaterials: MaterialCategory[];
  tags: string[];
  yearReleased?: number;
  msrp?: number;
}

export interface SellerMachine {
  id: string;
  sellerId: string;
  catalogMachineId: string | null; // null if custom entry
  customName?: string;
  machineType: MachineType;
  buildVolume: BuildVolume;
  availableMaterials: MaterialCategory[];
  pricePerHour: number;
  pricePerGram?: number;
  flatRate?: number;
  turnaroundDays: number;
  isAvailable: boolean;
  notes?: string;
  // Joined from catalog for display
  machineName?: string;
  machineManufacturer?: string;
}
