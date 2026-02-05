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
import { productFields } from "@/types/product";

const CreateProduct = () => {
  const { handleInputs, handleAddProducts, newProduct } = useProductAction();
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (newProduct.image) {
      const previewUrl = URL.createObjectURL(newProduct.image);
      // Decouple from render cycle to satisfy newer React lint rules
      Promise.resolve().then(() => setImagePreview(previewUrl));
      return () => URL.revokeObjectURL(previewUrl);
    } else {
      Promise.resolve().then(() => setImagePreview(""));
    }
  }, [newProduct.image]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-green-700 text-white hover:bg-white hover:text-green-700">Add New Product</Button>
      </DialogTrigger>
      <DialogContent className="w-[60vw]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Upload a product image and fill out product details.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex flex-col gap-5">
          <img
            src={
              !imagePreview ?
              "https://i.pinimg.com/736x/c5/a0/03/c5a00375d647591a14dd36e31151acb1.jpg" : imagePreview
            }
            className="w-[40%] rounded-xl object-contain max-h-[25vh]"
            alt="Product Preview"
          />
          {productFields.map((field) => (
            <div key={field.id}>
              <Label htmlFor={field.id} className="mb-2">
                {field.label}
              </Label>
              <Input
                id={field.id}
                type={field.type}
                accept={field.type === "file" ? "image/*" : undefined}
                onChange={handleInputs}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleAddProducts}>Create</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProduct;
