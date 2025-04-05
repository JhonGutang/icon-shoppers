"use client";
import { Input } from "./ui/input";
import { CircleUserRound } from "lucide-react";
import useRedirectLink from "@/hooks/useRedirectLink";
import useAuth from "@/hooks/useAuth";
import useAuthStore from "@/stores/useAuthStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import React from "react";

interface NavbarProps {
  name: string | undefined;
}

const Navbar: React.FC<NavbarProps> = ({ name }) => {
  const role = useAuthStore.getState().userType;
  const { redirectLink } = useRedirectLink();
  const { handleLogout } = useAuth();

  const sellerLinks = [
    { label: name ?? "Login", link: name ? "profile" : "shop-auth" },
    { label: "Dashboard", link: "dashboard" },
    { label: "Orders", link: "seller-orders" },
    { label: "Sign Out", link: "" },
  ];

  const customerLinks = [
    { label: name ?? "Login", link: name ? "profile" : "customer-auth" },
    { label: "View Cart", link: "checkout" },
    { label: "Orders", link: "orders" },
    { label: "Sign Out", link: "" },
  ];

  const links = role === "seller" ? sellerLinks : customerLinks;

  return (
    <div className="lg:px-10 px-4 py-3 flex justify-center items-center lg:gap-10 gap-5">
      <img src="/logo.png" alt="" className="w-[45px] lg:w-[80px]" onClick={() => redirectLink('/')}/>
      <Input
        type="text"
        placeholder="search"
        className="lg:h-[50px] w-[60vw] lg:w-[50vw] text-xs lg:text-md"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <CircleUserRound />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {links.map((link) => (
            <div key={link.label}>
           { link.label === "Login" && !name ? (
                <DropdownMenuItem
                  className="cursor-pointer capitalize"
                  onClick={() => redirectLink(link.link)}
                >
                  {link.label}
                </DropdownMenuItem>
              ) : (
                name && (
                  <DropdownMenuItem
                    className={
                      link.label === "Sign Out"
                        ? "text-red-500 cursor-pointer capitalize"
                        : "cursor-pointer capitalize"
                    }
                    onClick={() =>
                      link.label === "Sign Out"
                        ? handleLogout()
                        : redirectLink(link.link)
                    }
                  >
                    {link.label}
                  </DropdownMenuItem>
                )
              )}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Navbar;
