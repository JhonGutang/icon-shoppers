"use client";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";
import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Profile } from "@/types/auth";
import useProductAction from "@/hooks/useProductActions";
import useCustomerActions from "@/hooks/useCustomerActions";
import { Flame, ShoppingBag } from "lucide-react";

export default function Home() {
  const { handleOrdersInCart } = useCustomerActions();
  const { handleGetProfile } = useAuth();
  const { handleFetchAllProducts, handleFetchFeaturedProducts } =
    useProductAction();
  const [user, setUser] = useState<Profile>();
  const [allProducts, setAllProducts] = useState<Product[]>();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>();

  const fetchData = async () => {
    const data = await handleGetProfile();
    const products = await handleFetchAllProducts();
    const featured = await handleFetchFeaturedProducts();
    setUser(data);
    setAllProducts(products);
    setFeaturedProducts(featured);
  };

  useEffect(() => {
    fetchData();
    handleOrdersInCart();
  }, []);

  return (
    <div className="h-screen flex flex-col gap-10">
      <Navbar name={user?.name} />
      <div>
        <div className="w-full 500 px-25 mb-4">
          <div className="text-xl font-bold flex items-center gap-2"> <Flame /> <div>Featured Products</div> </div>
        </div>
        <div className="flex gap-5 flex-wrap justify-center lg:p-0  p-5">
          {featuredProducts?.map((product) => (
            <div key={product.name}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="w-full 500 px-25 mb-4">
          <div className="text-xl font-bold flex items-center gap-2 "> <ShoppingBag/> <div>All Products</div> </div>
        </div>
        <div className="flex gap-5 flex-wrap justify-center lg:p-0  p-5">
          {allProducts?.map((product) => (
            <div key={product.name}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
