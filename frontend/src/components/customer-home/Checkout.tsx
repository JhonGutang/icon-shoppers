"use client";
import FallBackMessage from "@/components/FallBackMessage";
import { Checkbox } from "@/components/ui/checkbox";
import useCustomerActions from "@/hooks/useCustomerActions";
import { ProductWithShop } from "@/types/product";
import CheckoutContainer from "@/components/CheckoutContainer";
import React, { useEffect, useState } from "react";
import CheckoutPage from "@/components/mobile/CheckoutPage";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
const Checkout = () => {
  const isMobile = useIsMobile();
  const { handleOrdersToCheckout } = useCustomerActions();
  const [productsWithShops, setProductsWithShops] = useState<
    ProductWithShop[] | null
  >(null);
  const [checkedShops, setCheckedShops] = useState<{ [key: string]: boolean }>(
    {}
  );
  const router = useRouter();
  useEffect(() => {
    const fetchProducts = async () => {
      const products = await handleOrdersToCheckout();
      setProductsWithShops(products);

      if (products && products.length > 0) {
        setCheckedShops({
          [products[0].shop.id]: true,
        });
      }
    };
    fetchProducts();
  }, []);

  if (!productsWithShops)
    return (
      <div className="w-full h-screen flex justify-center items-center text-2xl">
        Loading Please Wait
      </div>
    );
  if (productsWithShops.length === 0)
    return (
      <div className="flex flex-col gap-2 items-center justify-center h-[80vh]">
        <div className="text-lg font-bold mb-5">Cart is Empty</div>
        <Button onClick={() => router.push("/search")}>
          Find Products you Fancy
        </Button>
      </div>
    );

  return (
    <div className="w-full">
      {isMobile ? (
        <CheckoutPage
          shopWithProducts={productsWithShops}
          setProductsWithShops={setProductsWithShops}
        />
      ) : (
        <div className="h-full flex gap-4">
          <Cart
            productsWithShops={productsWithShops}
            checkedShops={checkedShops}
            setCheckedShops={setCheckedShops}
          />

          <div className="w-full h-full overflow-y-auto">
            {productsWithShops.length === 0 && <FallBackMessage />}
            {productsWithShops
              .filter(
                (productsWithShop) => checkedShops[productsWithShop.shop.id]
              )
              .map((productsWithShop: ProductWithShop) => (
                <div key={productsWithShop.shop.id}>
                  <CheckoutContainer
                    products={productsWithShop.products}
                    shop={productsWithShop.shop}
                    productsWithShops={productsWithShops}
                    setProductsWithShops={setProductsWithShops}
                  />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface CartProps {
  productsWithShops: ProductWithShop[] | null;
  checkedShops: { [key: string]: boolean };
  setCheckedShops: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >;
}

const Cart: React.FC<CartProps> = ({
  productsWithShops,
  checkedShops,
  setCheckedShops,
}) => {


  return (
    <div className="w-[35vw] border-2 rounded-lg h-full p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Shops with Pending Orders</h2>
      <ul>
        {productsWithShops?.map(({ shop }) => (
          <li
            key={shop.id}
            className="mb-3 border-b pb-2 flex items-center justify-between px-5"
          >
            <div>
              <div className="font-semibold capitalize">{shop.name}</div>
              <div className="text-sm text-gray-500">{shop.contact_number}</div>
              <div className="text-sm text-gray-500">{shop.email}</div>
            </div>
            <div>
              <Checkbox
                checked={checkedShops[shop.id] || false}
                onCheckedChange={(checked) =>
                  setCheckedShops((prev) => ({
                    ...prev,
                    [shop.id]: checked as boolean,
                  }))
                }
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Checkout;
