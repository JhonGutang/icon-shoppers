import { useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "@/services/wishlistService";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useSnackbar } from "@/components/context/SnackbarContext";

export const useToggleWishlistMutation = () => {
  const queryClient = useQueryClient();
  const { openSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (productId: number) => wishlistService.toggleWishlist(productId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.WISHLIST.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.ALL });
      openSnackbar(data.message, "success");
    },
    onError: (error: any) => {
      openSnackbar(error.message || "Failed to update wishlist", "error");
    },
  });
};
