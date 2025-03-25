import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Minus, Plus, ShoppingCart, Trash } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import useCustomerActions from "@/hooks/useCustomerActions";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { ProductInCart } from "@/types/product";

interface CartProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onOpenChange }) => {
  const { productsInCart, addQuantity, minusQuantity } = useCartStore();
  const { handleCheckout,  handleRemoveToCart } = useCustomerActions();

  const [selectedProducts, setSelectedProducts] = useState<ProductInCart[]>([]);

  const handleCheckboxChange = (product: ProductInCart, checked: boolean) => {
    if (checked) {
      setSelectedProducts((prev) => [...prev, product]);
    } else {
      setSelectedProducts((prev) =>
        prev.filter((item) => item.id !== product.id)
      );
    }
  };

  useEffect(() => console.log(selectedProducts), [selectedProducts]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl flex gap-2 items-center">
            Cart <ShoppingCart />
          </SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
          <div className="h-[70vh] overflow-y-auto pr-4 pt-4">
            {productsInCart.map((product) => (
              <div key={product.id} className="mb-4">
                <Card>
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle>{product.name}</CardTitle>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveToCart(product.id)}
                    >
                      <Trash />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div>
                      ₱
                      {(
                        Number(product.price) * Number(product.quantity)
                      ).toFixed(2)}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex gap-4 items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => minusQuantity(product.id)}
                      >
                        <Minus />
                      </Button>
                      <div> {product.quantity} </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => addQuantity(product.id)}
                      >
                        <Plus />
                      </Button>
                    </div>

                    <Checkbox
                      checked={selectedProducts.some(
                        (item) => item.id === product.id
                      )}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(product, Boolean(checked))
                      }
                    />
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
          <div className="mt-5 w-full">
            <Button
              className="w-full h-[60px]"
              onClick={() => handleCheckout('cart', selectedProducts)}
            >
              Checkout
            </Button>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
