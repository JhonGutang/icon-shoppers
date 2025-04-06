"use client";
import Navbar from "@/components/Navbar";
import Default from "@/components/customer-home/Default";
import Orders from "@/components/customer-home/Orders";
import Checkout from "@/components/customer-home/Checkout";
import Products from "@/components/customer-home/Products";
import { useEffect, useState } from "react";
import Shops from "@/components/customer-home/Shops";
import Profile from "@/components/customer-home/Profile";

const Home = () => {
  const [activeComponent, setActiveComponent] = useState<string>("Home");

  useEffect(() => {
    console.log(activeComponent);
  }, [activeComponent]);

  return (
    <div className="w-full h-screen flex flex-col items-center py-5 lg:px-20">
      <Navbar
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
      />
        {activeComponent === "Home" && <Default />}
        {activeComponent === "Products" && <Products />}
        {activeComponent === "Shops" && <Shops />}
        {activeComponent === "Cart" && <Checkout />}
        {activeComponent === "Check Orders" && <Orders />}
        {activeComponent === "My Account" && <Profile />}
    </div>
  );
};

export default Home;
