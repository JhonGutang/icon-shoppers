import { useState, useEffect } from "react";
import { Order, OrderStatus } from "@/types/order";
import { orderService } from "@/services/orderService";
import useAuthStore from "@/stores/useAuthStore";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<OrderStatus>("All");
  const token = useAuthStore((state) => state.accessToken);

  const fetchOrders = async (status?: OrderStatus) => {
    try {
      setLoading(true);
      if (!token) {
        throw new Error("No authentication token");
      }
      const data = await orderService.fetchOrders(token, status);
      
      let filteredOrders = data;
      if (status !== "All") {
        filteredOrders = data.filter((order: Order) => 
          (status === "approved" ? order.status.toLowerCase() === "active" : order.status.toLowerCase() === status.toLowerCase().replace(/ /g, "_"))
        );
      }
      
      setOrders(filteredOrders);
      setError(null);
    } catch (err) {
      setError("Failed to fetch orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      if (!token) {
        throw new Error("No authentication token");
      }
      await orderService.updateOrderStatus(token, orderId, newStatus);
      fetchOrders(activeTab);
    } catch (err) {
      setError("Failed to update order status");
      console.error("Error updating order status:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders(activeTab);
    }
  }, [activeTab, token]);

  return {
    orders,
    loading,
    error,
    activeTab,
    setActiveTab,
    handleStatusUpdate
  };
};