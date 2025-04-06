import axiosInstance from "@/hooks/useAxios";
import { Order } from "@/types/order";
import axios from "axios";

// Helper to generate headers
const authHeader = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const normalizeStatus = (status?: string): string => {
  if (!status || status === "All") return "";
  return status.toLowerCase().replace(/ /g, "_") === "approved"
    ? "active"
    : status.toLowerCase().replace(/ /g, "_");
};

export const orderService = {
  async fetchOrders(token: string, status?: string): Promise<Order[]> {
    const queryStatus = normalizeStatus(status);
    const url = queryStatus ? `/orders?status=${queryStatus}` : "/orders";
    const response = await axiosInstance.get<Order[]>(url, authHeader(token));
    return response.data;
  },

  async updateOrderStatus(token: string, orderId: number, status: string) {
    try {
      const response = await axiosInstance.put(
        `orders/${orderId}`,
        { status },
        authHeader(token)
      );
      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update order'
      };
    }
  },

  async approveOrder(token: string, orderId: string) {
    try {
      const response = await axiosInstance.put(
        `/orders/${orderId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error approving order:', error);
      throw error;
    }
  },

  async rejectOrder(token: string, orderId: string) {
    try {
      const response = await axiosInstance.put(
        `/orders/${orderId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error rejecting order:', error);
      throw error;
    }
  },

  async fetchSellerOrders(token: string): Promise<Order[]> {
    const response = await axiosInstance.get<Order[]>("/seller/orders", authHeader(token));
    return response.data;
  },

  async fetchCustomerOrders(token: string): Promise<Order[]> {
    const response = await axiosInstance.get<Order[]>("/customer/orders", authHeader(token));
    return response.data;
  }
};
