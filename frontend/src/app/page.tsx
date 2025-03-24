"use client";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";
import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Profile } from "@/types/auth";
import useProductAction from "@/hooks/useProductActions";
import useCustomerActions from "@/hooks/useCustomerActions";


export default function Home() {
  const { handleOrdersInCart } = useCustomerActions()
  const { handleGetProfile } = useAuth();
  const { handleFetchAllProducts } = useProductAction()
  const [user, setUser] = useState<Profile>();
  const [allProducts, setAllProducts] =  useState<Product[]>();

  const fetchData = async () => {
    const data = await handleGetProfile()
    const products =await handleFetchAllProducts()
    setUser(data)
    setAllProducts(products)
  }


  useEffect(() => {
    fetchData()
    handleOrdersInCart()
  }, [])


  return (
    <div className="h-screen">
      <Navbar name={user?.name} />
      <div className="flex gap-5 flex-wrap justify-center lg:items-center lg:p-10 p-5">
        {allProducts?.map((product) => (
          <div key={product.name}>
            <ProductCard
            product={product}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
