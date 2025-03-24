import { useCartStore } from "@/stores/useCartStore";
import { Product } from "@/types/product";
import { toast } from "sonner";
import { addToCart, fetchPendingOrders, removeToCart } from "@/services/customerService";
import useAuthStore from "@/stores/useAuthStore";

const useCustomerActions = () => {
  const token = useAuthStore.getState().accessToken
  const { addProduct, deleteProduct } = useCartStore();
  const setProducts = useCartStore((state) => state.setProducts);

  const handleOrdersInCart = async() => {
    if (!token) return
    const orders = await fetchPendingOrders(token)
    console.log(orders);
    setProducts(orders)
  }

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>, product: Product) => {
    if(!token) return
    addProduct(product);
    addToCart(product.id, token)
    toast("Product Added to Cart");
    e.stopPropagation();
  };
  
  const handleRemoveToCart = (id: number) => {
    if(!token) return
    deleteProduct(id)
    removeToCart(id, token)
    toast("Product Added to Cart");
  }

  const handleSubmitOrder = () => {
    // const simplifiedCart = productsInCart.map((product) => ({
    //   id: product.id,
    //   quantity: product.quantity,
    // }));
  };


  return {
    handleAddToCart,
    handleRemoveToCart,
    handleSubmitOrder,
    handleOrdersInCart
  };
};

export default useCustomerActions;
