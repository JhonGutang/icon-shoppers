"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

interface SellerLayoutProps {
  children: React.ReactNode;
}

/**
 * SellerLayout
 * Explicitly for merchant-only functionality.
 */
const SellerLayout: React.FC<SellerLayoutProps> = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={["merchant"]} redirectTo="/">
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </ProtectedRoute>
  );
};

export default SellerLayout;
