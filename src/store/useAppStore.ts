'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole, GeoLocation } from '@/types/user';

interface AppState {
  currentRole: UserRole;
  userId: string;
  userName: string;
  location: GeoLocation | null;
  isLocationLoading: boolean;

  setRole: (role: UserRole) => void;
  setLocation: (location: GeoLocation) => void;
  setLocationLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      currentRole: 'buyer',
      userId: '00000000-0000-0000-0000-000000000001',
      userName: 'Demo User',
      location: null,
      isLocationLoading: false,

      setRole: (role) => set({ currentRole: role }),
      setLocation: (location) => set({ location, isLocationLoading: false }),
      setLocationLoading: (loading) => set({ isLocationLoading: loading }),
    }),
    { name: 'builddash-app' }
  )
);
