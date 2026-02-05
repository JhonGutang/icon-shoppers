import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService, SearchFilters } from "@/services/productService";
import { Product } from "@/types/product";
import { QUERY_KEYS } from "@/constants/queryKeys";

export const useProducts = (filters: SearchFilters = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.LIST(filters),
    queryFn: () => productService.getProducts(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useInfiniteProducts = (filters: SearchFilters = {}) => {
  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.PRODUCTS.ALL, 'infinite', filters],
    queryFn: ({ pageParam }) => productService.getProducts({ ...filters, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.current_page ?? lastPage.meta?.current_page;
      const lastPageNum = lastPage.last_page ?? lastPage.meta?.last_page;
      
      if (currentPage < lastPageNum) {
        return currentPage + 1;
      }
      return undefined;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes for infinite scrolling
    gcTime: 30 * 60 * 1000, // 30 minutes
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

// Merchant specific hooks
export const useMerchantProducts = () => {
  return useQuery({
    queryKey: QUERY_KEYS.PRODUCTS.SHOP,
    queryFn: () => productService.getMerchantProducts(),
    staleTime: 5 * 60 * 1000,
  });
};



export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData | any) => productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.SHOP });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData | any }) => 
      productService.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.SHOP });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.DETAILS(variables.id) });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.SHOP });
    },
  });
};

export const useToggleProductVisibility = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_visible }: { id: number; is_visible: boolean }) => 
      productService.updateProduct(id, { is_visible }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.SHOP });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.DETAILS(variables.id) });
    },
  });
};

export const useToggleProductFeatured = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_featured }: { id: number; is_featured: boolean }) => 
      productService.updateProduct(id, { is_featured }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.SHOP });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRODUCTS.DETAILS(variables.id) });
    },
  });
};
