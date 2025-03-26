"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/hooks/useAxios";

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
      const url = status && status !== "All" ? `/orders?status=${status.toLowerCase().replace(/ /g, '_')}` : '/orders';
      const response = await axiosInstance.get(url);
      setOrders(response.data);
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
      await axiosInstance.put(`/orders/${orderId}`, {
        status: newStatus
      });
      fetchOrders(activeTab);
    } catch (err) {
      setError("Failed to update order status");
      console.error("Error updating order status:", err);
    }
  };

  const statusOptions = ["All", "pending", "to_be_delivered", "delivered", "not_delivered", "done"];

  const formatStatus = (status: string) => {
    if (status === "All") return status;
    
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-5">Order Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {orders.length > 0 && (
        <div className="flex justify-center gap-3 mb-4">
          {statusOptions.map((status) => (
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
      )}

      <div className="bg-white p-4 shadow-lg rounded-lg overflow-x-auto">
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Customer ID</th>
              <th className="p-2 border">Product ID</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Total Amount</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="border text-center">
                  <td className="p-2 border">{order.id}</td>
                  <td className="p-2 border">{order.customer_id}</td>
                  <td className="p-2 border">{order.product_id}</td>
                  <td className="p-2 border">{order.quantity}</td>
                  <td className="p-2 border">${Number(order.total_amount).toFixed(2)}</td>
                  <td className="p-2 border">{order.location}</td>
                  <td className="p-2 border">
                    <span className={`px-2 py-1 rounded text-white ${getStatusColor(order.status)}`}>
                      {formatStatus(order.status)}
                    </span>
                  </td>
                  <td className="p-2 border">
                    <select
                      className="mr-2 p-1 border rounded"
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    >
                      {statusOptions.filter(status => status !== 'All').map(status => (
                        <option key={status} value={status}>
                          {formatStatus(status)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-2 border text-gray-500 text-center">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-500";
    case "to_be_delivered":
      return "bg-blue-500";
    case "delivered":
      return "bg-green-500";
    case "not_delivered":
      return "bg-red-500";
    case "done":
      return "bg-gray-500";
    default:
      return "bg-gray-300";
  }
};

export default Dashboard;
