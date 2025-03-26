import {
  addProduct as addProductService,
  deleteProduct,
  fetchAllProducts,
  fetchFeaturedProducts,
  fetchShopProducts,
  fetchSpecificProduct,
  updateProduct,
} from "@/services/productService";
import { toast } from "sonner";
import useToken from "@/stores/useAuthStore";
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
    image: undefined,
  });
  const [product, setProduct] = useState<Product>()
  
  const handleFetchAllProducts = async() => {
    const products = await fetchAllProducts()
    return products
  }

  const handleFetchFeaturedProducts = async() => {
    const featured = await fetchFeaturedProducts()
    return featured
  }

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
    // if (!token) return;
    const fetchedData = await fetchSpecificProduct(id);
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
      if (onLocalUpdate) {
        onLocalUpdate(updatedProduct);
      }
      updateProductById(updatedProduct.id, updatedProduct);
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
    const updatedProduct = {
      ...product,
      is_visible: updatedVisibility,
    };
  
    try {
      await updateProductById(updatedProduct.id, updatedProduct);
      toast(`Product visibility is now ${updatedVisibility ? 'visible' : 'hidden'}`);
      const productWithoutImage = {
        ...updatedProduct,
        image: null,
      };
  
      await updateProduct(productWithoutImage, token);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update product visibility');
    }
  };
  
  
  const handleFeatureToggle = async(product: Product, onLocalUpdate?: (product: Product) => void) => {
    if (!token) return;
    
    const updatedProductFeature = {
      ...product,
      is_featured: !product.is_featured
    };

    try {
      
      if(onLocalUpdate) {
        onLocalUpdate((updatedProductFeature))
        toast(updatedProductFeature.is_featured ? 'Product Now Featured': 'Product removed from Featured')
      }

      const productWithoutImage = {
        ...updatedProductFeature,
        image: null,
      };

      await updateProduct(productWithoutImage, token);
    } catch (error) {
      console.error(error)
      toast('Feature toggle Failed: Reverting Back')
    }
    
}

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
