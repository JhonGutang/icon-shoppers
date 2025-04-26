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
import useRedirectLink from "@/hooks/useRedirectLink";

interface CheckoutContainerProps {
  products: ProductInCart[];
  shop: Shop;
  productsWithShops: ProductWithShop[];
  setProductsWithShops: React.Dispatch<React.SetStateAction<ProductWithShop[] | null>>;
}

const CheckoutContainer: React.FC<CheckoutContainerProps> = ({
  products,
  shop,
  setProductsWithShops,
}) => {
  const { handleCheckout, handleRemoveToCart } = useCustomerActions();
  const { redirectLink } = useRedirectLink()
  const handleRemoveProduct = async (productId: number) => {
    await handleRemoveToCart(productId);
    setProductsWithShops((prev) => {
      if (!prev) return prev;
      return prev
        .map((shopData) => {
          if (shopData.shop.id === shop.id) {
            const filteredProducts = shopData.products.filter((p) => p.id !== productId);
            return { ...shopData, products: filteredProducts };
          }
          return shopData;
        })
        .filter((shopData) => shopData.products.length > 0);
    });
  };

  const handleQuantityChange = (productId: number, type: "increment" | "decrement") => {
    setProductsWithShops((prev) => {
      if (!prev) return prev;
      return prev.map((shopData) => {
        if (shopData.shop.id === shop.id) {
          const updatedProducts = shopData.products.map((product) => {
            if (product.id === productId) {
              const newQuantity = type === "increment" 
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

  const totalAmount = products.reduce((sum, product) => 
    sum + Number(product.price) * Number(product.quantity), 0
  );

  const commonButtonStyles = "variant-outline size-icon";
  const commonFlexStyles = "flex items-center justify-between";
  const commonCardStyles = "h-full";

  return (
    <div className="w-full h-full">
      <div className="h-[56vh] flex">
        <div className="flex-1/5 overflow-y-auto">
          {products.map((product, index) => (
            <Card key={index} className="mb-3">
              <CardHeader>
                <div className={commonFlexStyles}>
                  <CardTitle>{product.name}</CardTitle>
                  <Button
                  variant="outline"
                    className={commonButtonStyles}
                    onClick={() => handleRemoveProduct(product.id)}
                  >
                    <Trash color="red"/>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className={commonFlexStyles}>
                  <img
                    src={`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${product.image}`}
                    alt={product.name}
                    className="w-[100px]"
                  />
                  <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        className={commonButtonStyles}
                        onClick={() => handleQuantityChange(product.id, "decrement")}
                      >
                        <Minus />
                      </Button>
                      <span className="w-6 text-center">{product.quantity}</span>
                      <Button
                        variant="outline"
                        className={commonButtonStyles}
                        onClick={() => handleQuantityChange(product.id, "increment")}
                      >
                        <Plus />
                      </Button>
                    </div>
                    <div>₱{(Number(product.price) * Number(product.quantity)).toFixed(2)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex-1 px-3">
          <Card className={commonCardStyles}>
            <CardHeader>
              <CardTitle>Shop Detail</CardTitle>
              <CardContent className="px-2 mt-3">
                <div className="mb-3">
                  <img
                    src={`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${shop.logo_image}`}
                    alt={shop.name}
                    className="rounded-lg mb-3"
                  />
                  <div className="text-2xl capitalize">{shop.name}</div>
                  <div className="text-sm">{shop.email}</div>
                  <div className="text-sm">{shop.contact_number}</div>
                </div>
                <div className="max-h-[25vh] overflow-y-auto">{shop.description}</div>
              </CardContent>
              <CardFooter className="flex">
                <Button className="w-full bg-green-600"  onClick={() => redirectLink(shop.name)}>View Shop</Button>
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
            <div className={commonFlexStyles}>
              <div>Payment Method:</div>
              <RadioGroup defaultValue="cod">
                <div className="flex gap-5 justify-between">
                  <Label htmlFor="cod">Cash on Delivery</Label>
                  <RadioGroupItem value="cod" id="cod" />
                </div>
                <div className="flex gap-5 justify-between">
                  <Label htmlFor="gcash" className="opacity-50 cursor-not-allowed">
                    GCASH
                  </Label>
                  <RadioGroupItem value="gcash" id="gcash" disabled />
                </div>
              </RadioGroup>
            </div>
            <div className={commonFlexStyles}>
              <div>Total Amount:</div>
              <div>₱{totalAmount.toFixed(2)}</div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              className="bg-green-600"
              onClick={() => handleCheckout("checkout", products)}
            >
              Checkout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutContainer;
