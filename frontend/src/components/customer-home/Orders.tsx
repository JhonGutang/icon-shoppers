"use client";
import CartNavbar from "@/components/mobile/CartNavbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useCustomerActions from "@/hooks/useCustomerActions";
import { ProductWithShop } from "@/types/product";
import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

const Orders = () => {
  const { handleOrdersStatus } = useCustomerActions();
  const [orders, setOrders] = useState<ProductWithShop[]>();

  const fetchOrders = async () => {
    const products = await handleOrdersStatus();
    setOrders(products);
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  return (
    <div className="w-full">
      <div className="flex justify-between px-10 mb-4">
        <div className="text-xl font-semibold">Orders</div>
        <div>
          <Button>All</Button>
        </div>
      </div>

      <div className="px-10">
        {orders?.map((order, index) => (
          <div key={index} className="mb-5">
            <div className="mb-1">{order.shop.name}</div>
            <div className="w-full">
              <Card>
                <CardContent className="flex flex-col lg:flex-row justify-between lg:items-center ">
                  <div className="lg:w-1/2 flex flex-col mb-7 lg:mb-0">
                    {order.products.map((product) => (
                      <div key={product.id} className="mb-2 w-full">
                        <div className="flex  items-center gap-2">
                          <div>
                            <img
                              src={`http://192.168.1.6:8000/storage/${product.image}`}
                              alt=""
                              className="w-[80px]"
                            />
                          </div>
                          <div>
                            <div>{product.name}</div>
                            <div>Quantity: {product.quantity}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between">
                      <div className="mb-2 text-lg font-semibold">
                        Order Summary
                      </div>
                      <div className="capitalize">{order.status}</div>
                    </div>
                    <div className="flex lg:flex-row flex-col gap-10">
                      <div className="px-3">
                        {order.products.map((product, index) => (
                          <div key={index} className="mb-2">
                            <div className="flex gap-3">
                              <div>{product.name}</div>
                              <div>{product.quantity}x</div>
                            </div>
                            <div>
                              P
                              {(
                                Number(product.price) * Number(product.quantity)
                              ).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="flex lg:flex-row flex-col lg:gap-10 mb-5 lg:mb-0">
                          <div>Address:</div>
                          <div className="text-end">Cash On Delivery</div>
                        </div>
                        <div className="flex lg:flex-row flex-col lg:gap-10 mb-5 lg:mb-0">
                          <div>Payment Method:</div>
                          <div className="text-end">Cash On Delivery</div>
                        </div>
                        <div className="flex lg:flex-row flex-col lg:gap-10">
                          <div>Total Amount</div>
                          <div className="text-end">
                            Total: P
                            {order.products
                              .reduce(
                                (total, product) =>
                                  total +
                                
                                  Number(product.price) *
                                    Number(product.quantity),
                                0
                              )
                              .toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
