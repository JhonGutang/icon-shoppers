import axiosInstance from "@/hooks/useAxios";
import { Order } from "@/types/order";

export const orderService = {
  async fetchOrders(status?: string) {
    let queryStatus = status === "All" ? "" : status?.toLowerCase().replace(/ /g, "_");
    if (queryStatus === "approved") queryStatus = "active";
    
    const url = queryStatus ? `/orders?status=${queryStatus}` : "/orders";
    const response = await axiosInstance.get<Order[]>(url);
    return response.data;
  },

  async updateOrderStatus(orderId: number, status: string) {
    return await axiosInstance.put(`/orders/${orderId}`, { status });
  },

  async fetchSellerOrders() {
    const response = await axiosInstance.get<Order[]>('/seller/orders');
    return response.data;
  }
}; 