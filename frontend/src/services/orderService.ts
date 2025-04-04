import axiosInstance from "@/hooks/useAxios";
import { Order } from "@/types/order";
import useAuthStore from "@/stores/useAuthStore";

export const orderService = {
  async fetchOrders(status?: string) {
    let queryStatus = status === "All" ? "" : status?.toLowerCase().replace(/ /g, "_");
    if (queryStatus === "approved") queryStatus = "active";
    
    const url = queryStatus ? `/orders?status=${queryStatus}` : "/orders";
    const response = await axiosInstance.get<Order[]>(url);
    return response.data;
  },

  async updateOrderStatus(orderId: number, status: string) {
    const response = await axiosInstance.put(`orders/${orderId}`, { status });
    return response.data;
  },

  async fetchSellerOrders(status?: string) {
    try {
      const url = status && status !== "All" 
        ? `seller/orders?status=${status.toLowerCase()}`
        : 'seller/orders';
        
      const token = useAuthStore.getState().accessToken;
      console.log('Using token:', token); // Debug log
      
      const response = await axiosInstance.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Full API Response:', response.data);
      return response.data.orders;
    } catch (error) {
      console.error('Full API Error:', error);
      throw error;
    }
  },

  async fetchCustomerOrders (token: string) {
    const response = await axiosInstance.get('/customer/orders', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  }
}; 