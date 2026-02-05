"use client";

import CreateShop from "@/components/customer-home/CreateShop";
import Navbar from "@/components/shared/layout/Navbar";
import ProtectedRoute from "@/components/shared/auth/ProtectedRoute";

export default function CreateShopPage() {
  return (
    <ProtectedRoute>
      <div className="w-full min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 px-4 py-8 lg:px-20 overflow-auto">
          <CreateShop />
        </div>
      </div>
    </ProtectedRoute>
  );
}
