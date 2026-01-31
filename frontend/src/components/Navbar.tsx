"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { ShoppingCart, Heart, User, Search, Store, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "./SearchBar";
import { useCartStore } from "@/stores/useCartStore";
import useAuthStore from "@/stores/useAuthStore";
import useAuth from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  isLanding?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isLanding = false }) => {
  const productsInCart = useCartStore((state) => state.productsInCart);
  const { userType, accessToken } = useAuthStore();
  const { handleLogout } = useAuth();
  
  const cartItemCount = productsInCart.length;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href={accessToken ? "/home" : "/"} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg">
            <Store size={20} />
          </div>
          <span className="hidden text-xl font-bold tracking-tight md:block">
            Icon<span className="text-primary">Shoppers</span>
          </span>
        </Link>

        {/* Search Bar - Hidden on Mobile, shown on tablet/desktop */}
        {!isLanding && (
          <div className="hidden flex-1 justify-center px-8 md:flex">
            <Suspense fallback={<div className="h-10 w-full max-w-lg rounded-full bg-muted/50 animate-pulse" />}>
              <SearchBar />
            </Suspense>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 md:gap-4">
          {/* Search trigger for mobile */}
          {!isLanding && (
            <>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Search size={22} />
              </Button>

              <Link href="/messages">
                <Button variant="ghost" size="icon" className="relative">
                  <MessageSquare size={22} />
                </Button>
              </Link>

              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart size={22} />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 justify-center rounded-full p-0 text-[10px]">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            </>
          )}

          {/* User Menu */}
          {(accessToken && !isLanding) ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User size={22} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile?section=customer">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wishlist">Wishlist</Link>
                </DropdownMenuItem>
                {userType === "merchant" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/shop">Shop Dashboard</Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleLogout()} className="text-destructive">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="hidden md:flex" asChild>
                <Link href="/auth">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/auth">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;