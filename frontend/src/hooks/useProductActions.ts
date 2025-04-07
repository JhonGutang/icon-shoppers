import {
  addProduct as addProductService,
  deleteProduct,
  fetchAllProducts,
  fetchFeaturedProducts,
  fetchShopProducts,
  fetchSpecificProduct,
  updateProduct,
} from "@/services/productService";
import useToken from "@/stores/useAuthStore";
import useProducts from "@/stores/useProducts";
import { newProduct, Product, ProductToUpdate } from "@/types/product";
import { useState } from "react";
import useRedirectLink from "./useRedirectLink";
import { useSnackbar } from "@/components/context/SnackbarContext";

const useProductAction = () => {
  const token = useToken.getState().accessToken;
  const { redirectLink } = useRedirectLink();
  const { products, setProducts, deleteProductById, addProduct, updateProductById } = useProducts();
  const { openSnackbar } = useSnackbar(); // Use Snackbar

  const [newProduct, setNewProduct] = useState<newProduct>({
    name: "",
    price: 0,
    quantity: 0,
    image: undefined,
  });
  const [product, setProduct] = useState<Product>();

  const handleFetchAllProducts = async (type: string) => {
    return await fetchAllProducts(type);
  };

  const handleFetchFeaturedProducts = async () => {
    return await fetchFeaturedProducts();
  };

  const handleFetchShopProducts = async () => {
    if (!token) return;
    try {
      const fetchedProducts = await fetchShopProducts(token);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFetchSpecificProduct = async (id: number) => {
    const fetchedData = await fetchSpecificProduct(id);
    setProduct(fetchedData);
  };

  const handleAddProducts = async () => {
    if (!token) return;
    try {
      const newProductData = await addProductService(newProduct, token);
      addProduct(newProductData);
      setNewProduct({ name: "", price: 0, quantity: 0 });
      openSnackbar("Product Added Successfully", "success");
    } catch (error) {
      console.error(error);
      openSnackbar("Attempt to add product failed", "error");
    }
  };

  const handleUpdateProduct = async (updateData: ProductToUpdate, onLocalUpdate?: (product: Product) => void) => {
    if (!token) return;
    try {
      const updatedProduct = await updateProduct(updateData, token);
      if (onLocalUpdate) {
        onLocalUpdate(updatedProduct);
      }
      updateProductById(updatedProduct.id, updatedProduct);
      openSnackbar("Product updated successfully", "success");
    } catch (error) {
      console.error(error);
      openSnackbar("Failed to update product", "error");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!token) return;
    try {
      await deleteProduct(id, token);
      deleteProductById(id);
      openSnackbar("Product deleted", "success");
      setTimeout(() => {
        redirectLink("profile");
      }, 1000);
    } catch (error) {
      console.error(error);
      openSnackbar("Failed to delete product", "error");
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

    const updatedVisibility = !product.is_visible;
    const updatedProduct = { ...product, is_visible: updatedVisibility };

    try {
      await updateProductById(updatedProduct.id, updatedProduct);
      openSnackbar(`Product visibility is now ${updatedVisibility ? "visible" : "hidden"}`, "info");

      const productWithoutImage = { ...updatedProduct, image: null };
      await updateProduct(productWithoutImage, token);
    } catch (error) {
      console.error(error);
      openSnackbar("Failed to update product visibility", "error");
    }
  };

  const handleFeatureToggle = async (product: Product, onLocalUpdate?: (product: Product) => void) => {
    if (!token) return;

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
      await updateProduct(productWithoutImage, token);
    } catch (error) {
      console.error(error);
      openSnackbar("Feature toggle failed: Reverting Back", "error");
    }
  };

  return {
    products,
    product,
    newProduct,
    handleFetchAllProducts,
    handleFetchShopProducts,
    handleFetchFeaturedProducts,
    handleFetchSpecificProduct,
    handleAddProducts,
    handleDeleteProduct,
    handleInputs,
    handleUpdateProduct,
    handleProductVisibility,
    handleFeatureToggle,
  };
};

export default useProductAction;
