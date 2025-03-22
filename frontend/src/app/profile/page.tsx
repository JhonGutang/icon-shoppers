"use client";

import ProductCard from "@/components/ProductCard";
import Header from "@/components/profile/Header";
import useAuth from "@/hooks/useAuth";
import { Profile as ProfileType } from "@/types/auth";
import { Product } from "@/types/product";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import useProductAction from "@/hooks/useProductActions";

const Profile = () => {
  const { handleGetProfile } = useAuth();
  const {products, handleFetchProducts} = useProductAction()
  const [user, setUser] = useState<ProfileType>();
 
  const fetchUser = async () => {
    const data = await handleGetProfile();
    setUser(data);
  };

  const fetchProducts = async () => {
    await handleFetchProducts()
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
                name={product.name}
                image={product.image ?? 'https://i.pinimg.com/736x/c5/a0/03/c5a00375d647591a14dd36e31151acb1.jpg' }
                price={product.price}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
