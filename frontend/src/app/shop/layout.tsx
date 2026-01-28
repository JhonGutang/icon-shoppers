"use client";

import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import ShopSidebar from "@/components/shop/ShopSidebar";
import { User, Bell, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/useAuthStore";
import TransitionLoading from "@/components/TransitionLoading";

interface ShopLayoutProps {
  children: React.ReactNode;
}

const ShopLayout: React.FC<ShopLayoutProps> = ({ children }) => {
  const [isSwitching, setIsSwitching] = useState(false);
  const router = useRouter();
  const setSellerMode = useAuthStore((state) => state.setSellerMode);

  const handleSwitchToCustomer = async () => {
    setIsSwitching(true);
    
    // Simulate a smooth transition loading state
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setSellerMode(false);
    router.push("/");
  };

  return (
    <ProtectedRoute allowedRoles={["merchant"]} redirectTo="/">
      {isSwitching && <TransitionLoading message="Switching to Customer Mode..." />}
      <div className="flex h-screen bg-gray-50/50">
        <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 md:block">
          <ShopSidebar />
        </aside>
        
        <div className="flex flex-1 flex-col md:pl-64">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white/80 px-8 backdrop-blur-md">
            <h1 className="text-sm font-medium text-gray-400">Shop Management System</h1>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative text-gray-500">
                <Bell size={20} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
              </Button>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSwitchToCustomer}
                  className="h-8 gap-1.5 rounded-full border-green-200 bg-green-50/50 text-green-700 hover:bg-green-100 hover:text-green-800 transition-all duration-200"
                >
                  <ChevronLeft size={14} />
                  <span className="text-xs font-medium">Switch to Customer</span>
                </Button>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-700">
                  <User size={18} />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ShopLayout;
