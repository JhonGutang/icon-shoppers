import { useState, useEffect } from "react";
import { Order, OrderStatus } from "@/types/order";
import { orderService } from "@/services/orderService";
import useAuthStore from "@/stores/useAuthStore";
import { toast } from "sonner"; // or your toast library

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<OrderStatus>("All");
  const token = useAuthStore((state) => state.accessToken);

  const fetchOrders = async (status?: OrderStatus) => {
    try {
      setLoading(true);
      if (!token) throw new Error("No authentication token");

      const data = await orderService.fetchOrders(token, status);
      const filteredOrders = status === "All" ? data : data.filter((order) =>
        status === "approved"
          ? order.status.toLowerCase() === "active"
          : order.status.toLowerCase() === status.toLowerCase().replace(/ /g, "_")
      );

      setOrders(filteredOrders);
      setError(null);
    } catch (err) {
      setError("Failed to fetch orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setLoading(true);
      let result;
      
      if (newStatus === 'rejected') {
        result = await orderService.rejectOrder(token, orderId);
      } else if (newStatus === 'to_be_delivered') {
        result = await orderService.approveOrder(token, orderId);
      } else {
        result = await orderService.updateOrderStatus(token, orderId, newStatus);
      }

      if (result.success) {
        toast.success(`Order ${newStatus.replace(/_/g, " ")}!`);
        fetchOrders(activeTab);
      } else {
        toast.error(result.error || "Failed to update order status.");
      }
    } catch (err) {
      toast.error("Failed to update order status.");
      console.error("Status update error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders(activeTab);
  }, [activeTab, token]);

  return {
    orders,
    loading,
    error,
    activeTab,
    setActiveTab,
    handleStatusUpdate,
  };
};
