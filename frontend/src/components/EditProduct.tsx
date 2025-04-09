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

  const [isLoading, setIsLoading] = useState(false);
  const accessToken = useToken((state) => state.accessToken);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        quantity: product.quantity?.toString() || "",
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
    if (!accessToken || !product) return;

    setIsLoading(true);

    try {
      const updatedProduct = await updateProduct({
        id: product.id,
        name: formData.name,
        quantity: Number(formData.quantity),
        price: formData.price,
      }, accessToken);

      toast.success("Product updated successfully");
      onSave(updatedProduct);
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-green-700 text-white hover:bg-white hover:text-green-700" onClick={() => setOpen(true)}>Edit Product</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Edit Product</DialogTitle>
        <form onSubmit={async (e) => {
          await handleSubmit(e);
          setOpen(false);
        }} className="space-y-4">
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
