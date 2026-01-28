export interface Address {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  street: string;
  barangay: string;
  city: string;
  postal_code: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export type NewAddress = Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>;
