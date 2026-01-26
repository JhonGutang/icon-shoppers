"use client";
import ProductCard from "@/components/ProductCard";
import useProductAction from "@/hooks/useProductActions";
import { Product } from "@/types/product";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

interface ProductProps {
  location: string;
  categoryId?: number;
  sort?: string;
}

const Products: React.FC<ProductProps> = ({ location, categoryId, sort = "newest" }) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const { handleFetchAllProducts } = useProductAction();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const result = await handleFetchAllProducts(categoryId ? categoryId.toString() : "all");
      setAllProducts(result?.data || []);
      setLoading(false);
    };

    fetchProducts();
  }, [categoryId, sort]);

  return (
    <div className="w-full h-full">
      <div className="flex justify-center">
        <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-3 space-y-4 max-w-7xl mx-auto">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="break-inside-avoid w-full">
                <Skeleton className="h-80 w-70" />
              </div>
            ))
          ) : allProducts.length > 0 ? (
            allProducts.map((product) => (
              <div key={product.id} className="break-inside-avoid w-full">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className="text-center w-full ">No products found</div> // Fallback message
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
