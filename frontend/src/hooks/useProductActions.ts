import { Product } from "@/types/product";
import { useState } from "react";
import {
  addProduct as addProductService,
  fetchShopProducts,
} from "@/services/productService";
import { toast } from "sonner";
import useToken from "@/stores/useToken";

const useProductAction = () => {
  const token = useToken.getState().accessToken;
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product>({
    name: "",
    price: "",
    quantity: "",
  });

  const handleFetchProducts = async () => {
    if (!token) return;

    try {
      const products = await fetchShopProducts(token);
      setProducts(products);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAddProducts = async() => {
    if (!token) return;

    const newProduct =  await addProductService(product, token);
    setProducts(prevProducts => [...(prevProducts || []), newProduct]);
    toast('Product Added Successfully')

    setTimeout(() => {
      window.location.reload()
    }, 1000);
  };

  return {
    products,
    handleInputs,
    handleAddProducts,
    handleFetchProducts,
  };
};

export default useProductAction;
