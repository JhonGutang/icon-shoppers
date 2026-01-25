import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import StarRating from "../Rating";
import {
  Package,
  Store,
  ShoppingCart,
  Loader2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Product } from "@/types/product";
import useRedirectLink from "@/hooks/useRedirectLink";
import RatingModal from "./RatingModal";
import { rateProduct, fetchProductRatings } from "@/services/ratingService";
import useToken from "@/stores/useAuthStore";
import { useSnackbar } from "../context/SnackbarContext";

interface ProductDetailsProps {
  product?: Product;
  isLoading: boolean;
  redirectAfterAdd: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Details({
  product,
  isLoading,
  redirectAfterAdd,
}: ProductDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ratings, setRating] = useState<{total: number, average: number}>({total: 0, average: 0})
  const { redirectLink } = useRedirectLink();
  const { openSnackbar } = useSnackbar();
  const token = useToken.getState().accessToken;

  const initializeRating = async () => {
    if (product?.id) {
      const data = await fetchProductRatings(product.id);
      console.log(data);
      setRating(data);
    }
  }

  useEffect(() => {
    initializeRating()
  }, [product?.id]);

  const handleRatingSubmit = async (rating: number, feedback: string) => {
    console.log("Rating submitted:", rating, feedback);
    if (product?.id && token) {
      const response = await rateProduct(product.id, rating, feedback);
      if (response.message) {
        openSnackbar(response.message, "error");
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="w-full p-5 md:p-8 lg:h-[55vh]">
      <div className="mb-6">
        <h1 className="capitalize text-2xl md:text-3xl font-bold text-gray-800">
          {product?.name}
        </h1>
        <div className="flex justify-between items-center mt-2 gap-1">
          <div className="flex gap-3 items-center">
            <StarRating initialRating={ratings.average} onChange={() => {}} readonly />
            <div>{ratings.total}</div>
          </div>
          <div>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => setIsModalOpen(true)}
            >
              Rate Product
            </Button>
          </div>
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

      <RatingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRatingSubmit}
        productId={product?.id || 0}
      />
    </div>
  );
}
