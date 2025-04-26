import { useCartStore } from "@/stores/useCartStore";
import { Product, ProductInCart } from "@/types/product";
import {
  addToCart,
  checkoutOrder,
  fetchPendingOrders,
  fetchPendingOrdersBasedOnShop,
  removeToCart,
} from "@/services/customerService";
import useRedirectLink from "./useRedirectLink";
import useAuthStore from "@/stores/useAuthStore";
import { useSnackbar } from "@/components/context/SnackbarContext";
import { orderService } from "@/services/orderService";
const useCustomerActions = () => {
  const token = useAuthStore.getState().accessToken;
  const role = useAuthStore.getState().userType;
  const {
    addProduct,
    deleteProduct,
    setProductsToCheckout,
  } = useCartStore();
  const setProducts = useCartStore((state) => state.setProducts);
  const { redirectLink } = useRedirectLink();
  const { openSnackbar } = useSnackbar(); 

  const handleOrdersInCart = async () => {
    if (role === "seller") return;
    if (!token) return;
    const orders = await fetchPendingOrders(token);
    setProducts(orders);
  };

  const handleOrdersToCheckout = async () => {
    if (!token) return;
    const products = await fetchPendingOrdersBasedOnShop(token);
    return products;
  };

  const handleOrdersStatus = async (status: string) => {
    if(!token) return
    const products = await orderService.fetchCustomerOrders(token, status)
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
    console.log(product);
    addProduct(product);
    addToCart(product.id, token);
    openSnackbar("Product Added to Cart", "success"); 
  };

  const handleRemoveToCart = (id: number) => {
    if (!token) return;
    deleteProduct(id);
    removeToCart(id, token);
    openSnackbar("Product Removed from Cart", "warning"); 
  };

  const handleCheckout = (location: string, products?: ProductInCart[]) => {
    if (!token) return;
    if (location === "cart" && products) {
      setProductsToCheckout(products);
      redirectLink("checkout");
    }

    if (location === "checkout" && products) {
      console.log(products);
      const filteredProducts = products.map((product) => ({
        id: product.id,
        quantity: product.quantity,
      }));
      checkoutOrder(filteredProducts, token);
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
    handleOrdersStatus
  };
};

export default useCustomerActions;
