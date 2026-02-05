import axiosInstance from "@/hooks/shared/useAxios";

export interface Notification {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: {
    order_id?: number;
    order_number?: string;
    buyer_name?: string;
    status?: string;
    conversation_id?: number;
    sender_id?: number;
    sender_name?: string;
    message_preview?: string;
    message: string;
    type: 'order_placed' | 'order_status_changed' | 'new_message';
  };
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export const fetchNotifications = async (page = 1) => {
  const response = await axiosInstance.get(`notifications?page=${page}`);
  return response.data;
};

export const fetchUnreadCount = async () => {
  const response = await axiosInstance.get("notifications/unread-count");
  return response.data;
};

export const markAsRead = async (id: string) => {
  const response = await axiosInstance.post(`notifications/${id}/read`);
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await axiosInstance.post("notifications/read-all");
  return response.data;
};
