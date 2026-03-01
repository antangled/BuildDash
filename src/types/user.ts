export interface GeoLocation {
  lat: number;
  lng: number;
  zipCode?: string;
  city?: string;
  state?: string;
}

export type UserRole = 'buyer' | 'seller' | 'both';
export type SellerTier = 'basic' | 'pro' | 'premium';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location?: GeoLocation;
  createdAt: string;
}

export interface SellerProfile extends User {
  tier: SellerTier;
  commissionRate: number;
  rating: number;
  totalOrders: number;
  isOnline: boolean;
}

export interface BuyerProfile extends User {
  hasBuildPass: boolean;
}
