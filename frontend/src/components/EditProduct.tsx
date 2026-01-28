// components/EditProduct.tsx

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import { Product, ProductToUpdate } from "@/types/product";
import { updateProduct } from "@/services/productService";
import { useSnackbar } from "./context/SnackbarContext";
import useToken from "@/stores/useAuthStore";

interface EditProductProps {
  product: Product | undefined;
  onSave: (updatedProduct: Product) => void;
}

const EditProduct: React.FC<EditProductProps> = ({ product, onSave }) => {
  const {openSnackbar} = useSnackbar()
  const [formData, setFormData] = useState<ProductToUpdate>({ id: product?.id || 0, name: "", quantity: 0, price: "", image: undefined });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const accessToken = useToken((state) => state.accessToken);

  useEffect(() => {
    if (product) populateFormFromProduct(product);
  }, [product]);

  const populateFormFromProduct = (product: Product) => {
    setFormData({
      id: product.id,
      name: product.name ?? "",
      quantity: product.quantity ?? 0,
      price: product.price?.toString() ?? "",
    });
    setImagePreview(product.image ?? "");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const validateImageFile = (file: File) => {
    const isValidType = /^image\/(jpeg|png|gif|jpg)$/.test(file.type);
    const isValidSize = file.size <= 5 * 1024 * 1024;

    if (!isValidType) {
      toast.error("Please select a valid image file (JPEG, PNG, GIF, JPG)");
      return false;
    }
    if (!isValidSize) {
      toast.error("Image size should be less than 5MB");
      return false;
    }
    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateImageFile(file)) {
      setImageFile(file);
      setFormData(prev => ({ ...prev, image: file }))
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Removed accessToken check as it's no longer explicitly passed to updateProduct
    if (!product) return;

    setIsLoading(true);
    try {

      console.log(imageFile);
      // accessToken removed from updateProduct call
      const updatedProduct = await updateProduct( product.id, formData);
      openSnackbar('Product Updated Successfully', 'success')
      setTimeout(() => {
        window.location.reload()
      }, 1000);
      onSave(updatedProduct);
      setOpen(false);
    } catch (error) {
      console.error(error)
      openSnackbar('Update Failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-green-700 text-white hover:bg-white hover:text-green-700">
          Edit Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs sm:max-w-sm md:max-w-md w-full p-4 sm:p-6">
        <DialogTitle className="text-lg sm:text-xl">Edit Product</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              <img
                src={imagePreview}
                alt="Product"
                className="w-32 h-32 rounded-full object-cover border"
              />
              <label htmlFor="product_image">
                <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow cursor-pointer hover:bg-gray-100">
                  <Camera size={16} className="text-gray-600" />
                </div>
              </label>
              <input
                id="product_image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isLoading}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              required
              disabled={isLoading}
            />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="w-full sm:w-auto" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProduct;
