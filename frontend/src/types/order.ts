export type OrderStatus = "All" | "ordered" | "to_be_delivered" | "delivering" | "completed" | "rejected";

export interface OrderStatistics {
  total_orders: number;
  pending_orders: number;
  completed_orders: number;
}

export interface Order {
  id: number;
  customer: {
    name: string;
  };
  product: {
    name: string;
  };
  quantity: number;
  total_amount: number;
  location: string;
  status: OrderStatus;
}

export interface OrdersResponse {
  orders: Order[];
}