"use client";
import ProductCard from "@/components/ProductCard";
import useProductAction from "@/hooks/useProductActions";
import { Product } from "@/types/product";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const Products = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const { handleFetchAllProducts } = useProductAction();

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await handleFetchAllProducts();
      setAllProducts(products);
    };

    fetchProducts();
  }, []);

  return (
    <div className="w-full h-full">
      {/* Title Section */}
      <div className="w-full text-center flex justify-between items-center">
        <div className="text-xl font-semibold">Products</div>
        <Button>
            All
        </Button>
      </div>

      {/* Centered Masonry Gallery Layout */}
      <div className="flex justify-center">
        <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-3 space-y-4 max-w-7xl mx-auto">
          {allProducts?.map((product) => (
            <div key={product.name} className="break-inside-avoid w-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
