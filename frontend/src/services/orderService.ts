import axiosInstance from "@/hooks/useAxios";
import { Order } from "@/types/order";
import { ProductWithShop } from "@/types/product";
import type { AxiosError } from "axios";

const normalizeStatus = (status?: string): string => {
  if (!status) return "ALL";
  return status.toUpperCase();
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
  async fetchOrders(status?: string): Promise<Order[]> {
    try {
      const queryStatus = normalizeStatus(status);
      const url = queryStatus ? `/orders?status=${queryStatus}` : "/orders";
      const response = await axiosInstance.get<Order[]>(url);
      return response.data;
    } catch (error) {
      throw handleError(error, "Error fetching orders");
    }
  },

  async fetchSellerOrders(): Promise<Order[]> {
    try {
      const response = await axiosInstance.get<Order[]>("/seller/orders");
      return response.data;
    } catch (error) {
      throw handleError(error, "Error fetching seller orders");
    }
  },

  async fetchCustomerOrders(status?: string): Promise<ProductWithShop[]> {
    try {
      const queryStatus = normalizeStatus(status);
      const url = `/customer/orders?status=${queryStatus}`;
      const response = await axiosInstance.get<ProductWithShop[]>(url);
      return response.data;
    } catch (error) {
      throw handleError(error, "Error fetching customer orders");
    }
  },

  async updateOrderStatus(orderId: number, status: string) {
    try {
      const response = await axiosInstance.put(
        `/status-update/${orderId}`,
        { status: status }
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error, "Failed to update order status");
    }
  },

  async receiveOrder(orderId: string) {
    try {
      const response = await axiosInstance.put(
        `/orders/${orderId}/receive`,
        {}
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleError(error, "Failed to mark order as received");
    }
  },
};
