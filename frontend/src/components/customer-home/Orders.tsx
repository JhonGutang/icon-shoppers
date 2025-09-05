"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useCustomerActions from "@/hooks/useCustomerActions";
import { ProductWithShop } from "@/types/product";
import { useEffect, useState } from "react";
import { useOrders } from "@/hooks/useOrders";
const Orders = () => {
  const { handleOrders } = useCustomerActions();
  const [orders, setOrders] = useState<ProductWithShop[]>();
  const [activeTab, setActiveTab] = useState<string | undefined>("all");
  const {handleStatusUpdate} = useOrders()
  const orderTabs = [
    { id: "all", label: "All" },
    { id: "ordered", label: "Ordered" },
    { id: "to_be_delivered", label: "To be Delivered" },
    { id: "delivered", label: "Delivered" },
    { id: "completed", label: "Completed" },
  ];

  const getStatusColor = (status: string | undefined) => {
    const statusColors = {
      ordered: "bg-yellow-100 text-yellow-700",
      to_be_delivered: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      default: "bg-gray-100 text-gray-700",
    };
    const normalized = (status || "")
      .toLowerCase()
      .replace(/\s+/g, "_");
    return statusColors[normalized as keyof typeof statusColors] || statusColors.default;
  };



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
        Loading Please Wait
      </div>
    );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6">
      <div className="flex justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">Your Orders</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {orderTabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              className={`whitespace-nowrap ${
                activeTab === tab.id ? "bg-green-600 hover:bg-green-700" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {orders.map((order, index) => (
        <Card key={index} className="mb-6 shadow-md">
          <CardContent className="p-5">
            <div className="flex flex-col gap-6">
              {/* Shop Name + Order Status */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="text-lg font-semibold">{order.shop.name}</div>
                <div
                  className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </div>
              </div>

              {/* Products List */}
              <div className="flex flex-col gap-4">
                {order.products.map((product) => (
                  <div key={product.id} className="flex items-center gap-4">
                    <img
                      src={`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${product.image}`}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-md border"
                    />
                    <div className="flex-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-600">
                        Quantity: {product.quantity}
                      </div>
                      <div className="text-sm text-gray-600">
                        Price: P{Number(product.price).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Items Summary</h4>
                    {order.products.map((product, idx) => (
                      <div key={idx} className="flex justify-between text-sm lg:pr-10">
                        <span>
                          {product.name} ({product.quantity}x)
                        </span>
                        <span>
                          P
                          {(
                            Number(product.price) * Number(product.quantity)
                          ).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Order Info</h4>
                    <div className="text-sm flex justify-between mb-2">
                      <span>Payment:</span>
                      <span>Cash on Delivery</span>
                    </div>
                    <div className="text-sm flex justify-between mb-2">
                      <span>Address:</span>
                      <span>Cash on Delivery</span>
                    </div>
                    <div className="text-sm font-bold flex justify-between">
                      <span>Total:</span>
                      <span>
                        P
                        {order.products
                          .reduce(
                            (sum, p) =>
                              sum + Number(p.price) * Number(p.quantity),
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {
              order.status === 'delivering' &&    <div className="flex justify-end gap-3 mt-4">
              <Button className="bg-green-600 hover:bg-white hover:text-green-700" onClick={() => handleStatusUpdate(String(order.order_id), 'completed')}>
                Received Order
              </Button>
            </div>
            }
         
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Orders;
