export interface Order {
    id: number;
    customer_id: number;
    product_id: number;
    quantity: number;
    total_amount: number;
    location: string;
    status: string;
    created_at: string;
    customer?: {
      name: string;
    };
    product?: {
      name: string;
    };
  }
  
  export type OrderStatus = "All" | "approved" | "rejected" | "to_be_delivered" | "recieved" | "not_recieved" | "completed";