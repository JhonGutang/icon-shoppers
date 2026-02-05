import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/services/authService";
import { QUERY_KEYS } from "@/constants/queryKeys";

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: (formData: FormData) => updateProfile(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER.PROFILE });
        },
    });
};
