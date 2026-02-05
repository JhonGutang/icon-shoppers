"use client";

import CreateShop from "@/components/customer-home/CreateShop";
import Navbar from "@/components/shared/layout/Navbar";
import ProtectedRoute from "@/components/shared/auth/ProtectedRoute";

export default function CreateShopPage() {
  return (
    <ProtectedRoute>
      <div className="w-full h-screen flex flex-col bg-stone-50/50 overflow-hidden">
        <Navbar />
        <div className="flex-1 px-4 py-2 lg:px-20 overflow-hidden flex flex-col">
          <CreateShop />
        </div>
      </div>
    </ProtectedRoute>
  );
}
