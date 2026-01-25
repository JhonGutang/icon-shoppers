import axiosInstance from "@/hooks/useAxios";

export const addToCart = async (productId: number) => {
    await axiosInstance.post(`cart/${productId}`);
}  

export const checkoutOrder = async (products: {id: number, quantity: number}[]) => {
    await axiosInstance.post('checkout', {products});
}

export const removeToCart = async(productId: number) => {
    await axiosInstance.delete(`order/${productId}`);
}

export const fetchPendingOrders = async() => {
    const response = await axiosInstance.get('to-checkout');
    return response.data;
}

export const fetchPendingOrdersBasedOnShop = async () => {
    const response = await axiosInstance.get('to-checkout');
    return response.data;
}
