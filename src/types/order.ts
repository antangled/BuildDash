import type { MaterialCategory } from './machine';
import type { STLFileInfo } from './stl';

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'in_progress'
  | 'quality_check'
  | 'ready_for_shipping'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'rejected'
  | 'cancelled';

export type DeliveryMethod = 'shipping' | 'local_pickup';

export interface PriceBreakdown {
  fabricationCost: number;
  materialCost: number;
  platformFee: number;
  shippingCost: number;
  buildPassDiscount: number;
  localPickupBonus: number;
  total: number;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  machineId: string;
  stlFile: STLFileInfo;
  material: MaterialCategory;
  quantity: number;
  deliveryMethod: DeliveryMethod;
  distanceMiles: number;
  priceBreakdown: PriceBreakdown;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  estimatedCompletionDate?: string;
  trackingNumber?: string;
  // Joined display fields
  sellerName?: string;
  machineName?: string;
}
