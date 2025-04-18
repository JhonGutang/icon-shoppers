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

const Home = () => {
  const router = useRouter();
  const pathname = usePathname(); // <- this gives you "/home"
  const searchParams = useSearchParams();
  const [activeComponent, setActiveComponent] = useState<string>("Home");

  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      setActiveComponent(section);
    } else {
      setActiveComponent("Home");
    }
  }, [searchParams]);

  const handleSetActiveComponent = (component: string) => {
    const newParams = new URLSearchParams(); // start fresh, not reusing old ones
    newParams.set("section", component);
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
    setActiveComponent(component);
  };
  

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
