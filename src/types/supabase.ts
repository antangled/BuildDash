export interface Database {
  public: {
    Tables: {
      machines_catalog: {
        Row: {
          id: string;
          name: string;
          manufacturer: string;
          type: string;
          build_volume: { x: number; y: number; z: number } | null;
          compatible_materials: string[];
          tags: string[];
          specs: Record<string, unknown>;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['machines_catalog']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['machines_catalog']['Insert']>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          role: 'buyer' | 'seller' | 'both';
          tier: 'basic' | 'pro' | 'premium';
          location_lat: number | null;
          location_lng: number | null;
          city: string | null;
          state: string | null;
          zip_code: string | null;
          rating: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at' | 'rating'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
        Relationships: [];
      };
      seller_machines: {
        Row: {
          id: string;
          seller_id: string;
          catalog_machine_id: string | null;
          machine_name: string;
          machine_type: string;
          manufacturer: string;
          build_volume: { x: number; y: number; z: number } | null;
          materials: string[];
          price_per_hour: number;
          min_price: number;
          turnaround_days: number;
          is_available: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['seller_machines']['Row'], 'created_at' | 'updated_at' | 'is_available'>;
        Update: Partial<Database['public']['Tables']['seller_machines']['Insert']> & { is_available?: boolean };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          buyer_id: string;
          seller_id: string;
          seller_machine_id: string;
          material: string;
          quantity: number;
          delivery_method: 'shipping' | 'local_pickup';
          distance_miles: number;
          fabrication_cost: number;
          material_cost: number;
          platform_fee: number;
          shipping_cost: number;
          total: number;
          status: string;
          notes: string | null;
          tracking_number: string | null;
          stl_filename: string | null;
          stl_dimensions: { x: number; y: number; z: number } | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'created_at' | 'updated_at' | 'status'>;
        Update: Partial<Database['public']['Tables']['orders']['Insert']> & { status?: string };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
  };
}
