import axiosInstance from "@/hooks/useAxios";
import { Order } from "@/types/order";
import { ProductWithShop } from "@/types/product";
import type { AxiosError } from "axios";

const authHeader = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

const normalizeStatus = (status?: string): string => {
  if (!status || status === "All") return "";
  const normalized = status.toLowerCase().replace(/ /g, "_");
  return normalized === "approved" ? "active" : normalized;
};

const handleError = (error: unknown, message: string) => {
  const err = error as AxiosError<{ message?: string }>;
  console.error(`${message}:`, err);

  return {
    success: false,
    error: err.response?.data?.message || message,
    details: err,
  };
};

export const orderService = {
  async fetchOrders(token: string, status?: string): Promise<Order[]> {
    try {
      const queryStatus = normalizeStatus(status);
      const url = queryStatus ? `/orders?status=${queryStatus}` : "/orders";
      const response = await axiosInstance.get<Order[]>(url, authHeader(token));
      return response.data;
    } catch (error) {
      throw handleError(error, "Error fetching orders");
    }
  },

  async fetchSellerOrders(token: string): Promise<Order[]> {
    try {
      const response = await axiosInstance.get<Order[]>("/seller/orders", authHeader(token));
      return response.data;
    } catch (error) {
      throw handleError(error, "Error fetching seller orders");
    }
  },

  async fetchCustomerOrders(token: string): Promise<ProductWithShop[]> {
    try {
      const response = await axiosInstance.get<ProductWithShop[]>("/customer/orders", authHeader(token));
      return response.data;
    } catch (error) {
      throw handleError(error, "Error fetching customer orders");
    }
  },

  async updateOrderStatus(token: string, orderId: number, status: string) {
    try {
      const response = await axiosInstance.put(
        `/orders/${orderId}`,
        { status },
        authHeader(token)
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error, "Failed to update order status");
    }
  },

  async approveOrder(token: string, orderId: string) {
    try {
      const response = await axiosInstance.put(
        `/orders/${orderId}/approve`,
        {},
        authHeader(token)
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error, "Failed to approve order");
    }
  },

  async rejectOrder(token: string, orderId: string) {
    try {
      const response = await axiosInstance.put(
        `/orders/${orderId}/reject`,
        {},
        authHeader(token)
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error, "Failed to reject order");
    }
  },

  async startDelivery(token: string, orderId: string) {
    try {
      const response = await axiosInstance.put(
        `/orders/${orderId}/deliver`,
        {},
        authHeader(token)
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error, "Failed to start delivery");
    }
  },

  async receiveOrder(token: string, orderId: string) {
    try {
      const response = await axiosInstance.put(
        `/orders/${orderId}/receive`,
        {},
        authHeader(token)
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error, "Failed to mark order as received");
    }
  },
};