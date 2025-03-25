"use client";

import { useState } from "react";

const Dashboard = () => {
  const [orders] = useState([
    {
      id: 1,
      productName: "iPhone 15 Pro",
      customer: "John Doe",
      totalAmount: 999.99,
      location: "New York, NY",
      status: "Pending",
      date: "2024-03-18"
    },
    {
      id: 2,
      productName: "MacBook Air",
      customer: "Jane Smith",
      totalAmount: 1299.99,
      location: "Los Angeles, CA",
      status: "To Be Delivered",
      date: "2024-03-17"
    },
    {
      id: 3,
      productName: "AirPods Pro",
      customer: "Alice Brown",
      totalAmount: 249.99,
      location: "Chicago, IL",
      status: "Delivered",
      date: "2024-03-16"
    },
    {
      id: 4,
      productName: "iPad Air",
      customer: "Bob Johnson",
      totalAmount: 599.99,
      location: "Houston, TX",
      status: "Not Delivered",
      date: "2024-03-15"
    },
    {
      id: 5,
      productName: "Apple Watch",
      customer: "Charlie White",
      totalAmount: 399.99,
      location: "Miami, FL",
      status: "Done",
      date: "2024-03-14"
    },
    {
      id: 6,
      productName: "Magic Keyboard",
      customer: "Diana Green",
      totalAmount: 299.99,
      location: "Seattle, WA",
      status: "Pending",
      date: "2024-03-13"
    },
  ]);

  const [activeTab, setActiveTab] = useState("All");

  const filteredOrders = activeTab === "All" ? orders : orders.filter(order => order.status === activeTab);

  const handleStatusUpdate = (orderId: number) => {
    alert(`Update status for order ${orderId}`);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-5">Order Dashboard</h1>

      <div className="flex justify-center gap-3 mb-4">
        {["All", "Pending", "To Be Delivered", "Delivered", "Not Delivered", "Done"].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded flex-1 max-w-[200px] ${
              activeTab === status ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
            onClick={() => setActiveTab(status)}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 shadow-lg rounded-lg overflow-x-auto">
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Product Name</th>
              <th className="p-2 border">Customer</th>
              <th className="p-2 border">Total Amount</th>
              <th className="p-2 border">Location</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="border text-center">
                  <td className="p-2 border">{order.id}</td>
                  <td className="p-2 border">{order.productName || 'N/A'}</td>
                  <td className="p-2 border">{order.customer}</td>
                  <td className="p-2 border">{order.totalAmount ? `$${order.totalAmount.toFixed(2)}` : 'N/A'}</td>
                  <td className="p-2 border">{order.location || 'N/A'}</td>
                  <td className="p-2 border">
                    <span className={`px-2 py-1 rounded text-white ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleStatusUpdate(order.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-2 border text-gray-500 text-center">
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

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-500";
    case "To Be Delivered":
      return "bg-blue-500";
    case "Delivered":
      return "bg-green-500";
    case "Not Delivered":
      return "bg-red-500";
    case "Done":
      return "bg-gray-500";
    default:
      return "bg-gray-300";
  }
};

export default Dashboard;
