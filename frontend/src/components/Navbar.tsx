"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShoppingCart, 
  Heart, 
  User, 
  Search, 
  Store, 
  MessageSquare, 
  LogOut, 
  Package, 
  UserCircle 
} from "lucide-react";
import NotificationBell from "./NotificationBell";
import { Button } from "@/components/ui/button";
import SearchBar from "./SearchBar";
import { useCartStore } from "@/stores/useCartStore";
import useAuthStore from "@/stores/useAuthStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProps {
  isLanding?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isLanding = false }) => {
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);
  const productsInCart = useCartStore((state) => state.productsInCart);
  const { 
    isAuthenticated, 
    isSeller, 
    isSellerMode, 
    toggleSellerMode, 
    clearAuth,
    userType,
    id
  } = useAuthStore();
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const cartItemCount = productsInCart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const handleToggleMode = () => {
    const newMode = !isSellerMode;
    toggleSellerMode();
    router.push(newMode ? "/shop" : "/home");
  };

  const isAuth = mounted ? isAuthenticated() : false;

  const handleLogout = () => {
    clearAuth();
    router.push("/auth");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href={isAuth ? "/home" : "/"} className="flex items-center gap-2">
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
          {!isLanding && (
            <>
              {/* Search trigger for mobile */}
              <Button variant="ghost" size="icon" className="md:hidden">
                <Search size={22} />
              </Button>

              {/* Notifications */}
              <NotificationBell />

              {/* Messages */}
              <Link href="/messages">
                <Button variant="ghost" size="icon" className="relative group p-2 hover:bg-muted rounded-full transition-colors">
                  <MessageSquare size={22} />
                </Button>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="relative group p-2 hover:bg-muted rounded-full transition-colors">
                  <ShoppingCart size={22} />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 justify-center rounded-full p-0 text-[10px] bg-red-500">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            </>
          )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full select-none outline-none">
                  <Avatar className="h-10 w-10 border border-muted transition-transform active:scale-95">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      <UserCircle className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2" sideOffset={8}>
                <DropdownMenuLabel className="font-normal px-2 py-1.5">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Account</p>
                    <p className="text-xs leading-none text-muted-foreground">{userType}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="-mx-2 my-2" />
                
                <DropdownMenuItem className="cursor-pointer rounded-md" onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-md" onClick={() => router.push("/orders")}>
                  <Package className="mr-2 h-4 w-4" />
                  <span>My Orders</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-md" onClick={() => router.push("/wishlist")}>
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Wishlist</span>
                </DropdownMenuItem>

                {isSeller() ? (
                    <DropdownMenuItem className="cursor-pointer rounded-md font-semibold text-primary" onClick={handleToggleMode}>
                        <Store className="mr-2 h-4 w-4" />
                        <span>{isSellerMode ? "Switch to Customer Mode" : "Switch to Seller Mode"}</span>
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem className="cursor-pointer rounded-md" onClick={() => router.push("/create-shop")}>
                        <Store className="mr-2 h-4 w-4" />
                        <span>Create Shop</span>
                    </DropdownMenuItem>
                )}

                <DropdownMenuSeparator className="-mx-2 my-2" />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer rounded-md text-destructive focus:bg-destructive/10 focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
