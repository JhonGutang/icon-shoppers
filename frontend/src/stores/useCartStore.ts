import { Product, ProductInCart } from "@/types/product";
import { create } from "zustand";
import { fetchPendingOrders } from "@/services/customerService";

// Extend product with quantity
type CartStore = {
  productsInCart: ProductInCart[];
  productsToCheckout: ProductInCart[];
  addProduct: (product: Product, quantity?: number) => void;
  deleteProduct: (id: number) => void;
  clearProducts: () => void;
  addQuantity: (id: number) => void;
  minusQuantity: (id: number) => void;
  setProducts: (products: ProductInCart[]) => void;
  setProductsToCheckout: (products: ProductInCart[]) => void;
  clearProductsToCheckout: () => void;
  fetchCart: () => Promise<void>;
};

export const useCartStore = create<CartStore>((set) => ({
  productsInCart: [],
  productsToCheckout: [],
  addProduct: (product, quantity = 1) =>
    set((state) => {
      const existingProduct = state.productsInCart.find(
        (p) => p.id === product.id
      );
      if (existingProduct) {
        return {
          productsInCart: state.productsInCart.map((p) =>
            p.id === product.id ? { ...p, quantity: p.quantity + quantity } : p
          ),
        };
      } else {
        return {
          productsInCart: [...state.productsInCart, { ...product, quantity }],
        };
      }
    }),
  deleteProduct: (id) =>
    set((state) => ({
      productsInCart: state.productsInCart.filter(
        (product) => product.id !== id
      ),
    })),
  clearProducts: () => set({ productsInCart: [] }),
  addQuantity: (id) =>
    set((state) => ({
      productsInCart: state.productsInCart.map((product) =>
        product.id === id
          ? { ...product, quantity: product.quantity + 1 }
          : product
      ),
    })),
  minusQuantity: (id) =>
    set((state) => ({
      productsInCart: state.productsInCart
        .map((product) =>
          product.id === id
            ? { ...product, quantity: product.quantity - 1 }
            : product
        )
        .filter((product) => product.quantity > 0),
    })),
  setProducts: (products) => set({ productsInCart: products }),
  setProductsToCheckout: (products) => set({ productsToCheckout: products }),
  clearProductsToCheckout: () => set({ productsToCheckout: [] }),
  fetchCart: async () => {
    try {
      const orders = await fetchPendingOrders();
      set({ productsInCart: orders });
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  }
}));
