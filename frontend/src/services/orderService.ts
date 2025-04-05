import axiosInstance from "@/hooks/useAxios";
import { Order } from "@/types/order";

export const orderService = {
  async fetchOrders(token: string, status?: string) {
    let queryStatus = status === "All" ? "" : status?.toLowerCase().replace(/ /g, "_");
    if (queryStatus === "approved") queryStatus = "active";
    
    const url = queryStatus ? `/orders?status=${queryStatus}` : "/orders";
    const response = await axiosInstance.get<Order[]>(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  async updateOrderStatus(token: string, orderId: number, status: string) {
    return await axiosInstance.put(
      `/orders/${orderId}`, 
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  },

  async fetchSellerOrders(token: string) {
    const response = await axiosInstance.get<Order[]>('/seller/orders', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  async fetchCustomerOrders(token: string) {
    const response = await axiosInstance.get('/customer/orders', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
}; 