import axiosInstance from "@/hooks/useAxios";

export const fetchProductRatings = async(productId: number) => {
    const response = await axiosInstance.get(`/product-ratings/${productId}`)
    return response.data
}
export const rateProduct = async (
    productId: number,
    rate: number,
    feedback: string
  ) => {
    try {
      const response = await axiosInstance.post('/customer/product-ratings', {
        product_id: productId,
        rating: rate,
        feedback: feedback,
      });
  
      return response.data; 
    } catch (error) {
      console.error("Unexpected error:", error);
      return { error: 'unknown', message: 'Something went wrong.' };
    }
  }