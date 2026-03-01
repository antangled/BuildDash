'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Wrench, ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const { currentRole, setRole } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500 text-white font-bold text-lg">
            B
          </div>
          <span className="text-xl font-bold text-slate-900">BuildDash</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/buyer"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              currentRole === 'buyer' ? 'text-orange-600' : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => setRole('buyer')}
          >
            <ShoppingCart className="h-4 w-4" />
            Get Parts
          </Link>
          <Link
            href="/seller"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              currentRole === 'seller' ? 'text-orange-600' : 'text-slate-600 hover:text-slate-900'
            }`}
            onClick={() => setRole('seller')}
          >
            <Wrench className="h-4 w-4" />
            Make Parts
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center rounded-full bg-slate-100 p-1">
            <button
              onClick={() => { setRole('buyer'); router.push('/buyer'); }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                currentRole === 'buyer'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Buyer
            </button>
            <button
              onClick={() => { setRole('seller'); router.push('/seller'); }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                currentRole === 'seller'
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Seller
            </button>
          </div>
          <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
            Sign In
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-slate-600"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          <Link
            href="/buyer"
            className="flex items-center gap-2 text-sm font-medium text-slate-700"
            onClick={() => { setRole('buyer'); setMobileOpen(false); }}
          >
            <ShoppingCart className="h-4 w-4" />
            Get Parts
          </Link>
          <Link
            href="/seller"
            className="flex items-center gap-2 text-sm font-medium text-slate-700"
            onClick={() => { setRole('seller'); setMobileOpen(false); }}
          >
            <Wrench className="h-4 w-4" />
            Make Parts
          </Link>
          <div className="pt-2">
            <Button size="sm" className="w-full bg-orange-500 hover:bg-orange-600">
              Sign In
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
