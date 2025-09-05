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

      const data = await orderService.fetchOrders(token, status);

      const filteredOrders =
        status === "all"
          ? data
          : data.filter((order) => {
              const orderStatus = order.status.toLowerCase();

              const filterStatus = status?.toLowerCase().replace(/ /g, "_");

              if (status === "approved") {
                return orderStatus === "active";
              }

              return orderStatus === filterStatus;
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
    await orderService.updateOrderStatus(token, Number(orderId), newStatus);
  };



  return {
    loading,
    error,
    handleStatusUpdate,
    fetchOrders,
  };
};
