"use client";
import FallBackMessage from "@/components/FallBackMessage";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import useCustomerActions from "@/hooks/useCustomerActions";
import { ProductInCart, ProductWithShop, Shop } from "@/types/product";
import React, { useEffect, useState } from "react";

const Checkout = () => {
  const { handleOrdersToCheckout } = useCustomerActions();
  const [productsWithShops, setProductsWithShops] = useState<
    ProductWithShop[] | null
  >(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await handleOrdersToCheckout();
      setProductsWithShops(products);
    };
    fetchProducts();
  }, []);

  if (!productsWithShops) return <div>Loading...</div>;

  return (
    <div className="h-screen flex">
      <Cart />
      <div className="w-full h-screen overflow-y-auto">
        {productsWithShops.length === 0 && <FallBackMessage />}
        {productsWithShops.map((productsWithShop: ProductWithShop) => (
          <div key={productsWithShop.shop.id}>
            <CheckoutContainer
              products={productsWithShop.products}
              shop={productsWithShop.shop}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const Cart = () => {
  return <div className="w-[35vw] border-2 border-black h-full"></div>;
};

interface CheckoutContainerProps {
  products: ProductInCart[];
  shop: Shop;
}

const CheckoutContainer: React.FC<CheckoutContainerProps> = ({
  products,
  shop,
}) => {
  const { handleCheckout } = useCustomerActions();

  const totalAmount = products.reduce((sum, product) => {
    return sum + Number(product.price) * Number(product.quantity);
  }, 0);

  return (
    <div className="w-full h-full mt-8">
      <div className="h-[56vh] flex gap-5 mb-5">
        <div className=" flex-1/5 p-6 overflow-y-auto">
          {products.map((product, index) => (
            <div key={index}>
              <Card className="mb-3">
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <div>{product.quantity}x</div>
                    <div>
                      ₱
                      {(
                        Number(product.price) * Number(product.quantity)
                      ).toFixed(2)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className=" flex-1 px-3 py-2">
          <Card className="h-full py-5">
            <CardHeader>
              <CardTitle>Shop Detail</CardTitle>
              <CardContent className="px-2 mt-3">
                <div className="mb-3">
                  <div className="text-2xl capitalize">{shop.name}</div>
                  <div className="text-sm">{shop.email}</div>
                  <div className="text-sm">{shop.contact_number}</div>
                </div>
                <div className="max-h-[25vh] overflow-y-auto">
                  {shop.description}
                </div>
              </CardContent>
              <CardFooter className="flex mt-5">
                <Button className="w-full">View Shop</Button>
              </CardFooter>
            </CardHeader>
          </Card>
        </div>
      </div>
      <div className="h-[35vh] p-5">
        <Card className="h-auto">
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent className="px-7">
            <div className="flex justify-between mb-5">
              <div>Payment Method:</div>
              <div>
                <RadioGroup defaultValue="cod">
                  <div className="flex gap-5 justify-between">
                    <Label htmlFor="cod">Cash on Delivery</Label>
                    <RadioGroupItem value="cod" id="cod" />
                  </div>
                  <div className="flex gap-5 justify-between">
                    <Label htmlFor="gcash" className="opacity-50 cursor-not-allowed">GCASH</Label>
                    <RadioGroupItem value="gcash" id="gcash" disabled />
                  </div>
                </RadioGroup>
              </div>
            </div>
            <div className="flex justify-between">
              <div>Total Amount:</div>
              <div>₱{totalAmount.toFixed(2)}</div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={() => handleCheckout("checkout", products)}>
              Checkout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
