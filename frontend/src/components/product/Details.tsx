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
import { Product, ProductVariant } from "@/types/product";
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
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ratings, setRating] = useState<{total: number, average: number}>({total: 0, average: 0})
  const { redirectLink } = useRedirectLink();
  const { openSnackbar } = useSnackbar();
  const token = useToken.getState().accessToken;

  const currentPrice = selectedVariant ? selectedVariant.price : product?.price;
  const currentStock = selectedVariant ? selectedVariant.stock : product?.quantity;

  const initializeRating = async () => {
    if (product?.id) {
      const data = await fetchProductRatings(product.id);
      setRating(data);
    }
  }

  useEffect(() => {
    initializeRating()
    if (product?.variants && product.variants.length > 0) {
        setSelectedVariant(null);
    }
  }, [product?.id]);

  const handleRatingSubmit = async (rating: number, feedback: string) => {
    if (product?.id && token) {
      const response = await rateProduct(product.id, rating, feedback);
      if (response.message) {
        openSnackbar(response.message, "error");
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="w-full p-5 md:p-8">
      <div className="mb-6">
        <h1 className="capitalize text-2xl md:text-3xl font-bold text-gray-800">
          {product?.name}
        </h1>
        <div className="flex justify-between items-center mt-2 gap-1">
          <div className="flex gap-3 items-center">
            <StarRating initialRating={ratings.average} onChange={() => {}} readonly />
            <div className="text-sm text-gray-500">{ratings.total} reviews</div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-green-600"
            onClick={() => setIsModalOpen(true)}
          >
            Rate This
          </Button>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 gap-3">
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-3xl text-green-700">
              ₱{currentPrice}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Package size={16} className="mr-2" />
            <span>
              {currentStock
                ? `${currentStock} available`
                : "Out of stock"}
            </span>
          </div>
        </div>
      </div>

      {/* Variants Section */}
      {product?.variants && product.variants.length > 0 && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Select Options</h3>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <Button
                key={v.id}
                variant={selectedVariant?.id === v.id ? "default" : "outline"}
                className={`rounded-full h-auto py-2 px-4 flex flex-col items-start ${selectedVariant?.id === v.id ? "bg-green-600" : "hover:border-green-600"}`}
                onClick={() => setSelectedVariant(v)}
              >
                <span className="text-xs">
                  {Object.entries(v.attributes).map(([k, val]) => `${k}: ${val}`).join(", ")}
                </span>
                <span className="font-bold">₱{v.price}</span>
              </Button>
            ))}
            <Button
                variant={!selectedVariant ? "default" : "outline"}
                className={`rounded-full h-auto py-2 px-4 flex flex-col items-start ${!selectedVariant ? "bg-green-600 text-white" : "hover:border-green-600"}`}
                onClick={() => setSelectedVariant(null)}
              >
                <span className="text-xs italic">Standard</span>
                <span className="font-bold">₱{product.price}</span>
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between py-4 border-t border-b border-gray-100 mb-8">
        <div className="flex items-center">
          <Store size={18} className="text-gray-400 mr-2" />
          <span className="font-medium text-gray-700">{product?.shop_name}</span>
        </div>
        <Button
          variant="link"
          className="text-green-600"
          onClick={() => redirectLink(product?.shop_name || "")}
        >
          Visit Shop
        </Button>
      </div>

      <div className="hidden md:block mb-8">
        <Button
          className={`px-12 h-14 rounded-full font-bold text-lg shadow-xl shadow-green-100 transition-all active:scale-95 ${
            isLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
          onClick={redirectAfterAdd}
          disabled={isLoading || (currentStock !== undefined && currentStock <= 0)}
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Loader2 className="animate-spin" size={24} />
              <span>Adding...</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <ShoppingCart size={20} />
              <span>Add to Cart</span>
            </div>
          )}
        </Button>
      </div>

      <div className="prose prose-sm text-gray-600">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Description</h3>
        <p className={`${!isExpanded && "line-clamp-3"}`}>
          {product?.description || "No description provided for this product."}
        </p>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-green-600 text-sm mt-3 font-semibold"
        >
          {isExpanded ? (
            <>
              Show less <ArrowUp size={16} className="ml-1" />
            </>
          ) : (
            <>
              Read more <ArrowDown size={16} className="ml-1" />
            </>
          )}
        </button>
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
