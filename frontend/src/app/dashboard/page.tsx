"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/hooks/useAxios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Order {
  id: number;
  customer_id: number;
  product_id: number;
  quantity: number;
  total_amount: number;
  location: string;
  status: string;
  created_at: string;
  customer?: {
    name: string;
  };
  product?: {
    name: string;
  };
}

const Dashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("All");

  const fetchOrders = async (status?: string) => {
    try {
      setLoading(true);
      let queryStatus = status === "All" ? "" : status.toLowerCase().replace(/ /g, "_");
      if (queryStatus === "approved") queryStatus = "active";
  
      const url = queryStatus ? `/orders?status=${queryStatus}` : "/orders";
      const response = await axiosInstance.get(url);
      
      let filteredOrders = response.data;
      if (status !== "All") {
        filteredOrders = response.data.filter((order: Order) => 
          (status === "approved" ? order.status.toLowerCase() === "active" : order.status.toLowerCase() === queryStatus)
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
  
  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab]);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await axiosInstance.put(`/orders/${orderId}`, { status: newStatus });
      fetchOrders(activeTab);
    } catch (err) {
      setError("Failed to update order status");
      console.error("Error updating order status:", err);
    }
  };

  const statusOptions = ["All", "approved", "rejected", "to_be_delivered", "recieved", "not_recieved", "completed"];

  const formatStatus = (status: string) => {
    if (status === "All") return "All";
    if (status === "active") return "Approved";
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-5">Order Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {statusOptions.length > 0 && (
        <div className="flex justify-center gap-3 mb-4">
          {statusOptions.map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded flex-1 max-w-[200px] ${
                activeTab === status ? "bg-blue-500 text-white" : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => setActiveTab(status)}
            >
              {formatStatus(status)}
            </button>
          ))}
        </div>
      )}

      <div className="bg-white p-4 shadow-lg rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer?.name}</TableCell>
                  <TableCell>{order.product?.name}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>${Number(order.total_amount).toFixed(2)}</TableCell>
                  <TableCell>{order.location}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-white ${getStatusColor(order.status)}`}>
                      {formatStatus(order.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <select
                      className="mr-2 p-1 border rounded"
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    >
                      {statusOptions
                        .filter((status) => status !== "All")
                        .map((status) => (
                          <option key={status} value={status}>
                            {formatStatus(status)}
                          </option>
                        ))}
                    </select>
                  </TableCell>
                </TableRow>
              ))
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

const getStatusColor = (status: string) => {
  switch (status.toLowerCase().replace(/ /g, "_")) {
    case "active":
    case "approved":
      return "bg-green-600";
    case "rejected":
      return "bg-red-600";
    case "to_be_delivered":
      return "bg-blue-500";
    case "recieved":
      return "bg-green-500";
    case "not_recieved":
      return "bg-red-500";
    case "completed":
      return "bg-gray-500";
    default:
      return "bg-gray-300";
  }
};

export default Dashboard;