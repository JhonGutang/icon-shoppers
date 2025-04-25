"use client";
import Navbar from "@/components/Navbar";
import Default from "@/components/customer-home/Default";
import Orders from "@/components/customer-home/Orders";
import Checkout from "@/components/customer-home/Checkout";
import Products from "@/components/customer-home/Products";
import Shops from "@/components/customer-home/Shops";
import Profile from "@/components/customer-home/Profile";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "@/stores/useAuthStore";
import { useSnackbar } from "@/components/context/SnackbarContext";

const Home = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeComponent, setActiveComponent] = useState<string>("Home");
  const { openSnackbar } = useSnackbar();
  
  const accessToken = useAuthStore((state) => state.accessToken);
  const userType = useAuthStore((state) => state.userType);

  useEffect(() => {
    if (!accessToken || userType !== "customer") {
      openSnackbar("Please login as a customer to access this page", "error");
      router.push("/customer-auth");
      return;
    }

    const section = searchParams.get("section");
    if (section) {
      setActiveComponent(section);
    } else {
      setActiveComponent("Home");
    }
  }, [searchParams, accessToken, userType, router]);

  const handleSetActiveComponent = (component: string) => {
    const newParams = new URLSearchParams();
    newParams.set("section", component);
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    setActiveComponent(component);
  };

  if (!accessToken || userType !== "customer") {
    return null;
  }

  return (
    <div className="w-full h-screen flex flex-col items-center py-5 lg:px-20">
      <Navbar
        activeComponent={activeComponent}
        setActiveComponent={handleSetActiveComponent}
      />
      {activeComponent === "Home" && <Default />}
      {activeComponent === "Products" && <Products location="Products" />}
      {activeComponent === "Shops" && <Shops location="Shops" />}
      {activeComponent === "Cart" && <Checkout />}
      {activeComponent === "Check Orders" && <Orders />}
      {activeComponent === "My Account" && <Profile />}
    </div>
  );
};

export default Home;
