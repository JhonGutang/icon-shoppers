"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, MouseEvent } from "react";
import useProductAction from "@/hooks/useProductActions";
import useCustomerActions from "@/hooks/useCustomerActions";
import useRedirectLink from "@/hooks/useRedirectLink";
import CartNavbar from "@/components/mobile/CartNavbar";
import { Button } from "@/components/ui/button";
import { Loader2} from "lucide-react";
import { Product } from "@/types/product";

const ProductPage = () => {
  const { redirectLink } = useRedirectLink();
  const { handleAddToCart } = useCustomerActions();
  const { product, handleFetchSpecificProduct } = useProductAction();
  const { productName } = useParams();

  const id = Array.isArray(productName)
    ? productName[0]?.split(/[\s,_-]+/)[0]
    : productName?.split(/[\s,_-]+/)[0];

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      handleFetchSpecificProduct(Number(id));
    }
  }, []);

  const redirectAfterAdd = (event: MouseEvent<HTMLButtonElement>) => {
    if (!product) return;

    console.log(product);
    setIsLoading(true);
    handleAddToCart(event, product);
    redirectLink("/home");
    setIsLoading(false);
  };

  return (
    <div>
      <CartNavbar />
      <div className="px-10 mt-5 pb-[80px] max-h-[80vh] overflow-y-auto">
        <ProductDetails product={product} />
      </div>

      <Button
        className={`w-[90%] fixed bottom-5 left-1/2 transform -translate-x-1/2 h-[60px] z-10 bg-green-600 ${
          isLoading ? "bg-gray-400" : ""
        }`}
        onClick={redirectAfterAdd}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="animate-spin" size={30} />
            <span>Adding to Cart</span>
          </div>
        ) : (
          <span>Add To Cart</span>
        )}
      </Button>
    </div>
  );
};

const ProductDetails = ({ product }: { product?: Product }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { redirectLink } = useRedirectLink();

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="h-[30vh] border-2 px-4 rounded-xl">
        <img
          src={`http://192.168.1.6:8000/storage/${product?.image}`}
          alt={product?.name || "Product Image"}
          className="w-full h-full rounded-xl object-contain"
        />
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="capitalize text-2xl font-bold">{product?.name}</h1>
        <div className="flex items-center gap-3">
          <div className="font-semibold">{product?.shop_name}</div>
          <div>
            <Button variant="ghost" className="text-green-600" onClick={() => redirectLink(product?.shop_name || "")}>View Shop</Button>
          </div>
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? "max-h-full" : "max-h-[10vh]"
          }`}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat id
          ex, dolorum placeat repudiandae nulla dolorem ipsa! Quia quod tempora
          error quae nesciunt unde culpa iure voluptatum excepturi similique
          eveniet exercitationem magnam dolorum consequatur eaque, itaque
          doloribus. Vero, molestias placeat rerum suscipit vel tempora nam
          reiciendis cumque tenetur velit consectetur.
        </div>
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-500"
          >
            {isExpanded ? "See less" : "See more"}
          </button>
        </div>

        <div>
          <div className="flex gap-2 items-center">
            <span className="font-bold text-lg">Price:</span>
            <span>₱{product?.price}</span>
          </div>
          <div>Stocks: {product?.quantity}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
