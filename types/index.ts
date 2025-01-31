export type UserRole = 'admin' | 'provider' | 'customer' | 'guest';

export interface UserProfile {
  id: string;
  role: UserRole;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Service {
  id: string;
  provider_id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  image_url?: string;
  available: boolean;
}

export interface Booking {
  id: string;
  service_id: string;
  customer_id: string;
  provider_id: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  datetime: string;
  total_amount: number;
  notes?: string;
}
