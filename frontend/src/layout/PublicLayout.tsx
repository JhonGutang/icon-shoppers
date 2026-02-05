"use client";

import ProtectedRoute from "@/components/shared/auth/ProtectedRoute";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </ProtectedRoute>
  );
};

export default PublicLayout;
