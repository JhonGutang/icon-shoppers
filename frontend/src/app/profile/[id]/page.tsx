"use client";
import Feedback from "@/components/Feedback";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useProductAction from "@/hooks/useProductActions";
import { Product, productFields, ProductToUpdate } from "@/types/product";
import { useEffect, use, useState, ReactNode } from "react";
import useAuth from "@/stores/useToken";

const ProductPage = ({ params }: { params: Promise<{ id: number }> }) => {
  const { handleFetchSpecificProduct, product } = useProductAction();
  const { id } = use(params);
  const fetchData = async () => {
    await handleFetchSpecificProduct(id);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  return (
    <div className="w-full h-screen flex">
      <ProductContainer product={product} id={id} />
      <FeedbackContainer />
    </div>
  );
};

const ProductContainer: React.FC<{ product?: Product; id: number }> = ({
  product,
  id,
}) => {
const role = useAuth((state) => state.userType);
  const { handleDeleteProduct } = useProductAction();
  const [localProduct, setLocalProduct] = useState(product);
  
  useEffect(() => {
    setLocalProduct(product);
  }, [product]);

  return (
    <div className="w-full">
      <h1>Product Id: {localProduct?.id}</h1>
      <h1>Product Name: {localProduct?.name}</h1>
      <h1>Product Price: {localProduct?.price}</h1>
      <h1>Product quantity: {localProduct?.quantity}</h1>

      {role === "seller" && (
        <div className="flex">
          <Button>Featured </Button>
          <Button>Discounted </Button>
          <Button onClick={() => handleDeleteProduct(id)}>Delete </Button>
          <EditProductDialog
            id={id}
            product={localProduct}
            onLocalUpdate={setLocalProduct}
          >
            Update Product
          </EditProductDialog>
        </div>
      )}
    </div>
  );
};

interface EditProductDialogProps {
  children: ReactNode;
  id: number;
  product?: ProductToUpdate;
  onLocalUpdate?: (updated: Product) => void;
}

const EditProductDialog: React.FC<EditProductDialogProps> = ({
  children,
  product,
  onLocalUpdate,
}) => {
  const { handleUpdateProduct } = useProductAction();
  const [updatedProduct, setUpdatedProduct] = useState(product);

  useEffect(() => {
    if (product) {
      setUpdatedProduct(product);
    }
  }, [product]);

  const handleUpdateInputs = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [id as keyof ProductToUpdate]: value,
    }));
  };

  const handleSubmitUpdate = async () => {
    if (updatedProduct) {
      await handleUpdateProduct(updatedProduct, onLocalUpdate);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild className="cursor-pointer">
        <Button>{children}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Update Product</DialogTitle>
        <div className="flex flex-col gap-3">
          {productFields.map((field) => (
            <div key={field.id}>
              <Label htmlFor={field.id} className="mb-3">
                {field.label}
              </Label>
              <Input
                id={field.id}
                value={
                  updatedProduct?.[field.id] != null
                    ? `${updatedProduct?.[field.id]}`
                    : ""
                }
                onChange={handleUpdateInputs}
                type={field.type}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={handleSubmitUpdate}>Update</Button>
          <DialogClose asChild>
            <Button>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};



const FeedbackContainer = () => {
  return (
    <div className=" w-full text-center p-10">
      <div className="text-2xl mb-5">Feedbacks</div>
      <div className="w-full flex flex-col gap-4 h-[90%] overflow-y-auto">
        {Array.from({ length: 15 }).map((_, index) => (
          <Feedback key={index} />
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
