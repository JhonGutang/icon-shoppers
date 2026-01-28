"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useCustomerActions from "@/hooks/useCustomerActions";
import { ProductWithShop } from "@/types/product";
import { useEffect, useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { formatStatus, getStatusColor } from "@/lib/orderUtils";
import { Order } from "@/types/order";

const Orders = () => {
  const { handleOrders } = useCustomerActions();
  const [orders, setOrders] = useState<Order[]>();
  const [activeTab, setActiveTab] = useState<string>("all");
  const { handleStatusUpdate } = useOrders();

  const orderTabs = [
    { id: "all", label: "All" },
    { id: "PENDING", label: "Pending" },
    { id: "PROCESSING", label: "Processing" },
    { id: "SHIPPED", label: "Shipped" },
    { id: "DELIVERED", label: "Delivered" },
  ];

  const fetchOrders = async (status?: string) => {
    const products = await handleOrders(status || "all");
    if (products) setOrders(products);
  };

  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab]);

  if (!orders)
    return (
      <div className="w-full h-screen flex justify-center items-center text-2xl">
        <div className="animate-pulse">Loading Please Wait...</div>
      </div>
    );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Your Orders</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {orderTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              className={`whitespace-nowrap transition-all ${
                activeTab === tab.id ? "bg-green-600 hover:bg-green-700" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed text-gray-400">
              <p>No orders found in this section.</p>
          </div>
      ) : orders.map((order, index) => (
        <Card key={index} className="mb-6 shadow-md overflow-hidden border-none ring-1 ring-gray-200">
          <CardContent className="p-0">
            <div className="p-5 flex flex-col gap-6">
              {/* Shop Name + Order Status */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="text-lg font-semibold flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    {order.shop.name}
                </div>
                <div
                  className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-[10px] font-bold uppercase text-white shadow-sm ${getStatusColor(
                    order.status || ''
                  )}`}
                >
                  {formatStatus(order.status || '')}
                </div>
              </div>

              {/* Products List */}
              <div className="flex flex-col gap-4">
                {order.products.map((product) => (
                  <div key={product.id} className="flex items-center gap-4">
                    <img
                      src={`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${product.image}`}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-xl border shadow-sm"
                    />
                    <div className="flex-1">
                      <div className="font-bold">{product.name}</div>
                      <div className="text-xs text-gray-500">
                        Quantity: {product.quantity}
                      </div>
                      <div className="text-md font-bold text-green-600">
                        ₱{Number(product.price).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Items Summary</h4>
                    {order.products.map((product, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {product.name} <span className="text-xs">x{product.quantity}</span>
                        </span>
                        <span className="font-mono">
                          ₱{(Number(product.price) * Number(product.quantity)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Info</h4>
                    <div className="text-sm flex justify-between">
                      <span className="text-gray-500">Payment:</span>
                      <span className="font-medium">Cash on Delivery</span>
                    </div>
                    <div className="text-sm flex justify-between">
                      <span className="text-gray-500">Address:</span>
                      <span className="font-medium text-right max-w-[150px] truncate">{order.shippingAddress || "Regional Delivery"}</span>
                    </div>
                    <div className="pt-2 border-t flex justify-between items-baseline">
                      <span className="font-bold">Total:</span>
                      <span className="text-2xl font-black text-green-600">
                        ₱{order.products
                          .reduce((sum, p) => sum + Number(p.price) * Number(p.quantity), 0)
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {((order.status as string).toUpperCase() === 'SHIPPED' || order.status === 'delivering') && (
              <div className="bg-gray-50 p-4 flex justify-end">
                <Button 
                    className="bg-green-600 hover:bg-green-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-green-100" 
                    onClick={() => handleStatusUpdate(String(order.id), 'delivered')}
                >
                  Mark as Received
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Orders;
