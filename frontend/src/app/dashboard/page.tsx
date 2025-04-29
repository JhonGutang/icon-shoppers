"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOrders } from "@/hooks/useOrders";
import { STATUS_OPTIONS, formatStatus, getStatusColor } from "@/lib/orderUtils";
import { StatusButtons } from "@/components/StatusButton";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import useRedirectLink from "@/hooks/useRedirectLink";
import { useEffect, useState } from "react";
import { OrderStatus, Order as OrderType } from "@/types/order";
import useAuthStore from "@/stores/useAuthStore";

interface OrderItem {
  name: string;
  quantity: number;
  totalPrice: number;
}

interface DashboardOrder {
  id: number;
  customerName: string;
  location: string;
  status: OrderStatus;
  products: OrderItem[];
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<OrderStatus>("All");
  const [orders, setOrders] = useState<DashboardOrder[]>([]);
  const { error, handleStatusUpdate, fetchOrders } = useOrders();
  const { redirectLink } = useRedirectLink();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const handleFetchOrder = async () => {
    const data = await fetchOrders(activeTab);
    if (data) {
      setOrders(data as unknown as DashboardOrder[]);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await handleStatusUpdate(orderId, newStatus);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id.toString() === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );
      toast.success(`Order status updated to ${formatStatus(newStatus)}`);
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  useEffect(() => {
    if (hasHydrated) {
      handleFetchOrder();
    }
  }, [activeTab, hasHydrated]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-5 flex gap-2 items-center">
        <Button variant="ghost" size="icon" onClick={() => redirectLink('profile')}>
          <ChevronLeft />
        </Button>
        <h1 className="text-3xl font-bold ">Order Dashboard</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex justify-center gap-3 mb-4">
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded flex-1 max-w-[200px] ${
              activeTab === status
                ? "bg-blue-500 text-white"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => setActiveTab(status)}
          >
            {formatStatus(status)}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 shadow-lg rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => {
                console.log("Current order:", order);
                return order.products?.map((product, index) => (
                  <TableRow key={`${order.id}-${index}`}>
                    {index === 0 && (
                      <>
                        <TableCell rowSpan={order.products.length}>
                          {order.id}
                        </TableCell>
                        <TableCell rowSpan={order.products.length}>
                          {order.customerName}
                        </TableCell>
                      </>
                    )}
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      ${Number(product.totalPrice).toFixed(2)}
                    </TableCell>
                    {index === 0 && (
                      <>
                        <TableCell rowSpan={order.products.length}>
                          {order.location}
                        </TableCell>
                        <TableCell rowSpan={order.products.length}>
                          <span
                            className={`px-2 py-1 rounded text-white ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {formatStatus(order.status)}
                          </span>
                        </TableCell>
                        <TableCell rowSpan={order.products.length}>
                          <StatusButtons
                            status={order.status}
                            onApprove={() => {
                              if (!order.id) {
                                console.error("Order ID is missing:", order);
                                toast.error(
                                  "Cannot update order: Missing order ID"
                                );
                                return;
                              }
                              const nextStatus =
                                order.status === "to_be_delivered"
                                  ? "delivering"
                                  : "to_be_delivered";
                              updateOrderStatus(order.id.toString(), nextStatus);
                            }}
                            onReject={() => {
                              if (!order.id) {
                                console.error("Order ID is missing:", order);
                                toast.error(
                                  "Cannot update order: Missing order ID"
                                );
                                return;
                              }
                              updateOrderStatus(order.id.toString(), "rejected");
                            }}
                          />
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ));
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;
