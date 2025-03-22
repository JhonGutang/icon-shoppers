"use client";
import { Input } from "./ui/input";
import { CircleUserRound } from "lucide-react";
import useRedirectLink from "@/hooks/useRedirectLink";
import useAuth from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import React from "react";

interface NavbarProps {
  name: string | undefined
}


const Navbar: React.FC<NavbarProps> = ({name}) => {
  const { redirectLink } = useRedirectLink();
  const { handleLogout } = useAuth()
  const links = [
    { label: (name ? name : 'Login'), link: (name ? 'profile' : 'login' ) },
    { label: "View Cart", link: "" },
    { label: "Delivery Status", link: "" },
    { label: "Sign Out", link: "" },
  ];

  return (
    <div className="lg:px-10 px-4 py-3 flex justify-center items-center lg:gap-10 gap-4">
      <div className="font-semibold">Icon Shoppers</div>
      <Input
        type="text"
        placeholder="search"
        className="lg:h-[50px] w-[50vw] lg:w-[50vw] text-xs lg:text-md"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <CircleUserRound />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {links.map((link) => (
            <div key={link.label}>
              {link.label === 'Login' ? (
                <DropdownMenuItem 
                  className="cursor-pointer capitalize"
                  onClick={() => redirectLink(link.link)}
                >
                  {link.label}
                </DropdownMenuItem>
              ) : name && (
                <DropdownMenuItem
                  className={
                    link.label === "Sign Out"
                      ? "text-red-500 cursor-pointer capitalize"
                      : "cursor-pointer capitalize"
                  }
                  onClick={() => link.label === "Sign Out" ? handleLogout() : redirectLink(link.link)}
                >
                  {link.label}
                </DropdownMenuItem>
              )}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Navbar;
