'use client';

import { create } from 'zustand';
import type { STLFileInfo } from '@/types/stl';
import type { MaterialCategory } from '@/types/machine';
import type { Order } from '@/types/order';
import type { MatchResult } from '@/lib/machine-matcher';

interface BuyerState {
  // STL state
  stlFile: File | null;
  stlInfo: STLFileInfo | null;
  // geometry stored separately (not serializable)

  // Filter state
  selectedMaterial: MaterialCategory | null;
  maxDistanceMiles: number;
  sortBy: 'distance' | 'price' | 'rating';
  selectedMachineTypes: string[];

  // Results
  matchResults: MatchResult[];
  isSearching: boolean;

  // Orders
  orders: Order[];

  // Actions
  setSTLFile: (file: File | null) => void;
  setSTLInfo: (info: STLFileInfo | null) => void;
  setSelectedMaterial: (material: MaterialCategory | null) => void;
  setMaxDistance: (miles: number) => void;
  setSortBy: (sort: 'distance' | 'price' | 'rating') => void;
  setSelectedMachineTypes: (types: string[]) => void;
  setMatchResults: (results: MatchResult[]) => void;
  setIsSearching: (searching: boolean) => void;
  addOrder: (order: Order) => void;
  clearSearch: () => void;
}

export const useBuyerStore = create<BuyerState>()((set) => ({
  stlFile: null,
  stlInfo: null,

  selectedMaterial: null,
  maxDistanceMiles: 100,
  sortBy: 'distance',
  selectedMachineTypes: [],

  matchResults: [],
  isSearching: false,

  orders: [],

  setSTLFile: (file) => set({ stlFile: file }),
  setSTLInfo: (info) => set({ stlInfo: info }),
  setSelectedMaterial: (material) => set({ selectedMaterial: material }),
  setMaxDistance: (miles) => set({ maxDistanceMiles: miles }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setSelectedMachineTypes: (types) => set({ selectedMachineTypes: types }),
  setMatchResults: (results) => set({ matchResults: results }),
  setIsSearching: (searching) => set({ isSearching: searching }),
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
  clearSearch: () =>
    set({
      stlFile: null,
      stlInfo: null,
      selectedMaterial: null,
      matchResults: [],
      isSearching: false,
    }),
}));
