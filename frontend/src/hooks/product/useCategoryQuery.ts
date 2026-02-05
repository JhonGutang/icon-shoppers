import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/categoryService";
import { QUERY_KEYS } from "@/constants/queryKeys";

export const useCategories = () => {
  return useQuery({
    queryKey: QUERY_KEYS.CATEGORIES.ALL,
    queryFn: () => categoryService.getAll(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};
