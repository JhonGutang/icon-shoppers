"use client";

import UnifiedNavbar from "@/components/layout/UnifiedNavbar";
import CreateShop from "@/components/customer-home/CreateShop";
import Default from "@/components/customer-home/Default";
import Orders from "@/components/customer-home/Orders";
import Checkout from "@/components/customer-home/Checkout";
import Products from "@/components/customer-home/Products";
import Shops from "@/components/customer-home/Shops";
import Profile from "@/components/customer-home/Profile";
import SellerDashboard from "@/components/customer-home/SellerDashboard";
import useAuthStore from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const HomeContent = () => {
  const searchParams = useSearchParams();
  const [activeComponent, setActiveComponent] = useState<string>("Home");
  const { isSellerMode } = useAuthStore();

  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      setActiveComponent(section);
    } else {
      setActiveComponent("Home");
    }
  }, [searchParams]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      <UnifiedNavbar />
      <div className="flex-1 px-4 py-8 lg:px-20 overflow-auto">
        {isSellerMode ? (
            <SellerDashboard />
        ) : (
            <>
                {activeComponent === "Home" && <Default />}
                {activeComponent === "Products" && <Products location="Products" />}
                {activeComponent === "Shops" && <Shops location="Shops" />}
                {activeComponent === "Cart" && <Checkout />}
                {activeComponent === "Check Orders" && <Orders />}
                {activeComponent === "My Account" && <Profile />}
                {activeComponent === "Create Shop" && <CreateShop />}
            </>
        )}
      </div>
    </div>
  );
};

export default HomeContent;
