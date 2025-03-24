import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeClosed } from "lucide-react";
import React from "react";
import { Product } from "@/types/product";
import useProductAction from "@/hooks/useProductActions";
import useRedirectLink from "@/hooks/useRedirectLink";
import useAuth from "@/stores/useToken";
interface ProductCardProps {
  product: Product;
  location?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, location }) => {
  const shopId = useAuth((state) => state.shopId);
  const role = useAuth((state) => state.userType);
  const { redirectLink } = useRedirectLink();
  return (
    <Card
      className=" w-[40vw] py-3 lg:w-[20vw] lg:h-[40vh] lg:gap-3 gap-2 cursor-pointer"
      onClick={() => redirectLink(`profile/${product.id}`)}
    >
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            {product.name} {product.shop_name && product.shop_name}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <img
          src={
            product.image ??
            "https://i.pinimg.com/736x/c5/a0/03/c5a00375d647591a14dd36e31151acb1.jpg"
          }
          alt={product.name}
          className="w-full h-auto max-h-[140px] lg:max-h-[170px] object-cover rounded-xl"
        />
      </CardContent>
      <CardFooter className="h-[20%] block ">
        <div className="flex justify-between w-full items-center">
          <div>₱{product.price}</div>
          {shopId === product.shop_id &&
            location === "profile" &&
            role === "seller" && <Visibility product={product} />}
        </div>
        {Boolean(product.is_featured) && <div>Featured</div>}
      </CardFooter>
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

export default ProductCard;
