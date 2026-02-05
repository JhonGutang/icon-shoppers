import { useState, useCallback } from "react";
import { Order, OrderStatus } from "@/types/order";
import { orderService } from "@/services/orderService";
import { PaginatedResponse } from "@/types/product";

export const useShopOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginatedResponse<Order> | null>(null);

  const fetchOrders = useCallback(async (status: string = "ALL", page: number = 1) => {
    setLoading(true);
    try {
      const response = await orderService.getSellerOrders(status, page);
      // Depending on whether response is paginated or not
      if (Array.isArray(response)) {
        setOrders(response);
      } else {
        setOrders(response.data || []);
        setPagination(response);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching shop orders:", err);
      setError("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = async (orderId: number, status: OrderStatus) => {
    setLoading(true);
    try {
      await orderService.updateStatus(orderId, status);
      // Refresh orders after update
      return true;
    } catch (err) {
      console.error("Error updating order status:", err);
      setError("Failed to update status.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    orders,
    pagination,
    fetchOrders,
    updateStatus,
  };
};
