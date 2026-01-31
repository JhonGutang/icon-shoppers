import axiosInstance from "@/hooks/useAxios";

export const getConversations = async () => {
    const response = await axiosInstance.get("/conversations");
    return response.data;
};

export const getConversationMessages = async (id: number) => {
    const response = await axiosInstance.get(`/conversations/${id}`);
    return response.data;
};

export const getPaginatedMessages = async (id: number, page: number = 1) => {
    const response = await axiosInstance.get(`/conversations/${id}/messages?page=${page}`);
    return response.data;
};

export const sendMessage = async (conversationId: number, body: string) => {
    const response = await axiosInstance.post(`/conversations/${conversationId}/messages`, { body });
    return response.data;
};
