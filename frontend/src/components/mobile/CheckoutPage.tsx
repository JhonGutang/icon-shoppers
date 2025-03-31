import CartNavbar from "./CartNavbar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { ProductWithShop } from "@/types/product";
import { Card } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import {
  MinusSquareIcon,
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
  const {redirectLink} = useRedirectLink()
  return (
    <div className="w-full">
      <CartNavbar />
      <div className="flex justify-between items-center px-10">
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
          <Button onClick={() => redirectLink('/')}>Find Products you Fancy</Button>
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
      <Accordion type="single" collapsible>
        {shopWithProducts.map((shopData) => {
          const { shop, products } = shopData;

          return (
            <AccordionItem
              key={shop.id}
              value={`shop-${shop.id}`}
              className="mb-2"
            >
              <Card className="p-0 px-5">
                <AccordionTrigger className="text-lg font-semibold">
                  {shop.name}
                </AccordionTrigger>
                <AccordionContent>
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex gap-10 border-2 px-5 py-3 mb-3 rounded-lg shadow-xl"
                    >
                      <div className="flex gap-3 items-center w-1/2">
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
                        <img
                          src={`http://localhost:8000/storage/${product.image}`}
                          alt={product.name}
                          className="w-[20vw] rounded-lg"
                        />
                      </div>
                      <div className="w-full">
                        <div className="flex justify-between items-center">
                          <div className="text-lg font-semibold">
                            {product.name}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleRemoveProduct(shop.id, product.id)
                            }
                          >
                            <Trash size={15} color="red" />
                          </Button>
                        </div>
                        <div className="flex gap-2 items-center mt-2">
                            <MinusSquareIcon size={20} onClick={() =>
                              handleQuantityChange(
                                shop.id,
                                product.id,
                                "decrement"
                              )
                            } />
                          <div className="text-lg">{product.quantity}</div>
                            <PlusSquareIcon size={20}  onClick={() =>
                              handleQuantityChange(
                                shop.id,
                                product.id,
                                "increment"
                              )
                            } />
                        </div>
                        <div className="mt-2">Total:</div>
                        <div className="text-end text-lg font-semibold">
                          ₱
                          {(Number(product.price) * product.quantity).toFixed(
                            2
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </Card>
            </AccordionItem>
          );
        })}
      </Accordion>
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
