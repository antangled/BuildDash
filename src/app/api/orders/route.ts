import { NextResponse } from 'next/server';
import type { Order } from '@/types/order';

// In-memory store for demo purposes (would be Supabase in production)
const orders: Order[] = [];

export async function GET() {
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  const body = await request.json();

  const order: Order = {
    id: crypto.randomUUID(),
    buyerId: body.buyerId,
    sellerId: body.sellerId,
    machineId: body.machineId,
    stlFile: body.stlFile,
    material: body.material,
    quantity: body.quantity ?? 1,
    deliveryMethod: body.deliveryMethod ?? 'shipping',
    distanceMiles: body.distanceMiles ?? 0,
    priceBreakdown: body.priceBreakdown,
    status: 'pending',
    notes: body.notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sellerName: body.sellerName,
    machineName: body.machineName,
  };

  orders.push(order);

  return NextResponse.json({ order }, { status: 201 });
}
