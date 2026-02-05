import axiosInstance from "@/hooks/shared/useAxios";
import { ShopAnalytics } from "@/types/shopAnalytics";

export const fetchShopAnalytics = async (): Promise<ShopAnalytics> => {
  const response = await axiosInstance.get("/shop/analytics");
  return response.data;
};
