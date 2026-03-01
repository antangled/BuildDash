'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { MachineDefinition } from '@/types/machine';

interface MachineSearchProps {
  machines: MachineDefinition[];
  onSelect: (machine: MachineDefinition) => void;
  placeholder?: string;
}

export default function MachineSearch({ machines, onSelect, placeholder }: MachineSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return machines
      .filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.manufacturer.toLowerCase().includes(q) ||
          m.tags.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 15);
  }, [query, machines]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder ?? 'Search for your machine...'}
          className="pl-9"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white shadow-lg max-h-80 overflow-y-auto">
          {results.map((machine) => (
            <button
              key={machine.id}
              onClick={() => {
                onSelect(machine);
                setQuery(`${machine.manufacturer} ${machine.name}`);
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-50 border-b last:border-b-0"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-900">
                  {machine.manufacturer} {machine.name}
                </p>
                <p className="text-xs text-slate-500">
                  {machine.buildVolume.x} × {machine.buildVolume.y} × {machine.buildVolume.z} mm
                </p>
              </div>
              <Badge variant="outline" className="text-xs shrink-0">
                {machine.type}
              </Badge>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-white p-4 shadow-lg text-center">
          <p className="text-sm text-slate-500">No machines found for &quot;{query}&quot;</p>
          <p className="text-xs text-slate-400 mt-1">You can add custom specs below</p>
        </div>
      )}
    </div>
  );
}
