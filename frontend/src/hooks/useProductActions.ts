import { useState, useCallback } from "react";
import useToken from "@/stores/useAuthStore";
import { newProduct, Product } from "@/types/product";
import useRedirectLink from "./useRedirectLink";
import { useSnackbar } from "@/components/context/SnackbarContext";
import { 
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct, 
  useToggleProductVisibility, 
  useToggleProductFeatured 
} from "./queries/useProductsQuery";

const useProductAction = () => {
  const token = useToken.getState().accessToken;
  const { redirectLink } = useRedirectLink();
  const { openSnackbar } = useSnackbar(); 

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const visibilityMutation = useToggleProductVisibility();
  const featuredMutation = useToggleProductFeatured();

  const [newProduct, setNewProduct] = useState<newProduct>({
    name: "",
    price: 0,
    quantity: 0,
    image: undefined,
  });

  const handleAddProducts = useCallback(async () => {
    if (!token) return;
    
    try {
      await createMutation.mutateAsync(newProduct);
      setNewProduct({ name: "", price: 0, quantity: 0 });
      openSnackbar("Product Added Successfully", "success");
    } catch (error) {
      console.error(error);
      openSnackbar("Attempt to add product failed", "error");
    }
  }, [token, newProduct, createMutation, openSnackbar]);


  const handleDeleteProduct = useCallback(async (id: number) => {
    if (!token) return;
    
    try {
      await deleteMutation.mutateAsync(id);
      openSnackbar("Product deleted", "success");
    } catch (error) {
      console.error(error);
      openSnackbar("Failed to delete product", "error");
    }
  }, [token, deleteMutation, openSnackbar, redirectLink]);

  const handleInputs = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, []);

  const handleProductVisibility = useCallback(async (
    event: React.MouseEvent<HTMLButtonElement>,
    product: Product
  ) => {
    event.stopPropagation();
    if (!token) return;

    const updatedVisibility = !product.is_visible;

    try {
      await visibilityMutation.mutateAsync({ id: product.id, is_visible: updatedVisibility });
      openSnackbar(`Product visibility is now ${updatedVisibility ? "visible" : "hidden"}`, "info");
    } catch (error) {
      console.error(error);
      openSnackbar("Failed to update product visibility", "error");
    }
  }, [token, visibilityMutation, openSnackbar]);

  const handleFeatureToggle = useCallback(async (product: Product) => {
    if (!token) return;

    const updatedFeatured = !product.is_featured;

    try {
      await featuredMutation.mutateAsync({ id: product.id, is_featured: updatedFeatured });
      openSnackbar(
        updatedFeatured ? "Product Now Featured" : "Product removed from Featured",
        "success"
      );
    } catch (error) {
      console.error(error);
      openSnackbar("Feature toggle failed", "error");
    }
  }, [token, featuredMutation, openSnackbar]);

  const handleUpdateProduct = useCallback(async (id: number, updatedData: any) => {
    if (!token) return;
    
    try {
      await updateMutation.mutateAsync({ id, data: updatedData });
      openSnackbar("Product updated successfully", "success");
    } catch (error) {
      console.error(error);
      openSnackbar("Failed to update product", "error");
      throw error;
    }
  }, [token, updateMutation, openSnackbar]);

  return {
    newProduct,
    loading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending || visibilityMutation.isPending || featuredMutation.isPending,
    handleAddProducts,
    handleDeleteProduct,
    handleInputs,
    handleProductVisibility,
    handleFeatureToggle,
    handleUpdateProduct,
  };
};

export default useProductAction;
