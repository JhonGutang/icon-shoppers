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
        <div className="flex gap-2">
          <ShoppingCart />
          <div>Cart</div>
        </div>
        <div>
          <Button>All</Button>
        </div>
      </div>

      <div className="px-10">
        <Card className="py-0">
          <CardContent className="py-0">
            <Accordion type="single" collapsible>
              {orders?.map((order, index) => (
                <div key={index}>
                  <AccordionItem value={String(index)}>
                    <AccordionTrigger className="capitalize">
                      <div>
                        {" "}
                        {order.shop.name} -{" "}
                        {order.status === "approved"
                          ? "Processing"
                          : order.status}{" "}
                      </div>
                      <div>Total: ₱{order.total_amount}</div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {order.products.map((product) => (
                        <div key={product.id} className="flex gap-2 mb-2">
                          <img
                            src={`http://localhost:8000/storage/${product.image}`}
                            alt=""
                            className="w-[20vw] rounded-lg"
                          />
                          <div>
                            <div>
                              {product.name} - {product.quantity}x
                            </div>
                            <div>Total: ₱{product.price}</div>
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </div>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Orders;
