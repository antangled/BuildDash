'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import AddMachineForm from '@/components/machines/AddMachineForm';

export default function AddMachinePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/seller"
        className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mb-2">Add a Machine</h1>
      <p className="text-sm text-slate-600 mb-8">
        Search our database of 300+ machines for auto-fill, or enter your machine specs manually.
      </p>

      <AddMachineForm />
    </div>
  );
}
