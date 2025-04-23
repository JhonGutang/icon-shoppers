"use client";
import Feedback from "@/components/Feedback";
import { Button } from "@/components/ui/button";
import useProductAction from "@/hooks/useProductActions";
import { Product } from "@/types/product";
import { useEffect, use, useState, ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import EditProduct from "@/components/EditProduct";

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
  const { handleDeleteProduct, handleFeatureToggle,  handleFetchSpecificProduct } = useProductAction();
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

  const handleProductUpdate = async (updatedProduct: Product) => {
    await handleFetchSpecificProduct(id);
    setLocalProduct(updatedProduct);
  };

  return (
    <div className="w-full p-6">
      <div className="text-xl mb-4">Product Details</div>
      <div className="flex gap-6">
        <div className="flex-1">
          <div className="flex gap-3">
            <Card className="w-[20vw] h-[40vh] p-0">
              <CardContent className="flex items-center justify-center h-full p-0">
                <img
                  src={product?.image ?? "https://i.pinimg.com/736x/c5/a0/03/c5a00375d647591a14dd36e31151acb1.jpg"}
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
            {localProduct && (
              <EditProduct 
                product={localProduct}
                onSave={handleProductUpdate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
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
