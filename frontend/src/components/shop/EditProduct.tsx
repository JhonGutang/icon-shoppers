"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shared/ui/dialog";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import useProductAction from "@/hooks/product/useProductActions";
import { Product, productFields } from "@/types/product";
import { Edit } from "lucide-react";

interface EditProductProps {
  product: Product;
}

const EditProduct: React.FC<EditProductProps> = ({ product }) => {
  const { handleInputs, handleUpdateProduct, loading } = useProductAction();
  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price,
    quantity: product.stock,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await handleUpdateProduct(product.id, {
        ...product,
        name: formData.name,
        price: formData.price.toString(),
        stock: Number(formData.quantity),
        image: null, // Don't send image if not changed (based on hook logic)
      });
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1 h-9 rounded-xl border-gray-200 hover:border-green-200 hover:bg-green-50 text-gray-600 hover:text-green-700">
           <Edit size={14} className="mr-2" />
           Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[60vw]">
        <DialogHeader>
          <DialogTitle>Edit Product: {product.name}</DialogTitle>
          <DialogDescription>
            Update your product information.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex flex-col gap-5">
          {product.image && (
             <img
                src={`${process.env.NEXT_PUBLIC_LARAVEL_API_URL}/storage/${product.image}`}
                className="w-[40%] rounded-xl object-contain max-h-[25vh]"
                alt="Product Preview"
             />
          )}
          
          <div className="grid gap-4">
             <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" value={formData.name} onChange={handleChange} />
             </div>
             <div className="grid gap-2">
                <Label htmlFor="price">Price (₱)</Label>
                <Input id="price" type="number" value={formData.price} onChange={handleChange} />
             </div>
             <div className="grid gap-2">
                <Label htmlFor="quantity">Stock Quantity</Label>
                <Input id="quantity" type="number" value={formData.quantity} onChange={handleChange} />
             </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleUpdate} disabled={loading}>
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProduct;
