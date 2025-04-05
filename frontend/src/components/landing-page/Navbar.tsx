"use client";

import { Button } from "../ui/button";
import useRedirectLink from "@/hooks/useRedirectLink";

const Navbar = () => {
  const { redirectLink } = useRedirectLink();
  const navLinks = [
    { id: "home", label: "Home", link: "/" },
    { id: "about-us", label: "About Us", link: "#about-us" },
    { id: "products", label: "Products", link: "#products" },
    { id: "seller-center", label: "Seller Center", link: "/shop-auth" },
    { id: "login", label: "Login", link: "/customer-auth" },
  ];

  return (
    <div className="w-full bg-white px-10 h-[70px] flex items-center justify-between fixed top-0">
      <div className="flex items-center cursor-pointer" onClick={() => redirectLink('/')}>
        <div>
          <img src="/logo.png" alt="" className="w-[100px] h-[100px]" />
        </div>
        <div className="text-xl font-semibold">Icon Shoppers</div>
      </div>

      <div className="flex items-center gap-5">
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
    </div>
  );
};

export default Navbar;
