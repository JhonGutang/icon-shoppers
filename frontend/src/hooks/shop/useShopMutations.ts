import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createShop, deleteShop } from "@/services/shopService";
import { QUERY_KEYS } from "@/constants/queryKeys";

export const useCreateShop = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (data: any) => createShop(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SHOPS.ALL });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.PROFILE }); // Invalidate profile to reflect new shop
        },
    });
};

export const useDeleteShop = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (credentials: { password: string, shop_name: string }) => deleteShop(credentials),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.SHOPS.ALL });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.PROFILE });
        },
    });
};
