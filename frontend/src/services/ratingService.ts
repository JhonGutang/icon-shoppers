import axiosInstance from "@/hooks/useAxios";

export const fetchProductRatings = async(productId: number) => {
    const response = await axiosInstance.get(`/product-ratings/${productId}`)
    return response.data
}
export const rateProduct = async (
    productId: number,
    rate: number,
    feedback: string,
    token: string
  ) => {
    try {
      const response = await axiosInstance.post('/customer/product-ratings', {
        product_id: productId,
        rating: rate,
        feedback: feedback,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      return response.data; 
    } catch (error) {
      console.error(error)
      // if (error.response) {
        
      //   const status = error.response.status;
      //   const data = error.response.data;
  
      //   if (status === 409) {
      //     console.error("Duplicate rating:", data.message);
      //     return { error: 'conflict', message: data.message };
      //   }
      // }
  
      console.error("Unexpected error:", error);
      return { error: 'unknown', message: 'Something went wrong.' };
    }
  }