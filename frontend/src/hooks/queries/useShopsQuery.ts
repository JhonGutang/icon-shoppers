import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { fetchAllShops, fetchSpecificShop, ShopFilters } from "@/services/shopService";
import { QUERY_KEYS } from "@/constants/queryKeys";

export const useShops = (filters: ShopFilters = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.SHOPS.LIST(filters),
    queryFn: () => fetchAllShops(filters),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });
};

export const useInfiniteShops = (filters: ShopFilters = {}) => {
  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.SHOPS.ALL, 'infinite', filters],
    queryFn: ({ pageParam }) => fetchAllShops({ ...filters, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.current_page ?? lastPage.meta?.current_page;
      const lastPageNum = lastPage.last_page ?? lastPage.meta?.last_page;
      
      if (currentPage < lastPageNum) {
        return currentPage + 1;
      }
      return undefined;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useShopDetails = (name: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.SHOPS.DETAILS(name),
    queryFn: () => fetchSpecificShop(name),
    enabled: !!name,
    staleTime: 10 * 60 * 1000,
  });
};
