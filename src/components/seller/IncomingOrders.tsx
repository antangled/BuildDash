'use client';

import { useSellerStore } from '@/store/useSellerStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Inbox } from 'lucide-react';

export default function IncomingOrders() {
  const { incomingOrders, activeOrders, acceptOrder, rejectOrder, updateOrderStatus } = useSellerStore();

  if (incomingOrders.length === 0 && activeOrders.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center">
        <Inbox className="mx-auto h-10 w-10 text-slate-300 mb-3" />
        <p className="font-medium text-slate-600">No orders yet</p>
        <p className="text-sm text-slate-400 mt-1">
          Orders will appear here when buyers request quotes on your machines.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {incomingOrders.length > 0 && (
        <div>
          <h3 className="font-semibold text-slate-800 mb-3">
            Incoming Requests ({incomingOrders.length})
          </h3>
          <div className="space-y-3">
            {incomingOrders.map((order) => (
              <div key={order.id} className="rounded-lg border bg-white p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-slate-900">
                      {order.material.replace(/_/g, ' ')} part
                    </p>
                    <p className="text-sm text-slate-500">
                      {order.stlFile.dimensions.x.toFixed(0)} × {order.stlFile.dimensions.y.toFixed(0)} × {order.stlFile.dimensions.z.toFixed(0)} mm
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                    Pending
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 gap-1" onClick={() => acceptOrder(order.id)}>
                    <Check className="h-3.5 w-3.5" /> Accept
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600 gap-1" onClick={() => rejectOrder(order.id)}>
                    <X className="h-3.5 w-3.5" /> Decline
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeOrders.length > 0 && (
        <div>
          <h3 className="font-semibold text-slate-800 mb-3">
            Active Orders ({activeOrders.length})
          </h3>
          <div className="space-y-3">
            {activeOrders.map((order) => (
              <div key={order.id} className="rounded-lg border bg-white p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-slate-900">
                      {order.material.replace(/_/g, ' ')} part
                    </p>
                    <p className="text-sm text-slate-500">
                      Status: {order.status.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">
                    {order.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  {order.status === 'accepted' && (
                    <Button size="sm" variant="secondary" onClick={() => updateOrderStatus(order.id, 'in_progress')}>
                      Start Fabrication
                    </Button>
                  )}
                  {order.status === 'in_progress' && (
                    <Button size="sm" variant="secondary" onClick={() => updateOrderStatus(order.id, 'shipped')}>
                      Mark Shipped
                    </Button>
                  )}
                  {order.status === 'shipped' && (
                    <Button size="sm" variant="secondary" onClick={() => updateOrderStatus(order.id, 'delivered')}>
                      Mark Delivered
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
