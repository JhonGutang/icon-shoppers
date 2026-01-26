"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

interface CustomerLayoutProps {
  children: React.ReactNode;
}

/**
 * CustomerLayout
 * Accessible by both customers and merchants in the unified account model.
 */
const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={["customer", "merchant"]} redirectTo="/customer-auth">
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </ProtectedRoute>
  );
};

export default CustomerLayout;
