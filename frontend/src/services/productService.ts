import axiosInstance from "@/hooks/shared/useAxios";
import { Product, PaginatedResponse } from "@/types/product";

export interface SearchFilters {
  category_id?: number;
  min_price?: number;
  max_price?: number;
  rating?: number;
  sort?: string;
  query?: string;
  page?: number;
  per_page?: number;
}

const objectToFormData = (obj: any): FormData => {
  const formData = new FormData();
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined && obj[key] !== null) {
      if (obj[key] instanceof File) {
        formData.append(key, obj[key]);
      } else if (typeof obj[key] === 'boolean') {
        formData.append(key, obj[key] ? '1' : '0');
      } else {
        formData.append(key, obj[key].toString());
      }
    }
  });
  return formData;
};

export const productService = {
  // Public Customer Operations
  getProducts: async (filters: SearchFilters = {}): Promise<PaginatedResponse<Product>> => {
    const response = await axiosInstance.get('/products/all', { params: filters });
    return response.data;
  },

  getFeaturedProducts: async (page = 1, per_page = 20): Promise<PaginatedResponse<Product>> => {
    const response = await axiosInstance.get('/products/featured', { params: { page, per_page } });
    return response.data;
  },

  getTopSellingProducts: async (page = 1, per_page = 20): Promise<PaginatedResponse<Product>> => {
    const response = await axiosInstance.get('/products/top-selling', { params: { page, per_page } });
    return response.data;
  },

  getProductDetails: async (slug: string | number): Promise<Product> => {
    const response = await axiosInstance.get(`/products/${slug}`);
    return response.data;
  },

  getRelatedProducts: async (id: number): Promise<Product[]> => {
    const response = await axiosInstance.get(`/products/${id}/related`);
    return response.data;
  },

  getProductsByCategory: async (categoryId: number, filters: SearchFilters = {}): Promise<PaginatedResponse<Product>> => {
    const response = await axiosInstance.get(`/products/category/${categoryId}`, { params: filters });
    return response.data;
  },

  // Merchant Operations
  getMerchantProducts: async (): Promise<Product[]> => {
    const response = await axiosInstance.get('/merchant/products');
    return response.data;
  },

  createProduct: async (data: FormData | any): Promise<Product> => {
    const formData = data instanceof FormData ? data : objectToFormData(data);
    const response = await axiosInstance.post('/merchant/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateProduct: async (id: number, data: FormData | any): Promise<Product> => {
    const formData = data instanceof FormData ? data : objectToFormData(data);
    // Add _method=PUT because Laravel often requires POST with _method=PUT for multipart updates
    if (!(data instanceof FormData) || !formData.has('_method')) {
        formData.append('_method', 'PUT');
    }
    
    const response = await axiosInstance.post(`/merchant/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/merchant/products/${id}`);
  }
};

// Export individual functions for backward compatibility if needed
export const fetchShopProducts = productService.getMerchantProducts;
export const fetchAllProducts = (type: string) => productService.getProducts({ sort: type === 'featured' ? 'popular' : 'newest' });
export const searchProducts = (query: string) => productService.getProducts({ query });
export const fetchSpecificProduct = productService.getProductDetails;
export const addProduct = productService.createProduct;
export const updateProduct = productService.updateProduct;
export const deleteProduct = productService.deleteProduct;
