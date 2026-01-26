import { useQuery } from "@tanstack/react-query";
import { productService, SearchFilters } from "@/services/productService";
import { QUERY_KEYS } from "@/constants/queryKeys";

export const useProducts = (filters: SearchFilters = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.LIST(filters),
    queryFn: () => productService.getProducts(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProductDetails = (slug: string | number) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.DETAILS(slug),
    queryFn: () => productService.getProductDetails(slug),
    staleTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!slug,
  });
};

export const useFeaturedProducts = (page = 1) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.PRODUCTS.FEATURED, page],
    queryFn: () => productService.getFeaturedProducts(page),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useRelatedProducts = (id: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.RELATED(id),
    queryFn: () => productService.getRelatedProducts(id),
    staleTime: 60 * 60 * 1000, // 1 hour
    enabled: !!id,
  });
};
