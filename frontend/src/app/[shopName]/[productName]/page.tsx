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
  Store,
  Package,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { Product } from "@/types/product";
import StarRating from "@/components/Rating";
import Feedback from "@/components/Feedback";

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
                  className={`px-4 py-4 font-medium text-sm ${
                    activeTab === "details"
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </button>
                <button
                  className={`px-4 py-4 font-medium text-sm ${
                    activeTab === "reviews"
                      ? "text-green-600 border-b-2 border-green-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Ratings & Reviews
                </button>
              </div>

              {activeTab === 'details' ? (
                <ProductDetails
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

const ProductDetails = ({
  product,
  isLoading,
  redirectAfterAdd,
}: {
  product?: Product;
  isLoading: boolean;
  redirectAfterAdd: (event: MouseEvent<HTMLButtonElement>) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { redirectLink } = useRedirectLink();

  return (
    <div className="w-full p-5 md:p-8 lg:h-[55vh]">
      <div className="mb-6">
        <h1 className="capitalize text-2xl md:text-3xl font-bold text-gray-800">
          {product?.name}
        </h1>
        <div className="flex items-center mt-2 gap-1">
          <StarRating initialRating={0} onChange={() => {}} readonly />
          <span className="text-gray-500 text-sm">(32 reviews)</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 gap-3">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-2xl md:text-3xl text-gray-900">
              ₱{product?.price}
            </span>
          </div>

          <div className="flex items-center text-sm md:text-base text-gray-500">
            <Package size={16} className="mr-2" />
            <span>
              {product?.quantity
                ? `${product.quantity} in stock`
                : "Out of stock"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-4 border-t border-b border-gray-100 mb-6">
        <div className="flex items-center">
          <Store size={18} className="text-gray-500 mr-2" />
          <span className="font-medium">{product?.shop_name}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-green-600 border-green-600 hover:bg-green-50"
          onClick={() => redirectLink(product?.shop_name || "")}
        >
          View Shop
        </Button>
      </div>

      <div className="hidden md:block mb-8">
        <Button
          className={`px-8 h-12 rounded-lg font-medium text-base ${
            isLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
          onClick={redirectAfterAdd}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="animate-spin" size={20} />
              <span>Adding to Cart</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <ShoppingCart size={18} />
              <span>Add To Cart</span>
            </div>
          )}
        </Button>
      </div>

      <div className="mt-6">
        <div className="py-4">
          <div
            className={`overflow-hidden transition-all duration-300 text-gray-600 ${
              isExpanded ? "max-h-full" : "max-h-32 md:max-h-48"
            }`}
          ></div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-green-600 text-sm mt-2 font-medium"
          >
            {isExpanded ? (
              <>
                See less <ArrowUp size={16} className="ml-1" />
              </>
            ) : (
              <>
                See more <ArrowDown size={16} className="ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
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
