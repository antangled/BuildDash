'use client';

import { useSellerStore } from '@/store/useSellerStore';

export default function AvailabilityToggle() {
  const { isOnline, toggleOnline } = useSellerStore();

  return (
    <button
      onClick={toggleOnline}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        isOnline
          ? 'bg-green-100 text-green-800 hover:bg-green-200'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          isOnline ? 'bg-green-500' : 'bg-slate-400'
        }`}
      />
      {isOnline ? 'Online' : 'Offline'}
    </button>
  );
}
