import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/orderService";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useSnackbar } from "@/components/context/SnackbarContext";
import { CheckoutPayload, OrderStatus } from "@/types/order";

export const useCheckoutMutation = () => {
  const queryClient = useQueryClient();
  const { openSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: CheckoutPayload) => orderService.checkout(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.CUSTOMER('ALL') });
      openSnackbar("Order placed successfully!", "success");
    },
    onError: (error: any) => {
      openSnackbar(error.message || "Failed to place order", "error");
    },
  });
};

export const useUpdateOrderStatusMutation = () => {
  const queryClient = useQueryClient();
  const { openSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: OrderStatus }) => 
      orderService.updateStatus(orderId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ORDERS.SELLER('ALL') });
      openSnackbar(`Order status updated to ${variables.status.replace('_', ' ')}`, "success");
    },
    onError: (error: any) => {
      openSnackbar(error.message || "Failed to update status", "error");
    },
  });
};
