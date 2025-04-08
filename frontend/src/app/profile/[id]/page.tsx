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
import useAuthStore from "@/stores/useAuthStore";
import { Card, CardContent } from "@/components/ui/card";

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
  const { handleDeleteProduct, handleFeatureToggle } = useProductAction();
  const [localProduct, setLocalProduct] = useState(product);

  useEffect(() => {
    setLocalProduct(product);
  }, [product]);

  const buttons = [
    {
      label: "Featured",
      onClick: () => localProduct && handleFeatureToggle(localProduct, setLocalProduct),
      className: localProduct?.is_featured ? "rounded-full bg-green-700 text-white hover:bg-white hover:text-green-700" : "rounded-full text-green-700 bg-white hover:bg-green-700 hover:text-white",
    },
    {
      label: "Discounted",
      onClick: () => {}, 
      className: "rounded-full bg-green-700 text-white hover:bg-white hover:text-green-700"
    },
    {
      label: "Delete",
      onClick: () => handleDeleteProduct(id),
      className: "rounded-full bg-green-700 text-white hover:bg-white hover:text-green-700"
    },
  ];

  return (
    <div className="w-full p-6">
      <div>
        <div className="text-xl mb-4">Product Details</div>
      </div>

      <div className="flex gap-3">
        <Card className="w-[20vw] h-[40vh] p-0">
          <CardContent className="flex items-center justify-center h-full p-0">
            <img
              src={`http://127.0.0.1:8000/storage/${product?.image}`}
              alt="Product Image"
              className="object-cover w-full h-full rounded-xl"
            />
          </CardContent>
        </Card>

        <div>
          <div className="text-lg">{product?.name}</div>
          <div className="text-lg">Stocks: {product?.quantity}</div>
          <div className="text-lg">Price: {product?.price}</div>
        </div>
      </div>

      <div className="flex mt-5 gap-2">
        <div className="flex gap-2">

        {buttons.map((button, index) => (
          <Button key={index} className={button.className} onClick={button.onClick}>
            {button.label}
          </Button>
        ))}
        </div>
        <EditProductDialog
          id={id}
          product={localProduct}
          onLocalUpdate={setLocalProduct}
        >
          Update Product
        </EditProductDialog>
      </div>
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
        <Button className="rounded-full bg-green-700">{children}</Button>
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
          <DialogClose asChild>
            <Button onClick={handleSubmitUpdate}>Update</Button>
          </DialogClose>
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
    <div className=" w-full p-10">
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
