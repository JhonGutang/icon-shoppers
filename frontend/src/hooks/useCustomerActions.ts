import { useCartStore } from "@/stores/useCartStore";
import { Product, ProductInCart } from "@/types/product";
import { toast } from "sonner";
import {
  addToCart,
  checkoutOrder,
  fetchPendingOrders,
  fetchPendingOrdersBasedOnShop,
  removeToCart,
} from "@/services/customerService";
import useRedirectLink from "./useRedirectLink";
import useAuthStore from "@/stores/useAuthStore";

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

  const handleOrdersInCart = async () => {
    if (role === "seller") return;
    if (!token) return;
    const orders = await fetchPendingOrders(token);
    setProducts(orders);
  };

  const handleOrdersToCheckout = async() => {
    if (!token) return
    const products = await fetchPendingOrdersBasedOnShop(token)
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
    addToCart(product.id, token);
    toast("Product Added to Cart");
  };

  const handleRemoveToCart = (id: number) => {
    if (!token) return;
    deleteProduct(id);
    removeToCart(id, token);
    toast("Product Removed from Cart");
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
        order_id: product.order_id,
        quantity: product.quantity,
      }));
      checkoutOrder(filteredProducts, token)
      toast('Your Order is Now Being Processed')
      setTimeout(() => {
        window.location.reload()
      }, 1500);
    }
  };

  return {
    handleAddToCart,
    handleRemoveToCart,
    handleOrdersInCart,
    handleCheckout,
    handleOrdersToCheckout
  };
};

export default useCustomerActions;
