"use client";

import ProductCard from "@/components/ProductCard";
import Header from "@/components/profile/Header";
import useAuth from "@/hooks/useAuth";
import { Profile as ProfileType } from "@/types/auth";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import useProductAction from "@/hooks/useProductActions";

const Profile = () => {
  const { handleGetProfile } = useAuth();
  const {products, handleFetchShopProducts} = useProductAction()
  const [user, setUser] = useState<ProfileType>();
 
  const fetchUser = async () => {
    const data = await handleGetProfile();
    setUser(data);
  };

  const fetchProducts = async () => {
    await handleFetchShopProducts()
  }

  useEffect(() => {
    fetchUser();
    fetchProducts()
  }, []);

  return (
    <div className="h-screen flex flex-wrap lg:flex-nowrap">
      <Header user={user} />
      <div className="w-full p-5">
        <div className="text-2xl font-semibold capitalize mb-4">{user?.name} Products <ShoppingBag className="inline"/> </div>
        <div className="w-full h-[90%] flex flex-wrap gap-3 overflow-y-auto">
          {products?.map((product) => (
            <div key={product.id}>
              <ProductCard
              product={product}
              location="profile"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
