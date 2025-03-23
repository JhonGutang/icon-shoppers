import { create } from 'zustand';
import { Product } from "@/types/product";

type ProductStore = {
  products: Product[];
  setProducts: (products: Product[]) => void;
  deleteProductById: (id: number) => void;
  addProduct: (product: Product) => void;
  updateProductById: (id: number, updatedProduct: Partial<Product>) => void;
};

const useProducts = create<ProductStore>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
  deleteProductById: (id) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
    })),
  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),
  updateProductById: (id, updatedProduct) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === id ? { ...product, ...updatedProduct } : product
      ),
    })),
}));

export default useProducts;
