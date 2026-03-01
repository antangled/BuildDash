'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import type { SellerMachine } from '@/types/machine';
import type { Order, OrderStatus } from '@/types/order';

interface SellerState {
  machines: SellerMachine[];
  incomingOrders: Order[];
  activeOrders: Order[];
  completedOrders: Order[];
  totalEarnings: number;
  isOnline: boolean;
  isLoading: boolean;

  addMachine: (machine: SellerMachine) => Promise<void>;
  removeMachine: (machineId: string) => Promise<void>;
  updateMachineAvailability: (machineId: string, available: boolean) => Promise<void>;
  loadMachines: (sellerId: string) => Promise<void>;
  acceptOrder: (orderId: string) => void;
  rejectOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  toggleOnline: () => void;
}

export const useSellerStore = create<SellerState>()(
  persist(
    (set) => ({
      machines: [],
      incomingOrders: [],
      activeOrders: [],
      completedOrders: [],
      totalEarnings: 0,
      isOnline: true,
      isLoading: false,

      loadMachines: async (sellerId: string) => {
        set({ isLoading: true });
        const { data, error } = await supabase
          .from('seller_machines')
          .select('*')
          .eq('seller_id', sellerId);

        if (error) {
          console.error('Failed to load machines:', error);
          set({ isLoading: false });
          return;
        }

        const machines: SellerMachine[] = (data || []).map((row) => ({
          id: row.id,
          sellerId: row.seller_id,
          catalogMachineId: row.catalog_machine_id,
          machineName: row.machine_name,
          machineManufacturer: row.manufacturer,
          machineType: row.machine_type as SellerMachine['machineType'],
          buildVolume: row.build_volume || { x: 0, y: 0, z: 0 },
          availableMaterials: (row.materials || []) as SellerMachine['availableMaterials'],
          pricePerHour: row.price_per_hour,
          turnaroundDays: row.turnaround_days,
          isAvailable: row.is_available,
          notes: row.notes || undefined,
        }));

        set({ machines, isLoading: false });
      },

      addMachine: async (machine) => {
        // Insert into Supabase
        const { error } = await supabase.from('seller_machines').insert({
          id: machine.id,
          seller_id: machine.sellerId,
          catalog_machine_id: machine.catalogMachineId,
          machine_name: machine.machineName || machine.customName || 'Custom Machine',
          machine_type: machine.machineType,
          manufacturer: machine.machineManufacturer || 'Custom',
          build_volume: machine.buildVolume,
          materials: machine.availableMaterials,
          price_per_hour: machine.pricePerHour,
          min_price: 5,
          turnaround_days: machine.turnaroundDays,
          is_available: true,
          notes: machine.notes || null,
        });

        if (error) {
          console.error('Failed to add machine to Supabase:', error);
        }

        // Also update local state immediately
        set((state) => ({ machines: [...state.machines, machine] }));
      },

      removeMachine: async (machineId) => {
        const { error } = await supabase
          .from('seller_machines')
          .delete()
          .eq('id', machineId);

        if (error) {
          console.error('Failed to remove machine from Supabase:', error);
        }

        set((state) => ({
          machines: state.machines.filter((m) => m.id !== machineId),
        }));
      },

      updateMachineAvailability: async (machineId, available) => {
        const { error } = await supabase
          .from('seller_machines')
          .update({ is_available: available })
          .eq('id', machineId);

        if (error) {
          console.error('Failed to update availability:', error);
        }

        set((state) => ({
          machines: state.machines.map((m) =>
            m.id === machineId ? { ...m, isAvailable: available } : m
          ),
        }));
      },

      acceptOrder: (orderId) =>
        set((state) => {
          const order = state.incomingOrders.find((o) => o.id === orderId);
          if (!order) return state;
          return {
            incomingOrders: state.incomingOrders.filter((o) => o.id !== orderId),
            activeOrders: [...state.activeOrders, { ...order, status: 'accepted' as OrderStatus }],
          };
        }),

      rejectOrder: (orderId) =>
        set((state) => ({
          incomingOrders: state.incomingOrders.filter((o) => o.id !== orderId),
        })),

      updateOrderStatus: (orderId, status) =>
        set((state) => {
          if (status === 'completed' || status === 'delivered') {
            const order = state.activeOrders.find((o) => o.id === orderId);
            if (!order) return state;
            return {
              activeOrders: state.activeOrders.filter((o) => o.id !== orderId),
              completedOrders: [...state.completedOrders, { ...order, status }],
              totalEarnings: state.totalEarnings + order.priceBreakdown.fabricationCost + order.priceBreakdown.materialCost,
            };
          }
          return {
            activeOrders: state.activeOrders.map((o) =>
              o.id === orderId ? { ...o, status } : o
            ),
          };
        }),

      toggleOnline: () => set((state) => ({ isOnline: !state.isOnline })),
    }),
    { name: 'builddash-seller' }
  )
);
