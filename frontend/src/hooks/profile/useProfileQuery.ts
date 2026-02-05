import { useQuery } from "@tanstack/react-query";
import { getProfile } from "@/services/authService";
import { QUERY_KEYS } from "@/constants/queryKeys";

export const useProfile = () => {
  return useQuery({
    queryKey: QUERY_KEYS.USER.PROFILE,
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
