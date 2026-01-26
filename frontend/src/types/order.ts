import { Product, Shop } from "./product";

export type OrderStatus = 
  | 'ORDERED'
  | 'APPROVED'
  | 'PROCESSING'
  | 'DELIVERING'
  | 'DELIVERED'
  | 'RECEIVED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'RETURNED';

export interface OrderItem {
  id: number;
  order_item_id?: number;
  product_id: number;
  name: string;
  price: number | string;
  image: string | null;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  user_id: number;
  shop_id: number;
  shop: Partial<Shop>;
  status: OrderStatus;
  statusLabel: string;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  deliveryMethod?: string;
  shippingAddress: string;
  notes?: string;
  products: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CheckoutPayload {
  products: {
    id: number;
    quantity: number;
  }[];
  shipping_address: string;
  payment_method: string;
  delivery_method: string;
  notes?: string;
}