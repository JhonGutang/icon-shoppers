export interface Order {
    id: string | number;
    customer_id: number;
    product_id: number;
    shop_id: number;
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
    customerName: string;
    products: Array<{
      name: string;
      quantity: number;
      totalPrice: number;
      shop: {
        id: number;
        name: string;
        email: string;
        description: string;
        contact_number: string;
      };
    }>;
    totalAmount: string;
    shippingAddress: string | null;
  }
  
  export type OrderStatus = "All" | "approved" | "rejected" | "to_be_delivered" | "delivering" | "recieved" | "not_recieved" | "completed";