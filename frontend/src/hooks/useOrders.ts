import { useState, useEffect } from "react";
import { Order, OrderStatus } from "@/types/order";
import { orderService } from "@/services/orderService";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<OrderStatus>("All");

  const fetchOrders = async (status?: OrderStatus) => {
    try {
      setLoading(true);
      const data = await orderService.fetchOrders(status);
      
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
      await orderService.updateOrderStatus(orderId, newStatus);
      fetchOrders(activeTab);
    } catch (err) {
      setError("Failed to update order status");
      console.error("Error updating order status:", err);
    }
  };

  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab]);

  return {
    orders,
    loading,
    error,
    activeTab,
    setActiveTab,
    handleStatusUpdate
  };
};