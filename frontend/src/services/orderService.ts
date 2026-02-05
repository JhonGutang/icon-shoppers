import axiosInstance from "@/hooks/shared/useAxios";
import { Order, CheckoutPayload, OrderStatus } from "@/types/order";
import { PaginatedResponse } from "@/types/product";

export const orderService = {
  // Customer Operations
  getCustomerOrders: async (status = 'ALL', page = 1, per_page = 20): Promise<PaginatedResponse<Order>> => {
    const response = await axiosInstance.get('/customer/orders', { params: { status, page, per_page } });
    return response.data;
  },

  getOrderDetails: async (orderNumber: string): Promise<Order> => {
    const response = await axiosInstance.get(`/orders/${orderNumber}`);
    return response.data;
  },

  checkout: async (payload: CheckoutPayload): Promise<any> => {
    const response = await axiosInstance.post('/checkout', payload);
    return response.data;
  },

  cancelOrder: async (orderId: number, reason: string): Promise<void> => {
    await axiosInstance.post(`/orders/${orderId}/cancel`, { reason });
  },

  // Seller Operations
  getSellerOrders: async (status = 'ALL', page = 1, per_page = 20): Promise<PaginatedResponse<Order>> => {
    const response = await axiosInstance.get('/seller/orders', { params: { status, page, per_page } });
    return response.data;
  },

  updateStatus: async (orderId: number, status: OrderStatus): Promise<void> => {
    await axiosInstance.put(`/orders/${orderId}/status`, { status });
  },
  
  // Backward compatibility
  updateOrderStatus: async (orderId: number, status: OrderStatus) => {
    return orderService.updateStatus(orderId, status);
  }
};

export const fetchCustomerOrders = orderService.getCustomerOrders;
export const fetchSellerOrders = orderService.getSellerOrders;
