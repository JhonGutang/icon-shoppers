import { fetchAllProducts } from "@/services/productService";
import { Product } from "@/types/product";
import { useEffect, useState } from "react";
import ProductCard from "../ProductCard";
import { Button } from "../ui/button";

const Default = () => {
  return (
    <div className="w-full h-screen">
      <Shops />
      <Products />
    </div>
  );
};

const Shops = () => {
  return (
    <div className="w-full">
      <div className="flex justify-between">
        <div className="text-xl">Shops</div>
        <Button className="px-6 bg-green-700">View</Button>
      </div>

      <div className="h-[30vh] flex justify-center items-center">
        Under Construction
      </div>
    </div>
  );
};

const Products = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const handleFetchAllProducts = async () => {
    const data = await fetchAllProducts();
    setAllProducts(data);
  };

  useEffect(() => {
    handleFetchAllProducts();
  }, []);

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <div className="text-xl">Products</div>
        <Button className="px-6 bg-green-700">All</Button>
      </div>
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

export default Default;
