"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

interface SellerLayoutProps {
  children: React.ReactNode;
}

const SellerLayout: React.FC<SellerLayoutProps> = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={["seller"]} redirectTo="/shop-auth">
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </ProtectedRoute>
  );
};

export default SellerLayout;
