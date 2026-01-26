import { useState } from "react";
import { OrderStatus } from "@/types/order";
import { orderService } from "@/services/orderService";
import useAuthStore from "@/stores/useAuthStore";

export const useOrders = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const token = useAuthStore((state) => state.accessToken);

  const fetchOrders = async (status?: OrderStatus) => {
    try {
      setLoading(true);
      if (!token) throw new Error("No authentication token");

      const data = await orderService.fetchOrders(status);

      const filteredOrders =
        !status || status === "all"
          ? data
          : data.filter((order: any) => {
              return order.status.toUpperCase() === status.toUpperCase();
            });

            setError(null);
            return filteredOrders
    } catch (err) {
      setError("Failed to fetch orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    if (!token) return;
    setLoading(true);
    try {
        await orderService.updateOrderStatus(Number(orderId), newStatus);
        setError(null);
    } catch (err) {
        console.error(err);
        setError("Failed to update status");
        throw err;
    } finally {
        setLoading(false);
    }
  };

  return {
    loading,
    error,
    handleStatusUpdate,
    fetchOrders,
  };
};
