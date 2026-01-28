import axiosInstance from "@/hooks/useAxios";

export const addToCart = async (productId: number) => {
    await axiosInstance.post(`cart/${productId}`);
}  

export const checkoutOrder = async (products: {id: number, quantity: number}[], data: { shipping_address?: string, notes?: string, payment_method?: string } = {}) => {
    await axiosInstance.post('checkout', { products, ...data });
}

export const deleteOrderItem = async (productId: number) => {
  try {
    await axiosInstance.delete(`cart-item/${productId}`);
  } catch (error) {
    throw new Error("Error deleting product");
  }
};

export const fetchPendingOrders = async() => {
    const response = await axiosInstance.get('to-checkout');
    return response.data;
}

export const fetchPendingOrdersBasedOnShop = async () => {
    const response = await axiosInstance.get('to-checkout');
    return response.data;
}
