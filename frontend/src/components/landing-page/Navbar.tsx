"use client";

import { Button } from "../ui/button";
import useRedirectLink from "@/hooks/useRedirectLink";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { redirectLink } = useRedirectLink();
  const [isOpen, setIsOpen] = useState(false);
  
  const navLinks = [
    { id: "home", label: "Home", link: "/" },
    { id: "about-us", label: "About Us", link: "#about-us" },
    { id: "products", label: "Products", link: "#products" },
    { id: "seller-center", label: "Seller Center", link: "/shop-auth" },
    { id: "login", label: "Login", link: "/customer-auth" },
  ];

  return (
    <div className="lg:w-full w-full px-3 bg-white lg:px-10 lg:h-[70px] h-[60px] flex items-center justify-between fixed top-0 z-10">
      <div className="flex items-center cursor-pointer" onClick={() => redirectLink('/')}>
        <div>
          <img src="/logo.png" alt="" className="lg:w-[100px] w-[80px] lg:h-[100px]" />
        </div>
        <div className="lg:text-xl hidden font-semibold">Icon Shoppers</div>
      </div>

      <div className="hidden md:flex items-center gap-5">
        {navLinks.map((link) => (
          <div key={link.id}>
            <Button
              variant="ghost"
              className="rounded-sm"
              onClick={() => {
                if (link.link.startsWith("#")) {
                  const target = document.getElementById(link.id);
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                  }
                } else {
                  redirectLink(link.link);
                }
              }}
            >
              {link.label}
            </Button>
          </div>
        ))}
      </div>

      <div className="md:hidden flex items-center">
        <Button onClick={() => setIsOpen(!isOpen)} variant="ghost">
          {isOpen ? <X /> : <Menu/>}
        </Button>
      </div>

      {isOpen && (
        <div className="absolute top-15 left-0 w-full bg-white shadow-lg z-10">
          <div className="flex flex-col items-center">
            {navLinks.map((link) => (
              <Button
                key={link.id}
                variant="ghost"
                className="w-full text-left"
                onClick={() => {
                  setIsOpen(false);
                  if (link.link.startsWith("#")) {
                    const target = document.getElementById(link.id);
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth' });
                    }
                  } else {
                    redirectLink(link.link);
                  }
                }}
              >
                {link.label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
