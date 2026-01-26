import axiosInstance from "@/hooks/useAxios";
import { WishlistItem, PaginatedResponse } from "@/types/product";

export const wishlistService = {
  getWishlist: async (page = 1, per_page = 20): Promise<PaginatedResponse<WishlistItem>> => {
    const response = await axiosInstance.get('/wishlist', { params: { page, per_page } });
    return response.data;
  },

  toggleWishlist: async (productId: number): Promise<{ status: 'added' | 'removed'; message: string }> => {
    const response = await axiosInstance.post('/wishlist/toggle', { product_id: productId });
    return response.data;
  },

  removeFromWishlist: async (productId: number): Promise<void> => {
    await axiosInstance.delete(`/wishlist/${productId}`);
  }
};
