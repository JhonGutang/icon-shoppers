"use client";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";
import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Profile } from "@/types/auth";

export default function Home() {
  const { handleGetProfile } = useAuth();
  const [user, setUser] = useState<Profile>();

  const fetchData = async () => {
    const data = await handleGetProfile()
    setUser(data)
  }
  useEffect(() => {
    fetchData()
  }, [])


  const products: Product[] = [
    {
      name: "Pencil",
      image: "https://i.pinimg.com/236x/0d/2c/46/0d2c463deeb7c0b29483efe40dde438a.jpg",
      price: "$500",
    },
    {
      name: "Ballpen",
      image: "https://i.pinimg.com/236x/6a/4c/03/6a4c03bb76abde4fbe5f4f306b009085.jpg",
      price: "$300",
    },
    {
      name: "T shirt",
      image: "https://i.pinimg.com/236x/0c/23/56/0c2356d9f738f780286bf0fdff4e82c1.jpg",
      price: "$300",
    },
  ];
  return (
    <div className="h-screen">
      <Navbar name={user?.name} />
      <div className="flex gap-5 flex-wrap justify-center lg:items-center lg:p-10 p-5">
        {products.map((product) => (
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
