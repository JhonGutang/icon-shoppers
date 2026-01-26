import { useCartStore } from "@/stores/useCartStore";
import { Product, ProductInCart } from "@/types/product";
import {
  addToCart,
  checkoutOrder,
  fetchPendingOrdersBasedOnShop,
  deleteOrderItem,
} from "@/services/customerService";
import useRedirectLink from "./useRedirectLink";
import useAuthStore from "@/stores/useAuthStore";
import { useSnackbar } from "@/components/context/SnackbarContext";
import { orderService } from "@/services/orderService";

const useCustomerActions = () => {
  const token = useAuthStore((state) => state.accessToken);
  const role = useAuthStore((state) => state.userType);
  const {
    addProduct,
    deleteProduct,
    setProductsToCheckout,
    fetchCart,
  } = useCartStore();
  
  const { redirectLink } = useRedirectLink();
  const { openSnackbar } = useSnackbar(); 

  const handleOrdersInCart = async () => {
    if (role === "merchant") return;
    if (!token) return;
    await fetchCart();
  };

  const handleOrdersToCheckout = async () => {
    if (!token) return;
    const products = await fetchPendingOrdersBasedOnShop();
    return products;
  };

  const handleOrders = async (status: string) => {
    if(!token) return
    const products = await orderService.fetchCustomerOrders(status)
    return products
  }

  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement>,
    product: Product
  ) => {
    e.stopPropagation();
    if (!token) {
      redirectLink("login");
      return;
    }
    addProduct(product);
    addToCart(product.id);
    openSnackbar("Product Added to Cart", "success"); 
  };

  const handleRemoveToCart = async (id: number) => {
    if (!token) return;
    try {
      deleteProduct(id);
      await deleteOrderItem(id);
      openSnackbar("Product Removed from Cart", "warning");
    } catch (error) {
      openSnackbar("Failed to remove item from cart", "error");
    }
  };

  const handleCheckout = async (location: string, products?: ProductInCart[], data?: any) => {
    if (!token) return;
    if (location === "cart" && products) {
      setProductsToCheckout(products);
      redirectLink("checkout");
    }

    if (location === "checkout" && products) {
      const filteredProducts = products.map((product) => ({
        id: product.id,
        quantity: product.quantity,
      }));
      await checkoutOrder(filteredProducts, data);
      openSnackbar("Your Order is Now Being Processed", "info"); 
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return {
    handleAddToCart,
    handleRemoveToCart,
    handleOrdersInCart,
    handleCheckout,
    handleOrdersToCheckout,
    handleOrders
  };
};

export default useCustomerActions;
