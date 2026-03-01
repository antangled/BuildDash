'use client';

import { useSellerStore } from '@/store/useSellerStore';
import { DollarSign, Package, Star, TrendingUp } from 'lucide-react';
import { formatPrice } from '@/lib/pricing';

export default function EarningsDashboard() {
  const { totalEarnings, completedOrders, machines } = useSellerStore();
  const avgRating = 4.7; // Demo

  const stats = [
    {
      label: 'Total Earnings',
      value: formatPrice(totalEarnings),
      icon: DollarSign,
      color: 'text-green-600 bg-green-50',
    },
    {
      label: 'Orders Completed',
      value: String(completedOrders.length),
      icon: Package,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Active Machines',
      value: String(machines.filter((m) => m.isAvailable).length),
      icon: TrendingUp,
      color: 'text-orange-600 bg-orange-50',
    },
    {
      label: 'Avg Rating',
      value: avgRating.toFixed(1),
      icon: Star,
      color: 'text-amber-600 bg-amber-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border bg-white p-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
