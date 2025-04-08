"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeClosed, ShoppingCart, Store } from "lucide-react";
import React from "react";
import { Product } from "@/types/product";
import useProductAction from "@/hooks/useProductActions";
import useAuthStore from "@/stores/useAuthStore";
import useCustomerActions from "@/hooks/useCustomerActions";
import useRedirectLink from "@/hooks/useRedirectLink";
interface ProductCardProps {
  product: Product;
  location?: string;
  shopName?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  location,
  shopName,
}) => {
  const { redirectLink } = useRedirectLink();
  const shopId = useAuthStore((state) => state.id);
  const role = useAuthStore((state) => state.userType);
  const isProductOwner =
    shopId === product.shop_id && location === "profile" && role === "seller";

  return (
    <Card
      className="relative w-[42vw] pt-0 pb-3 lg:w-[20vw] lg:gap-3 rounded-xl cursor-pointer shadow-2xl border-2 border-gray-300"
      onClick={() => {
        if (role === "seller") {
          window.location.href = `/profile/${product.id}`;
        } else {
          redirectLink(shopName || product.shop_name!, `${product.id} ${product.name}`);
        }
      }}
    >
      {role === "customer" && <AddToCart product={product} />}

      {Boolean(product.is_featured) && (
        <div className="absolute top-2 left-2 text-xs text-white bg-green-600 text-center w-20 rounded-full py-1 z-10">Featured</div>
      )}

      <CardContent className="flex flex-col gap-3 items-center justify-center px-0 w-full h-[80%]">
        <img
          src={
            product.image
              ? `http://127.0.0.1:8000/storage/${product.image}`
              : "https://i.pinimg.com/736x/c5/a0/03/c5a00375d647591a14dd36e31151acb1.jpg"
          }
          alt={product.name}
          className="w-full h-full object-cover lg:rounded-t-xl rounded-t-xl"
        />
        <div className="w-full px-3 py-1">
          <div className="text-xs flex justify-between lg:text-lg font-semibold">
            <div>
              <div className="font-bold">{product.name}</div>

              {product.shop_name && (
                <div className="text-xs flex items-center gap-1 mt-2">
                  <div>
                    <Store size={15} />
                  </div>
                  {product.shop_name}
                </div>
              )}
            </div>
            <div>{isProductOwner && <Visibility product={product} />}</div>
          </div>
          <div className="text-md font-bold w-full text-end">
            ₱{product.price}
          </div>
          {role !== "seller" && <AddToCart product={product} />}
        </div>
      </CardContent>
    </Card>
  );
};

const Visibility: React.FC<{ product: Product }> = ({ product }) => {
  const { handleProductVisibility } = useProductAction();
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={(event) => handleProductVisibility(event, product)}
    >
      {product.is_visible ? <Eye /> : <EyeClosed />}
    </Button>
  );
};

const AddToCart: React.FC<{ product: Product }> = ({ product }) => {
  const { handleAddToCart } = useCustomerActions();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={(event) => handleAddToCart(event, product)}
      className="absolute top-2 right-2 z-10  shadow-lg"
    >
      <ShoppingCart />
    </Button>
  );
};

export default ProductCard;
