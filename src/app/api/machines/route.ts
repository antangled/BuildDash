import { NextResponse } from 'next/server';
import machinesCatalog from '@/data/machines-catalog.json';
import type { MachineDefinition } from '@/types/machine';

const machines = machinesCatalog as MachineDefinition[];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() ?? '';
  const type = searchParams.get('type');
  const limit = parseInt(searchParams.get('limit') ?? '50', 10);

  let results = machines;

  // Filter by type
  if (type) {
    results = results.filter((m) => m.type === type);
  }

  // Search by query
  if (query) {
    results = results.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.manufacturer.toLowerCase().includes(query) ||
        m.tags?.some((t) => t.toLowerCase().includes(query))
    );
  }

  return NextResponse.json({
    machines: results.slice(0, limit),
    total: results.length,
  });
}
