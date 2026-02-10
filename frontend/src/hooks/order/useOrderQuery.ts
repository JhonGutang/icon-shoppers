import { QUERY_KEYS } from "@/constants/queryKeys";
import { orderService } from "@/services/orderService";
import { OrderStatus } from "@/types/order";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useCustomerOrders = (status = "ALL", page = 1) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ORDERS.CUSTOMER(status), page],
    queryFn: () => orderService.getCustomerOrders(status, page),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useInfiniteCustomerOrders = (status = "ALL", per_page = 5) => {
  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.ORDERS.CUSTOMER(status), "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      orderService.getCustomerOrders(status, pageParam, per_page),
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.meta?.current_page ?? lastPage.current_page;
      const lastPageNum = lastPage.meta?.last_page ?? lastPage.last_page;

      if (currentPage < lastPageNum) {
        return currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
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

export const useSellerOrders = (status = "ALL", page = 1) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ORDERS.SELLER(status), page],
    queryFn: () => orderService.getSellerOrders(status, page),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: number;
      status: OrderStatus;
    }) => orderService.updateStatus(orderId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
