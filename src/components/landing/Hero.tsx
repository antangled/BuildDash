'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart, Wrench } from 'lucide-react';

const GALLERY_MACHINES = [
  { name: 'Ender 3 V3', brand: 'Creality', type: 'FDM' },
  { name: 'Prusa MK4S', brand: 'Prusa', type: 'FDM' },
  { name: 'Form 3+', brand: 'Formlabs', type: 'SLA' },
  { name: 'Bambu Lab X1C', brand: 'Bambu Lab', type: 'FDM' },
  { name: 'Glowforge Pro', brand: 'Glowforge', type: 'Laser' },
  { name: 'Shapeoko 5 Pro', brand: 'Carbide 3D', type: 'CNC' },
  { name: 'CrossFire PRO', brand: 'Langmuir', type: 'Plasma' },
  { name: 'WAZER Desktop', brand: 'WAZER', type: 'Waterjet' },
  { name: 'Elegoo Saturn 3', brand: 'Elegoo', type: 'SLA' },
  { name: 'Nomad 3', brand: 'Carbide 3D', type: 'CNC' },
  { name: 'Snapmaker Artisan', brand: 'Snapmaker', type: 'FDM' },
  { name: 'xTool P2', brand: 'xTool', type: 'Laser' },
  { name: 'Metal X', brand: 'Markforged', type: 'Metal' },
  { name: 'Form 3L', brand: 'Formlabs', type: 'SLA' },
  { name: 'Onyx Pro', brand: 'Markforged', type: 'FDM' },
  { name: 'Raise3D Pro3', brand: 'Raise3D', type: 'FDM' },
];

const TYPE_COLORS: Record<string, string> = {
  FDM: 'bg-blue-100 text-blue-700',
  SLA: 'bg-violet-100 text-violet-700',
  CNC: 'bg-green-100 text-green-700',
  Laser: 'bg-red-100 text-red-700',
  Plasma: 'bg-amber-100 text-amber-700',
  Waterjet: 'bg-cyan-100 text-cyan-700',
  Metal: 'bg-slate-200 text-slate-700',
};

const TYPE_EMOJI: Record<string, string> = {
  FDM: '\uD83D\uDDA8\uFE0F',
  SLA: '\uD83D\uDC8E',
  CNC: '\u2699\uFE0F',
  Laser: '\uD83D\uDD34',
  Plasma: '\u26A1',
  Waterjet: '\uD83D\uDCA7',
  Metal: '\uD83D\uDD29',
};

export default function Hero() {
  // Double the list for seamless looping
  const galleryItems = [...GALLERY_MACHINES, ...GALLERY_MACHINES];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      {/* Animated diagonal-scrolling plus pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute animate-drift"
          style={{
            width: '200%',
            height: '200%',
            top: '-50%',
            left: '-50%',
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-1.5 text-sm font-medium text-orange-700 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500"></span>
            </span>
            Now connecting makers across the US
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Your parts,{' '}
            <span className="text-orange-500">made locally.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Upload your STL file, pick a material, and get matched with nearby makers
            who have the right equipment. 3D printers, CNC machines, laser cutters — all in your neighborhood.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/buyer">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-base px-8 h-12 gap-2">
                <ShoppingCart className="h-5 w-5" />
                Get Parts Made
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/seller">
              <Button size="lg" variant="outline" className="text-base px-8 h-12 gap-2 border-slate-300">
                <Wrench className="h-5 w-5" />
                Start Making Parts
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Continuously scrolling machine gallery */}
      <div className="relative pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
          <p className="text-center text-xs font-medium uppercase tracking-wider text-slate-400">
            Supporting 330+ machines from top manufacturers
          </p>
        </div>
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-white to-transparent" />

          <div className="animate-marquee flex w-max gap-4">
            {galleryItems.map((machine, i) => (
              <div
                key={`${machine.name}-${i}`}
                className="flex-shrink-0 w-52 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Placeholder image area */}
                <div className="mb-3 flex h-24 items-center justify-center rounded-lg bg-slate-50">
                  <span className="text-3xl">
                    {TYPE_EMOJI[machine.type] ?? '\uD83D\uDD27'}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{machine.name}</p>
                    <p className="text-xs text-slate-500 truncate">{machine.brand}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${TYPE_COLORS[machine.type] ?? 'bg-slate-100 text-slate-600'}`}>
                    {machine.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
