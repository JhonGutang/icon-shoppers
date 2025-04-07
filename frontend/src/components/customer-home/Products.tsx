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
  const [activeCategory, setActiveCategory] = useState<string>('all'); 

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await handleFetchAllProducts(activeCategory);
      setAllProducts(products);
      setLoading(false);
    };

    fetchProducts();
  }, [activeCategory]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const categories = ['all', 'featured'];

  return (
    <div className="w-full h-full">
      <div className="w-full px-6">
        <div className="text-xl ">Products</div>
        <div className="w-full flex justify-center gap-3">
          {categories.map((category) => (
            <Button 
              key={category}
              className={`rounded-full ${activeCategory === category ? 'bg-green-600' : ''} hover:bg-white hover:text-green-600`} 
              variant={activeCategory === category ? undefined : 'ghost'} 
              onClick={() => handleCategoryChange(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex justify-center">
        <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-4 p-3 space-y-4 max-w-7xl mx-auto">
          {loading
            ? Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="break-inside-avoid w-full">
                  <Skeleton className="h-80 w-70" />
                </div>
              ))
            : allProducts?.map((product) => (
                <div key={product.id} className="break-inside-avoid w-full">
                  <ProductCard product={product} />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
