import {
  addProduct as addProductService,
  deleteProduct,
  fetchAllProducts,
  fetchShopProducts,
  fetchSpecificProduct,
  updateProduct,
} from "@/services/productService";
import useToken from "@/stores/useAuthStore";
import useProducts from "@/stores/useProducts";
import { newProduct, Product } from "@/types/product";
import { useState } from "react";
import useRedirectLink from "./useRedirectLink";
import { useSnackbar } from "@/components/context/SnackbarContext";

const useProductAction = () => {
  const token = useToken.getState().accessToken;
  const { redirectLink } = useRedirectLink();
  const { products, setProducts, deleteProductById, addProduct, updateProductById } = useProducts();
  const { openSnackbar } = useSnackbar(); 

  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState<newProduct>({
    name: "",
    price: 0,
    quantity: 0,
    image: undefined,
  });
  const [product, setProduct] = useState<Product>();

  const handleFetchAllProducts = async (type: string) => {
    setLoading(true);
    try {
        const result = await fetchAllProducts(type);
        return result;
    } finally {
        setLoading(false);
    }
  };


  const handleFetchShopProducts = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const fetchedProducts = await fetchShopProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error(error);
    } finally {
        setLoading(false);
    }
  };

  const handleFetchSpecificProduct = async (id: number) => {
    setLoading(true);
    try {
        const fetchedData = await fetchSpecificProduct(id);
        setProduct(fetchedData);
    } finally {
        setLoading(false);
    }
  };

  const handleAddProducts = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const newProductData = await addProductService(newProduct);
      addProduct(newProductData);
      setNewProduct({ name: "", price: 0, quantity: 0 });
      openSnackbar("Product Added Successfully", "success");
    } catch (error) {
      console.error(error);
      openSnackbar("Attempt to add product failed", "error");
    } finally {
        setLoading(false);
    }
  };


  const handleDeleteProduct = async (id: number) => {
    if (!token) return;
    setLoading(true);
    try {
      await deleteProduct(id);
      deleteProductById(id);
      openSnackbar("Product deleted", "success");
      setTimeout(() => {
        redirectLink("profile");
      }, 1000);
    } catch (error) {
      console.error(error);
      openSnackbar("Failed to delete product", "error");
    } finally {
        setLoading(false);
    }
  };

  const handleInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, type, value, files } = e.target;

    if (type === "file" && files && files[0]) {
      setNewProduct((prev) => ({
        ...prev,
        [id]: files[0],
      }));
    } else {
      setNewProduct((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleProductVisibility = async (
    event: React.MouseEvent<HTMLButtonElement>,
    product: Product
  ) => {
    event.stopPropagation();
    if (!token) return;
    setLoading(true);

    const updatedVisibility = !product.is_visible;
    const updatedProduct = { ...product, is_visible: updatedVisibility };

    try {
      await updateProductById(updatedProduct.id, updatedProduct);
      openSnackbar(`Product visibility is now ${updatedVisibility ? "visible" : "hidden"}`, "info");

      const productWithoutImage = { ...updatedProduct, image: null };
      await updateProduct(productWithoutImage.id, productWithoutImage);
    } catch (error) {
      console.error(error);
      openSnackbar("Failed to update product visibility", "error");
    } finally {
        setLoading(false);
    }
  };

  const handleFeatureToggle = async (product: Product, onLocalUpdate?: (product: Product) => void) => {
    if (!token) return;
    setLoading(true);

    const updatedProductFeature = { ...product, is_featured: !product.is_featured };

    try {
      if (onLocalUpdate) {
        onLocalUpdate(updatedProductFeature);
        openSnackbar(
          updatedProductFeature.is_featured ? "Product Now Featured" : "Product removed from Featured",
          "success"
        );
      }

      const productWithoutImage = { ...updatedProductFeature, image: null };

      await updateProduct( productWithoutImage.id, productWithoutImage);
    } catch (error) {
      console.error(error);
      openSnackbar("Feature toggle failed: Reverting Back", "error");
    } finally {
        setLoading(false);
    }
  };

  return {
    products,
    product,
    newProduct,
    loading,
    handleFetchAllProducts,
    handleFetchShopProducts,
    handleFetchSpecificProduct,
    handleAddProducts,
    handleDeleteProduct,
    handleInputs,
    handleProductVisibility,
    handleFeatureToggle,
  };
};

export default useProductAction;
