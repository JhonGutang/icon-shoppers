// components/EditProduct.tsx
import { Product } from "@/types/product";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateProduct } from "@/services/productService";
import useToken from "@/stores/useAuthStore";
import { Camera } from "lucide-react";

interface EditProductProps {
  product: Product | undefined;
  onSave: (updatedProduct: Product) => void;
}

const EditProduct: React.FC<EditProductProps> = ({ product, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const accessToken = useToken((state) => state.accessToken);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        quantity: product.quantity?.toString() || "",
        price: product.price.toString(),
      });
      setImagePreview(`http://127.0.0.1:8000/storage/${product.image}`);
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match(/^image\/(jpeg|png|gif|jpg)$/)) {
        toast.error('Please select a valid image file (JPEG, PNG, GIF)');
        return;
      }
      
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !product) return;

    setIsLoading(true);

    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('quantity', formData.quantity);
      form.append('price', formData.price);
      
      if (imageFile) {
        form.append('image', imageFile);
      }

      form.append('_method', 'PUT');

      const updatedProduct = await updateProduct({
        id: product.id,
        formData: form,
      }, accessToken);

      toast.success("Product updated successfully");
      onSave(updatedProduct);
      setOpen(false);
    } catch (error: any) {
      console.error(error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        errorMessages.forEach((message: string) => toast.error(message));
      } else {
        toast.error("Failed to update product");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-green-700 text-white hover:bg-white hover:text-green-700">Edit Product</Button>
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
              <Button type="button" variant="outline" className="w-full sm:w-auto">
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
