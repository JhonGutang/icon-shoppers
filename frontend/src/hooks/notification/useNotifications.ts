import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchNotifications, 
  fetchUnreadCount, 
  markAsRead, 
  markAllAsRead 
} from "@/services/notificationService";

export const useNotifications = (page = 1) => {
  return useQuery({
    queryKey: ["notifications", page],
    queryFn: () => fetchNotifications(page),
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: fetchUnreadCount,
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
