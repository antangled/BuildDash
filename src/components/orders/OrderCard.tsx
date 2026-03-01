'use client';

import { Package, Truck, MapPin, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Order, OrderStatus } from '@/types/order';

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; icon: typeof Package }
> = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  accepted: { label: 'Accepted', color: 'bg-blue-100 text-blue-800', icon: CheckCircle2 },
  in_progress: { label: 'In Progress', color: 'bg-indigo-100 text-indigo-800', icon: Package },
  quality_check: { label: 'Quality Check', color: 'bg-purple-100 text-purple-800', icon: Package },
  ready_for_shipping: { label: 'Ready to Ship', color: 'bg-cyan-100 text-cyan-800', icon: Truck },
  shipped: { label: 'Shipped', color: 'bg-sky-100 text-sky-800', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-emerald-100 text-emerald-800', icon: MapPin },
  completed: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
  cancelled: { label: 'Cancelled', color: 'bg-slate-100 text-slate-800', icon: XCircle },
};

interface OrderCardProps {
  order: Order;
  role: 'buyer' | 'seller';
  onAction?: (orderId: string, action: string) => void;
}

export default function OrderCard({ order, role }: OrderCardProps) {
  const statusConfig = STATUS_CONFIG[order.status];
  const StatusIcon = statusConfig.icon;
  const createdDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Order #{order.id.slice(0, 8)}
            </CardTitle>
            <p className="text-xs text-slate-500 mt-1">{createdDate}</p>
          </div>
          <Badge className={`${statusConfig.color} border-0 gap-1`}>
            <StatusIcon className="h-3 w-3" />
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Machine & Material */}
        <div className="flex items-center gap-2 text-sm">
          <Package className="h-4 w-4 text-slate-400" />
          <span className="font-medium">{order.machineName || 'Unknown Machine'}</span>
          <Badge variant="outline" className="text-xs">
            {order.material}
          </Badge>
        </div>

        {/* Seller/Buyer info */}
        <div className="text-sm text-slate-600">
          {role === 'buyer' ? (
            <span>Seller: {order.sellerName || 'Unknown'}</span>
          ) : (
            <span>Buyer: #{order.buyerId.slice(0, 8)}</span>
          )}
        </div>

        {/* Delivery */}
        <div className="flex items-center gap-2 text-sm text-slate-600">
          {order.deliveryMethod === 'shipping' ? (
            <>
              <Truck className="h-4 w-4 text-slate-400" />
              <span>Shipping — {order.distanceMiles.toFixed(0)} mi away</span>
            </>
          ) : (
            <>
              <MapPin className="h-4 w-4 text-slate-400" />
              <span>Local Pickup</span>
            </>
          )}
        </div>

        {/* Tracking */}
        {order.trackingNumber && (
          <div className="text-xs text-slate-500">
            Tracking: {order.trackingNumber}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between border-t pt-3">
          <span className="text-sm text-slate-600">
            Qty {order.quantity} × {order.material}
          </span>
          <span className="text-lg font-bold text-slate-900">
            ${order.priceBreakdown.total.toFixed(2)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
