"use client";
import FallBackMessage from "@/components/FallBackMessage";
import { Checkbox } from "@/components/ui/checkbox";
import useCustomerActions from "@/hooks/useCustomerActions";
import { ProductWithShop } from "@/types/product";
import CheckoutContainer from "@/components/CheckoutContainer";
import React, { useEffect, useState } from "react";
import CheckoutPage from "@/components/mobile/CheckoutPage";
const Checkout = () => {
  const { handleOrdersToCheckout } = useCustomerActions();
  const [productsWithShops, setProductsWithShops] = useState<
    ProductWithShop[] | null
  >(null);
  const [checkedShops, setCheckedShops] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkViewport();
    window.addEventListener("resize", checkViewport);

    return () => window.removeEventListener("resize", checkViewport);
  }, []);

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

  if (!productsWithShops) return <div>Loading...</div>;

  return (
    <div>
      {isMobile ? (
        <CheckoutPage
          shopWithProducts={productsWithShops}
          setProductsWithShops={setProductsWithShops}
        />
      ) : (
        <div className="h-screen flex">
          <Cart
            productsWithShops={productsWithShops}
            checkedShops={checkedShops}
            setCheckedShops={setCheckedShops}
          />

          <div className="w-full h-screen overflow-y-auto">
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
  if (!productsWithShops || productsWithShops.length === 0) {
    return (
      <div className="w-[35vw] border-2 border-black h-full p-4">
        <div className="text-center mt-10">No pending orders.</div>
      </div>
    );
  }

  return (
    <div className="w-[35vw] border-2 border-black h-full p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Shops with Pending Orders</h2>
      <ul>
        {productsWithShops.map(({ shop }) => (
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
