'use client';

import { CheckCircle2, Circle } from 'lucide-react';
import type { OrderStatus } from '@/types/order';

const TIMELINE_STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'pending', label: 'Order Placed' },
  { status: 'accepted', label: 'Accepted' },
  { status: 'in_progress', label: 'Fabricating' },
  { status: 'quality_check', label: 'Quality Check' },
  { status: 'ready_for_shipping', label: 'Ready to Ship' },
  { status: 'shipped', label: 'Shipped' },
  { status: 'delivered', label: 'Delivered' },
  { status: 'completed', label: 'Completed' },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  pending: 0,
  accepted: 1,
  in_progress: 2,
  quality_check: 3,
  ready_for_shipping: 4,
  shipped: 5,
  delivered: 6,
  completed: 7,
  rejected: -1,
  cancelled: -1,
};

interface OrderTimelineProps {
  currentStatus: OrderStatus;
}

export default function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  const currentIndex = STATUS_ORDER[currentStatus];

  if (currentStatus === 'rejected' || currentStatus === 'cancelled') {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700">
        <Circle className="h-4 w-4 fill-red-500 text-red-500" />
        Order {currentStatus === 'rejected' ? 'was rejected' : 'has been cancelled'}
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {TIMELINE_STEPS.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.status} className="flex items-start gap-3">
            {/* Connector line + Icon */}
            <div className="flex flex-col items-center">
              {isCompleted ? (
                <CheckCircle2
                  className={`h-5 w-5 shrink-0 ${
                    isCurrent ? 'text-orange-500' : 'text-green-500'
                  }`}
                />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-slate-300" />
              )}
              {index < TIMELINE_STEPS.length - 1 && (
                <div
                  className={`h-6 w-0.5 ${
                    index < currentIndex ? 'bg-green-300' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>

            {/* Label */}
            <span
              className={`text-sm pb-4 ${
                isCurrent
                  ? 'font-semibold text-orange-600'
                  : isCompleted
                  ? 'text-slate-700'
                  : 'text-slate-400'
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
