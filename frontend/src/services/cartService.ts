import axiosInstance from "@/hooks/useAxios";

export const cartService = {
  getCartItems: async () => {
    const response = await axiosInstance.get('/to-checkout');
    return response.data;
  },

  addToCart: async (productId: number, quantity = 1) => {
    const response = await axiosInstance.post(`/cart/${productId}`, { quantity });
    return response.data;
  },

  removeFromCart: async (productId: number) => {
    const response = await axiosInstance.delete(`/cart-item/${productId}`);
    return response.data;
  }
};

// Backward compatibility exports
export const addToCart = cartService.addToCart;
export const deleteOrderItem = cartService.removeFromCart;
export const fetchPendingOrders = cartService.getCartItems;
export const fetchPendingOrdersBasedOnShop = cartService.getCartItems;
