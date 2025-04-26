"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, MouseEvent } from "react";
import useProductAction from "@/hooks/useProductActions";
import useCustomerActions from "@/hooks/useCustomerActions";
import useRedirectLink from "@/hooks/useRedirectLink";
import CartNavbar from "@/components/mobile/CartNavbar";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ShoppingCart,
} from "lucide-react";
import { Product } from "@/types/product";
import Feedback from "@/components/Feedback";
import Details from "@/components/product/Details";

const ProductPage = () => {
  const { redirectLink } = useRedirectLink();
  const { handleAddToCart } = useCustomerActions();
  const { product, handleFetchSpecificProduct } = useProductAction();
  const { productName } = useParams();

  const id = Array.isArray(productName)
    ? productName[0]?.split(/[\s,_-]+/)[0]
    : productName?.split(/[\s,_-]+/)[0];

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (id) {
      handleFetchSpecificProduct(Number(id));
    }
  }, []);

  const redirectAfterAdd = (event: MouseEvent<HTMLButtonElement>) => {
    if (!product) return;

    setIsLoading(true);
    handleAddToCart(event, product);
    redirectLink("/home");
    setIsLoading(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20 md:pb-0">
      <CartNavbar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="md:grid md:grid-cols-12 md:gap-8">
            <div className="md:col-span-5 lg:col-span-4">
              <ProductImage product={product} />
            </div>

            <div className="md:col-span-7 lg:col-span-8">
              <div className="flex border-b mb-6">
                <button
                  className={`px-4 py-4 font-medium text-sm cursor-pointer ${
                    activeTab === "details"
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </button>
                <button
                  className={`px-4 py-4 font-medium text-sm cursor-pointer ${
                    activeTab === "reviews"
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Ratings & Reviews
                </button>
              </div>

              {activeTab === "details" ? (
                <Details
                  product={product}
                  isLoading={isLoading}
                  redirectAfterAdd={redirectAfterAdd}
                />
              ) : (
                <ProductReviews />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-3 border-t md:hidden">
        <Button
          className={`w-full h-14 rounded-lg font-medium text-lg ${
            isLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
          onClick={redirectAfterAdd}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="animate-spin" size={24} />
              <span>Adding to Cart</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <ShoppingCart size={20} />
              <span>Add To Cart</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

const ProductImage = ({ product }: { product?: Product }) => {
  return (
    <div className="relative bg-gray-100 h-80 md:h-full md:min-h-96">
      <div className="h-full flex items-center justify-center p-4 md:p-8">
        <img
          src={
            product?.image
              ? `${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${product.image}`
              : "https://i.pinimg.com/736x/fd/3d/8e/fd3d8e2a1dd4f09b4170d31e26913bab.jpg"
          }
          alt={product?.name || "Product Image"}
          className="h-full object-contain md:max-h-96"
        />
      </div>

      {product?.quantity && product.quantity < 10 && (
        <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
          Only {product.quantity} left
        </div>
      )}
    </div>
  );
};



const ProductReviews = () => {
  return (
    <div className="w-full p-5 md:p-8 lg:h-[55vh] ">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="py-4">
            <div className="space-y-4">
              {/* <div className="flex items-center gap-3">
                <span className="text-gray-600">Rate this product:</span>
                <StarRating
                  initialRating={2}
                  onChange={(rating) => console.log(rating)}
                />
              </div> */}
              <div className="pt-2">
                <Feedback />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
