import axiosInstance from "@/hooks/useAxios";
import { Category } from "@/types/product";

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await axiosInstance.get('/categories');
    return response.data;
  },

  getBySlug: async (slug: string): Promise<Category> => {
    const response = await axiosInstance.get(`/categories/${slug}`);
    return response.data;
  }
};
