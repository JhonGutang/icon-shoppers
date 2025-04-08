import useCustomerActions from "@/hooks/useCustomerActions";
import { ProductInCart, ProductWithShop, Shop } from "@/types/product";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Minus, Plus, Trash } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

interface CheckoutContainerProps {
  products: ProductInCart[];
  shop: Shop;
  productsWithShops: ProductWithShop[];
  setProductsWithShops: React.Dispatch<
    React.SetStateAction<ProductWithShop[] | null>
  >;
}

const CheckoutContainer: React.FC<CheckoutContainerProps> = ({
  products,
  shop,
  setProductsWithShops,
}) => {
  const { handleCheckout, handleRemoveToCart } = useCustomerActions();

  const handleRemoveProduct = async (productId: number) => {
    await handleRemoveToCart(productId);

    setProductsWithShops((prev) => {
      if (!prev) return prev;

      return prev
        .map((shopData) => {
          if (shopData.shop.id === shop.id) {
            const filteredProducts = shopData.products.filter(
              (p) => p.id !== productId
            );
            return { ...shopData, products: filteredProducts };
          }
          return shopData;
        })
        .filter((shopData) => shopData.products.length > 0);
    });
  };

  const handleQuantityChange = (
    productId: number,
    type: "increment" | "decrement"
  ) => {
    setProductsWithShops((prev) => {
      if (!prev) return prev;
      return prev.map((shopData) => {
        if (shopData.shop.id === shop.id) {
          const updatedProducts = shopData.products.map((product) => {
            if (product.id === productId) {
              const newQuantity =
                type === "increment"
                  ? product.quantity + 1
                  : product.quantity > 1
                  ? product.quantity - 1
                  : 1;
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

  const totalAmount = products.reduce((sum, product) => {
    return sum + Number(product.price) * Number(product.quantity);
  }, 0);

  return (
    <div className="w-full h-full">
      <div className="h-[56vh] flex ">
        <div className="flex-1/5 overflow-y-auto">
          {products.map((product, index) => (
            <div key={index}>
              <Card className="mb-3">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{product.name}</CardTitle>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveProduct(product.id)}
                    >
                      <Trash />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleQuantityChange(product.id, "decrement")
                        }
                      >
                        <Minus />
                      </Button>
                      <span className="w-6 text-center">
                        {product.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleQuantityChange(product.id, "increment")
                        }
                      >
                        <Plus />
                      </Button>
                    </div>
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

        <div className="flex-1 px-3 ">
          <Card className="h-full py-5">
            <CardHeader>
              <CardTitle>Shop Detail</CardTitle>
              <CardContent className="px-2 mt-3">
                <div className="mb-3">
                  <img src={`http://192.168.1.6:8000/storage/${shop.logo_image}`} alt="" className="rounded-lg mb-3" />
                  <div className="text-2xl capitalize">{shop.name}</div>
                  <div className="text-sm">{shop.email}</div>
                  <div className="text-sm">{shop.contact_number}</div>
                </div>
                <div className="max-h-[25vh] overflow-y-auto">
                  {shop.description}
                </div>
              </CardContent>
              <CardFooter className="flex mt-5">
                <Button className="w-full bg-green-600">View Shop</Button>
              </CardFooter>
            </CardHeader>
          </Card>
        </div>
      </div>
      <div className="h-full p-4">
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
                    <Label
                      htmlFor="gcash"
                      className="opacity-50 cursor-not-allowed"
                    >
                      GCASH
                    </Label>
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
            <Button className="bg-green-600" onClick={() => handleCheckout("checkout", products)}>
              Checkout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutContainer;
