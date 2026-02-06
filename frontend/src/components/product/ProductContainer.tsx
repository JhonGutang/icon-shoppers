import React from "react";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/shared/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProductContainerProps {
  products: Product[];
  isLoading: boolean;
  emptyMessage?: string;
  shopName?: string;
  title?: string;
  children?: React.ReactNode;
  minItemWidth?: number; // Width in px for responsive auto-fill grid
  gap?: number; // Layout gap
  gridClassName?: string; // Override grid classes
}

const ProductContainer: React.FC<ProductContainerProps> = ({
  products,
  isLoading,
  emptyMessage = "No products found",
  shopName,
  title,
  children,
  minItemWidth,
  gap = 4,
  gridClassName,
}) => {
  const gridStyle = minItemWidth 
    ? { gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth}px, 1fr))` } 
    : {};

  const gridClasses = minItemWidth
    ? cn(`grid gap-${gap}`, gridClassName)
    : cn(
        `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-${gap}`,
        gridClassName
      );

  return (
    <div className="w-full">
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-foreground">{title}</h2>
      )}
      
      <div className={gridClasses} style={gridStyle}>
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
