import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/orderService";
import { QUERY_KEYS } from "@/constants/queryKeys";

export const useCustomerOrders = (status = 'ALL', page = 1) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ORDERS.CUSTOMER(status), page],
    queryFn: () => orderService.getCustomerOrders(status, page),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useOrderDetails = (orderNumber: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.ORDERS.DETAILS(orderNumber),
    queryFn: () => orderService.getOrderDetails(orderNumber),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!orderNumber,
  });
};

export const useSellerOrders = (status = 'ALL', page = 1) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ORDERS.SELLER(status), page],
    queryFn: () => orderService.getSellerOrders(status, page),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};
