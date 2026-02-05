import { useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "@/services/wishlistService";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useSnackbar } from "@/components/shared/context/SnackbarContext";

export const useToggleWishlistMutation = () => {
  const queryClient = useQueryClient();
  const { openSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (productId: number) => wishlistService.toggleWishlist(productId),
    onMutate: async (productId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['products'] });
      await queryClient.cancelQueries({ queryKey: ['wishlist'] });

      // Snapshot the previous values
      // We don't snapshot EVERYTHING at once because setQueryData needs exact keys
      // Instead, we just rely on onSettled to fix everything if it fails
      
      // Optimistically update all product-related queries
      queryClient.setQueriesData({ queryKey: ['products'], exact: false }, (oldData: any) => {
        if (!oldData) return oldData;
        
        const updateProduct = (p: any) => {
          // Compare as strings to be safe against type mismatches
          if (String(p.id) === String(productId)) {
            return { ...p, is_in_wishlist: !p.is_in_wishlist };
          }
          return p;
        };

        if (Array.isArray(oldData)) {
          return oldData.map(updateProduct);
        }
        
        if (oldData.data && Array.isArray(oldData.data)) {
          return {
            ...oldData,
            data: oldData.data.map(updateProduct)
          };
        }

        if (oldData.id && String(oldData.id) === String(productId)) {
          return updateProduct(oldData);
        }

        return oldData;
      });

      // Optimistically remove from wishlist query if we're on the wishlist page
      queryClient.setQueriesData({ queryKey: ['wishlist'], exact: false }, (oldData: any) => {
        if (!oldData) return oldData;
        
        // Handle paginated response: { data: [...] }
        if (oldData.data && Array.isArray(oldData.data)) {
          return {
            ...oldData,
            data: oldData.data.filter((item: any) => String(item.product_id) !== String(productId))
          };
        }
        
        // Handle flat array response: [...]
        if (Array.isArray(oldData)) {
          return oldData.filter((item: any) => String(item.product_id) !== String(productId));
        }
        
        return oldData;
      });
    },
    onError: (error: any) => {
      openSnackbar(error.message || "Failed to update wishlist", "error");
    },
    onSuccess: (data) => {
      openSnackbar(data.message, "success");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
