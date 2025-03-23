import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import useProductAction from "@/hooks/useProductActions";
import { productFields } from "@/types/product";
const CreateProduct = () => {
  const { handleInputs, handleAddProducts } = useProductAction();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add New Product</Button>
      </DialogTrigger>
      <DialogContent className="w-[60vw]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            Voluptatem, magnam!
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex flex-col gap-5">
          <img
            src="https://i.pinimg.com/736x/c5/a0/03/c5a00375d647591a14dd36e31151acb1.jpg"
            className="w-[40%] rounded-xl"
            alt=""
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
