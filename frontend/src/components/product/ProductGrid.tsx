"use client";

import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/shared/ui/skeleton";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
}

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
  isLanding?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  isLoading, 
  emptyMessage = "No products found.",
  isLanding = false
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center text-muted-foreground">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} isLanding={isLanding} />
      ))}
    </div>
  );
};

export default ProductGrid;
