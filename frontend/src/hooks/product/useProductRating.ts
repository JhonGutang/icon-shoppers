import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProductRatings, rateProduct } from "@/services/ratingService";
import { useSnackbar } from "@/components/shared/context/SnackbarContext";

export const useProductRatings = (productId: number) => {
  return useQuery({
    queryKey: ["product-ratings", productId],
    queryFn: () => fetchProductRatings(productId),
    enabled: !!productId,
  });
};

export const useRateProductMutation = () => {
  const queryClient = useQueryClient();
  const { openSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({
      productId,
      rating,
      feedback,
    }: {
      productId: number;
      rating: number;
      feedback: string;
    }) => rateProduct(productId, rating, feedback),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-ratings", variables.productId] });
      queryClient.invalidateQueries({ queryKey: ["product-details"] });
      openSnackbar("Thank you for your feedback!", "success");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to submit rating";
      openSnackbar(message, "error");
    },
  });
};
