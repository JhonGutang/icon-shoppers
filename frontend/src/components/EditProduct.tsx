// components/EditProduct.tsx
import { Product } from "@/types/product";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/hooks/useAxios";
import { toast } from "sonner";
import axios from "axios";

interface EditProductProps {
  product: Product | undefined;
  onSave?: () => void;
}

const EditProduct: React.FC<EditProductProps> = ({ product, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        quantity: product.quantity.toString(),
        price: product.price.toString(),
      });
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axiosInstance.put(`/products/${product?.id}`, {
        name: formData.name,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
      });

      toast.success("Product updated successfully");
      onSave?.();
      document.querySelector('[aria-label="Close"]')?.click();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Update failed");
      } else {
        toast.error("Unexpected error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-green-700 text-white hover:bg-white hover:text-green-700">Edit Product</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit Product</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" value={formData.name} onChange={handleInputChange} required disabled={isLoading} />
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input id="quantity" value={formData.quantity} onChange={handleInputChange} required disabled={isLoading} type="number" />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input id="price" value={formData.price} onChange={handleInputChange} required disabled={isLoading} type="number" />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProduct;
