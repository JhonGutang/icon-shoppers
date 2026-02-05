import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/services/orderService";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { useSnackbar } from "@/components/shared/context/SnackbarContext";
import { CheckoutPayload, OrderStatus } from "@/types/order";

export const useCheckoutMutation = () => {
  const queryClient = useQueryClient();
  const { openSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (payload: CheckoutPayload) => orderService.checkout(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CART.ALL });
      // Invalidate all customer orders
      queryClient.invalidateQueries({ queryKey: ['orders', 'customer'] });
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
      queryClient.invalidateQueries({ queryKey: ['orders', 'seller'] });
      openSnackbar(`Order status updated to ${variables.status.replace('_', ' ')}`, "success");
    },
    onError: (error: any) => {
      openSnackbar(error.message || "Failed to update status", "error");
    },
  });
};
