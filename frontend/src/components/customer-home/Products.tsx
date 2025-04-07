"use client";
import ProductCard from "@/components/ProductCard";
import useProductAction from "@/hooks/useProductActions";
import { Product } from "@/types/product";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const Products = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const { handleFetchAllProducts } = useProductAction();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await handleFetchAllProducts();
      setAllProducts(products);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="w-full text-center flex justify-between items-center px-6">
        <div className="text-xl ">Products</div>
        <Button>
            All
        </Button>
      </div>
      <div className="flex justify-center">
        <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-3 space-y-4 max-w-7xl mx-auto">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="break-inside-avoid w-full">
                <Skeleton className="h-80 w-70" /> 
              </div>
            ))
          ) : (
            allProducts?.map((product) => (
              <div key={product.name} className="break-inside-avoid w-full">
                <ProductCard product={product} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
