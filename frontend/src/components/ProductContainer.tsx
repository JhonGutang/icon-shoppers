import React from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";
import { Skeleton } from "./ui/skeleton";

interface ProductContainerProps {
  products: Product[];
  isLoading: boolean;
  emptyMessage?: string;
  shopName?: string;
  title?: string;
  children?: React.ReactNode;
}

const ProductContainer: React.FC<ProductContainerProps> = ({
  products,
  isLoading,
  emptyMessage = "No products found",
  shopName,
  title,
  children,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-4 sm:p-6 w-full">
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-foreground">{title}</h2>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {isLoading ? (
          Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="w-full">
              <Skeleton className="h-64 w-full rounded-2xl" />
            </div>
          ))
        ) : products.length > 0 ? (
          <>
            {products.map((product) => (
              <div key={product.id} className="w-full">
                <ProductCard product={product} shopName={shopName} />
              </div>
            ))}
          </>
        ) : (
          <div className="text-center w-full col-span-full py-10 text-muted-foreground font-medium">
            {emptyMessage}
          </div>
        )}
      </div>
      
      {children && (
        <div className="mt-8 flex justify-center">
          {children}
        </div>
      )}
    </div>
  );
};

export default ProductContainer;
