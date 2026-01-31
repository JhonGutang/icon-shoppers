"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, User, Store, LogOut, Package, UserCircle, MessageSquare, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuthStore from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/useCartStore";

const UnifiedNavbar = () => {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const { isAuthenticated, isSeller, isSellerMode, toggleSellerMode, clearAuth } = useAuthStore();
  const { productsInCart } = useCartStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = productsInCart.reduce((acc: number, item: any) => acc + item.quantity, 0);

  const handleLogout = () => {
    clearAuth();
    router.push("/auth");
  };

  const isAuth = mounted ? isAuthenticated() : false;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href={isAuth ? "/home" : "/"} className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-green-600">Icon Shoppers</span>
        </Link>

        {/* Search Bar */}
        <div className="hidden flex-1 px-8 md:flex">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pl-10 h-10 rounded-full bg-gray-100 border-none focus-visible:ring-green-500"
            />
          </div>
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-4">
          {/* Messages */}
          <Link href="/messages" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
            <MessageSquare className="h-6 w-6 text-gray-700" />
            {/* Placeholder for unread count */}
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ShoppingCart className="h-6 w-6 text-gray-700" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white leading-none">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Profile Dropdown */}
          {isAuth ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/avatars/01.png" alt="User" />
                    <AvatarFallback><UserCircle className="h-6 w-6" /></AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">User Name</p>
                    <p className="text-xs leading-none text-muted-foreground">user@example.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => router.push("/orders")}>
                  <Package className="mr-2 h-4 w-4" />
                  <span>My Orders</span>
                </DropdownMenuItem>
                
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>My Account</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push("/wishlist")}>
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Wishlist</span>
                </DropdownMenuItem>

                {isSeller() ? (
                    <DropdownMenuItem onClick={toggleSellerMode}>
                        <Store className="mr-2 h-4 w-4" />
                        <span>{isSellerMode ? "Switch to Customer Mode" : "Switch to Seller Mode"}</span>
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem onClick={() => router.push("/create-shop")}>
                        <Store className="mr-2 h-4 w-4" />
                        <span>Create Shop</span>
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => router.push("/auth")} className="bg-green-600 hover:bg-green-700">
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default UnifiedNavbar;
