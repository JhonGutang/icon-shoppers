"use client";

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { useOrders } from "@/hooks/useOrders";
import { STATUS_OPTIONS, formatStatus, getStatusColor } from "@/lib/orderUtils";
import { StatusButtons } from "@/components/StatusButton";

const Dashboard = () => {
  const { orders, error, activeTab, setActiveTab, handleStatusUpdate } = useOrders();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-5">Order Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {STATUS_OPTIONS.length > 0 && (
        <div className="flex justify-center gap-3 mb-4">
          {STATUS_OPTIONS.map((status) => (
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
              orders.map((order) => (
                order.products?.map((product, index) => (
                  <TableRow key={`${order.id || 'order'}-${product.id || 'product'}-${index}`}>
                    {index === 0 && (
                      <>
                        <TableCell rowSpan={order.products.length}>{order.id}</TableCell>
                        <TableCell rowSpan={order.products.length}>{order.customer?.name}</TableCell>
                      </>
                    )}
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>${Number(product.totalPrice).toFixed(2)}</TableCell>
                    {index === 0 && (
                      <>
                        <TableCell rowSpan={order.products.length}>{order.location}</TableCell>
                        <TableCell rowSpan={order.products.length}>
                          <span className={`px-2 py-1 rounded text-white ${getStatusColor(order.status)}`}>
                            {formatStatus(order.status)}
                          </span>
                        </TableCell>
                        <TableCell rowSpan={order.products.length}>
                          <StatusButtons
                            status={order.status}
                            onApprove={() => handleStatusUpdate(
                              order.id,
                              order.status === 'to_be_delivered' ? 'delivering' : 'to_be_delivered'
                            )}
                            onReject={() => handleStatusUpdate(order.id, 'rejected')}
                          />
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))
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

export default Dashboard;
