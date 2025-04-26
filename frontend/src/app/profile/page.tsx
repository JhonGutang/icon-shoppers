"use client";

import ProductCard from "@/components/ProductCard";
import Header from "@/components/profile/Header";
import useAuth from "@/hooks/useAuth";
import { ProfileDisplay } from "@/types/auth";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import useProductAction from "@/hooks/useProductActions";
import useAuthStore from "@/stores/useAuthStore";
import { useSnackbar } from "@/components/context/SnackbarContext";
import useRedirectLink from "@/hooks/useRedirectLink";

const Profile = () => {
  const { handleGetProfile } = useAuth();
  const { products, handleFetchShopProducts } = useProductAction();
  const [user, setUser] = useState<ProfileDisplay>();
  const { openSnackbar } = useSnackbar();
  const { redirectLink } = useRedirectLink();

  const accessToken = useAuthStore((state) => state.accessToken);
  const userType = useAuthStore((state) => state.userType);

  useEffect(() => {
    // if (!accessToken || userType !== "seller") {
    //   openSnackbar("Please you your seller account to access this page", "error");
    //   redirectLink("shop-auth");
    //   return;
    // }

    fetchUser();
    fetchProducts();
  }, [accessToken, userType]);

  const fetchUser = async () => {
    const data = await handleGetProfile();
    setUser(data);
  };

  const fetchProducts = async () => {
    await handleFetchShopProducts();
  };

  if (!accessToken || userType !== "seller") {
    return null;
  }

  return (
    <div className="h-screen flex flex-wrap lg:flex-nowrap">
      <Header user={user} />
      <div className="w-full p-5">
        <div className="text-2xl font-semibold capitalize mb-4">
          {user?.name} Products <ShoppingBag className="inline" />
        </div>

        <div className=" h-[90%] overflow-y-auto">
          <div className="w-full columns-1 sm:columns-2 lg:columns-3 gap-3">
            {products?.map((product) => (
              <div key={product.id} className="mb-3 break-inside-avoid">
                <ProductCard product={product} location="profile" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
