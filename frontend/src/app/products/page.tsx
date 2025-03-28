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
  const {handleGetProfile} = useAuth()
  const [user, setUser] = useState<Profile>();

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await handleFetchAllProducts();
      const profile = await handleGetProfile()
      setAllProducts(products);
      setUser(profile);

    };

    fetchProducts();
  }, []);
  return (
    <div>
        <Navbar name={user?.name} />
      <div className="w-full">
        <div className="text-xl font-bold flex items-center gap-2">
          <div className="mx-auto">All Products</div>{" "}
        </div>
      </div>
      <div className="flex gap-4 flex-wrap justify-center lg:p-0 pt-5">
        {allProducts?.map((product) => (
          <div key={product.name}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
