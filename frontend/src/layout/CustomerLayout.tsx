"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

interface CustomerLayoutProps {
  children: React.ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
  return (
    <ProtectedRoute allowedRoles={["customer"]} redirectTo="/customer-auth">
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </ProtectedRoute>
  );
};

export default CustomerLayout;
