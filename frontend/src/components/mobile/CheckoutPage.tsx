import CartNavbar from "./CartNavbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { ProductWithShop } from "@/types/product";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import {
  MinusCircle,
  MinusSquareIcon,
  PlusCircle,
  PlusSquareIcon,
  Trash,
} from "lucide-react";
import { Button } from "../ui/button";
import useCustomerActions from "@/hooks/useCustomerActions";
import { useState } from "react";
import useRedirectLink from "@/hooks/useRedirectLink";

interface CheckoutPageProps {
  shopWithProducts: ProductWithShop[];
  setProductsWithShops: React.Dispatch<
    React.SetStateAction<ProductWithShop[] | null>
  >;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({
  shopWithProducts,
  setProductsWithShops,
}) => {
  const { redirectLink } = useRedirectLink();
  return (
    <div className="w-full">
      <div className="flex justify-between items-center px-6">
        <div className="text-xl font-semibold">Cart</div>
        <div>{shopWithProducts?.length || 0}</div>
      </div>
      {shopWithProducts?.length ? (
        <CartContent
          shopWithProducts={shopWithProducts}
          setProductsWithShops={setProductsWithShops}
        />
      ) : (
        <div className="flex flex-col gap-2 items-center justify-center h-[80vh]">
          <div className="text-lg font-bold mb-5">Cart is Empty</div>
          <Button onClick={() => redirectLink("/")}>
            Find Products you Fancy
          </Button>
        </div>
      )}
    </div>
  );
};

interface CartContentProps {
  shopWithProducts: ProductWithShop[];
  setProductsWithShops: React.Dispatch<
    React.SetStateAction<ProductWithShop[] | null>
  >;
}

const CartContent: React.FC<CartContentProps> = ({
  shopWithProducts,
  setProductsWithShops,
}) => {
  const { handleCheckout, handleRemoveToCart } = useCustomerActions();
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  const handleRemoveProduct = async (shopId: number, productId: number) => {
    await handleRemoveToCart(productId);
    setProductsWithShops((prev) => {
      if (!prev) return prev;
      return prev
        .map((shopData) => {
          if (shopData.shop.id === shopId) {
            const filteredProducts = shopData.products.filter(
              (p) => p.id !== productId
            );
            return { ...shopData, products: filteredProducts };
          }
          return shopData;
        })
        .filter((shopData) => shopData.products.length > 0);
    });

    setSelectedProducts((prev) => prev.filter((id) => id !== productId));
  };

  const handleQuantityChange = (
    shopId: number,
    productId: number,
    type: "increment" | "decrement"
  ) => {
    setProductsWithShops((prev) => {
      if (!prev) return prev;
      return prev.map((shopData) => {
        if (shopData.shop.id === shopId) {
          const updatedProducts = shopData.products.map((product) => {
            if (product.id === productId) {
              const newQuantity =
                type === "increment"
                  ? product.quantity + 1
                  : Math.max(1, product.quantity - 1);
              return { ...product, quantity: newQuantity };
            }
            return product;
          });
          return { ...shopData, products: updatedProducts };
        }
        return shopData;
      });
    });
  };


  const totalAmount = shopWithProducts
    .flatMap((shopData) => shopData.products)
    .filter((p) => selectedProducts.includes(p.id))
    .reduce(
      (sum, product) => sum + Number(product.price) * product.quantity,
      0
    );

  return (
    <div className="w-full px-8 mt-5 pb-[80px]">
      <div className="">
        {shopWithProducts.map((shopData) => {
          const { shop, products } = shopData;
          return (
            <div key={shop.id}>
              <div className="flex justify-between mb-3">
                <div className="text-xl">{shop.name}</div>
                <div>{products.length}</div>
              </div>

              <div>
                {products.map((product) => (
                  <div key={product.id} className="mb-3">
                    <Card className="py-5">
                      <CardContent className="px-3">
                        <div className="flex items-center justify-between">
                          <div className="flex w-full items-center gap-2 pl-2">
                          <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={(checked) =>
                            setSelectedProducts((prev) =>
                              checked === true
                                ? [...prev, product.id]
                                : prev.filter((id) => id !== product.id)
                            )
                          }
                        />
                            <div className="w-full flex items-center gap-3">
                              <img
                                src={`http://192.168.1.6:8000/storage/${product.image}`}
                                alt={product.name}
                                className="w-[80px]"
                              />

                              <div className="w-full">
                                <div className="flex justify-end">
                                  <Trash
                                    color="red"
                                    onClick={() =>
                                      handleRemoveProduct(shop.id, product.id)
                                    }
                                  />
                                </div>
                                <div>
                                  <div>{product.name}</div>
                                  <div className="text-sm">
                                    P{product.price}
                                  </div>
                                </div>
                                <div className="flex justify-end items-center  w-full gap-3 mb-3">
                                  <MinusCircle
                                    size={33}
                                    onClick={() =>
                                      handleQuantityChange(shop.id, product.id, "decrement")
                                    }
                                  />
                                  <div>{product.quantity}</div>
                                  <PlusCircle
                                    size={33}
                                    onClick={() =>
                                      handleQuantityChange(shop.id, product.id, "increment")
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Fixed Bottom Section */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-md border-t py-4 px-8 flex flex-col justify-between items-center">
        <div className="flex justify-between w-full mb-5">
          <div className="text-lg font-semibold">Total Amount</div>
          <div className="text-xl">₱{totalAmount.toFixed(2)}</div>
        </div>
        <Button
          className="w-full h-[60px]"
          onClick={() =>
            handleCheckout(
              "checkout",
              shopWithProducts
                .flatMap((shop) => shop.products)
                .filter((p) => selectedProducts.includes(p.id))
            )
          }
          disabled={selectedProducts.length === 0}
        >
          Checkout
        </Button>
      </div>
    </div>
  );
};


export default CheckoutPage;
