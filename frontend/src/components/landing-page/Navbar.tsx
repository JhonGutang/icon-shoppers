"use client";

import { Button } from "../shared/ui/button";
import useRedirectLink from "@/hooks/shared/useRedirectLink";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingBasket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { redirectLink } = useRedirectLink();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const navLinks = [
    { id: "home", label: "Home", link: "#home" },
    { id: "products", label: "Marketplace", link: "#products" },
    { id: "about-us", label: "Our Story", link: "#about-us" },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-lg shadow-sm h-16" : "bg-transparent h-20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => {
            const isLandingPage = window.location.pathname === "/";
            if (isLandingPage) {
              const target = document.getElementById("home");
              if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
              }
            } else {
              redirectLink('/');
            }
          }}
        >
          <div className="bg-[#0E6835] p-2 rounded-xl group-hover:rotate-12 transition-transform">
            <ShoppingBasket className="text-white h-6 w-6" />
          </div>
          <span className={`text-xl font-black tracking-tighter transition-colors ${
            scrolled ? "text-stone-900" : "text-stone-900"
          }`}>
            ICON<span className="text-[#0E6835]">SHOPPERS</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              className={`text-sm font-bold cursor-pointer transition-all hover:text-green-600 relative group ${
                scrolled ? "text-stone-600" : "text-stone-700"
              }`}
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
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full" />
            </button>
          ))}
          <Button
            className="rounded-full bg-[#0E6835] hover:bg-[#084d26] text-white px-6 font-bold"
            onClick={() => redirectLink('/auth')}
          >
            Sign In
          </Button>
        </div>

        <div className="md:hidden flex items-center">
          <Button 
            onClick={() => setIsOpen(!isOpen)} 
            variant="ghost" 
            className="text-stone-900"
          >
            {isOpen ? <X /> : <Menu/>}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-stone-100 overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <Button
                  key={link.id}
                  variant="ghost"
                  className="w-full justify-start text-stone-600 font-bold"
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
              <Button
                className="w-full mt-2 rounded-xl bg-green-600 text-white font-bold"
                onClick={() => redirectLink('/auth')}
              >
                Sign In
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
