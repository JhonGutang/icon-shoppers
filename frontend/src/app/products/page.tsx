"use client";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import useProductAction from "@/hooks/useProductActions";
import useAuth from "@/hooks/useAuth";
import { Profile } from "@/types/auth";
import { Product } from "@/types/product";
import { useEffect, useState } from "react";

const ProductsPage = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const { handleFetchAllProducts } = useProductAction();
  const { handleGetProfile } = useAuth();
  const [user, setUser] = useState<Profile>();

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await handleFetchAllProducts();
      const profile = await handleGetProfile();
      setAllProducts(products);
      setUser(profile);
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <Navbar name={user?.name} />

      {/* Title Section */}
      <div className="w-full text-center">
        <div className="text-xl font-bold flex items-center justify-center gap-2">
          <span>All Products</span>
        </div>
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

export default ProductsPage;
