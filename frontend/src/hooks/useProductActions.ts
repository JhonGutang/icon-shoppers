import {
  addProduct as addProductService,
  deleteProduct,
  fetchShopProducts,
  fetchSpecificProduct,
  updateProduct,
} from "@/services/productService";
import { toast } from "sonner";
import useToken from "@/stores/useToken";
import useProducts from "@/stores/useProducts";
import { newProduct, Product, ProductToUpdate } from "@/types/product";
import { useState } from "react";
import useRedirectLink from "./useRedirectLink";

const useProductAction = () => {
  const token = useToken.getState().accessToken;
  const { redirectLink} = useRedirectLink()
  const { products, setProducts, deleteProductById, addProduct, updateProductById } =
    useProducts();
  const [newProduct, setNewProduct] = useState<newProduct>({
    name: "",
    price: 0,
    quantity: 0,
  });
  const [product, setProduct] = useState<Product>()
  

  const handleFetchProducts = async () => {
    if (!token) return;
    try {
      const fetchedProducts = await fetchShopProducts(token);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFetchSpecificProduct = async (id: number) => {
    if (!token) return;
    const fetchedData = await fetchSpecificProduct(id, token);
    setProduct(fetchedData)
  }

  const handleAddProducts = async () => {
    if (!token) return;

    try {
      const newProductData = await addProductService(newProduct, token);
      addProduct(newProductData);
      setNewProduct({ name: "", price: 0, quantity: 0 });
      toast("Product Added Successfully");
    } catch (error) {
      console.error(error);
      toast("Attempt Product Add Failed");
    }
  };

  const handleUpdateProduct = async (updateData: ProductToUpdate, onLocalUpdate?: (product: Product) => void) => {
    if (!token) return;
    try {
      const updatedProduct = await updateProduct(updateData, token);
      updateProductById(updatedProduct.id, updatedProduct);
      if (onLocalUpdate) {
        onLocalUpdate(updatedProduct);
      }
      toast("Product updated successfully");
    } catch (error) {
      console.error(error);
      toast("Failed to update product");
    }
  };
  

  const handleDeleteProduct = async (id: number) => {
    if (!token) return;
    await deleteProduct(id, token);
    deleteProductById(id);
    toast("Product deleted");
    setTimeout(() => {
      redirectLink('profile')
    }, 1000);
  };

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  

  return {
    products,
    product,
    handleFetchProducts,
    handleFetchSpecificProduct,
    handleAddProducts,
    handleDeleteProduct,
    handleInputs,
    handleUpdateProduct,
  };
};

export default useProductAction;
