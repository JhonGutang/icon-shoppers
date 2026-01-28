"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  ChevronRight,
  Store,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/shop", icon: LayoutDashboard },
  { name: "Orders", href: "/shop/orders", icon: ShoppingBag },
  { name: "Products", href: "/shop/products", icon: Package },
  { name: "Settings", href: "/shop/settings", icon: Settings },
];

const ShopSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white shadow-md">
            <Store size={18} />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Shop<span className="text-green-600">Manager</span>
          </span>
        </Link>
      </div>
      
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-green-50 text-green-700 shadow-sm" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <div className="flex items-center">
                <item.icon
                  className={cn(
                    "mr-3 h-5 w-5 transition-colors duration-200",
                    isActive ? "text-green-600" : "text-gray-400 group-hover:text-gray-500"
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </div>
              {isActive && (
                <ChevronRight className="h-4 w-4 text-green-600" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
          <div className="h-10 w-10 overflow-hidden rounded-full bg-green-100 border-2 border-white shadow-sm flex items-center justify-center">
            <Store className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-gray-900 truncate">Your Shop</p>
            <p className="text-xs text-gray-500 truncate">Manage your store</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopSidebar;
