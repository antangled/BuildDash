'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Plus, Cpu, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSellerStore } from '@/store/useSellerStore';
import { useAppStore } from '@/store/useAppStore';
import EarningsDashboard from '@/components/seller/EarningsDashboard';
import IncomingOrders from '@/components/seller/IncomingOrders';
import AvailabilityToggle from '@/components/seller/AvailabilityToggle';

export default function SellerPage() {
  const { machines, updateMachineAvailability, loadMachines, isLoading } = useSellerStore();
  const userId = useAppStore((s) => s.userId);

  useEffect(() => {
    loadMachines(userId);
  }, [userId, loadMachines]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Seller Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage your machines, accept orders, and track earnings.
          </p>
        </div>
        <AvailabilityToggle />
      </div>

      {/* Earnings */}
      <div className="mb-8">
        <EarningsDashboard />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* My Machines */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">My Machines</h2>
            <Link href="/seller/add-machine">
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 gap-1.5">
                <Plus className="h-4 w-4" />
                Add Machine
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="rounded-lg border bg-white p-8 text-center">
              <Loader2 className="mx-auto h-10 w-10 text-slate-300 mb-3 animate-spin" />
              <p className="font-medium text-slate-600">Loading machines...</p>
            </div>
          ) : machines.length === 0 ? (
            <div className="rounded-lg border bg-white p-8 text-center">
              <Cpu className="mx-auto h-10 w-10 text-slate-300 mb-3" />
              <p className="font-medium text-slate-600">No machines listed yet</p>
              <p className="text-sm text-slate-400 mt-1 mb-4">
                Add your first machine to start receiving orders.
              </p>
              <Link href="/seller/add-machine">
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                  Add Your First Machine
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {machines.map((machine) => (
                <div key={machine.id} className="rounded-lg border bg-white p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-slate-900">
                        {machine.machineName || machine.customName || 'Custom Machine'}
                      </p>
                      <p className="text-sm text-slate-500">
                        {machine.machineManufacturer && `${machine.machineManufacturer} · `}
                        {machine.machineType}
                      </p>
                    </div>
                    <button
                      onClick={() => updateMachineAvailability(machine.id, !machine.isAvailable)}
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        machine.isAvailable
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {machine.isAvailable ? 'Available' : 'Unavailable'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">
                    {machine.buildVolume.x} × {machine.buildVolume.y} × {machine.buildVolume.z} mm
                    {' · '}${machine.pricePerHour}/hr
                    {' · '}{machine.turnaroundDays}d turnaround
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {machine.availableMaterials.slice(0, 4).map((mat) => (
                      <Badge key={mat} variant="outline" className="text-xs">
                        {mat.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                    {machine.availableMaterials.length > 4 && (
                      <Badge variant="outline" className="text-xs text-slate-400">
                        +{machine.availableMaterials.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Orders</h2>
          <IncomingOrders />
        </div>
      </div>
    </div>
  );
}
