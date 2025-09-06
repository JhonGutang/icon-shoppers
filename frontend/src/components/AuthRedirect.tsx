"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/useAuthStore";
import { toast } from "sonner";

interface AuthRedirectProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({
  children,
  allowedRoles = [],
}) => {
  const router = useRouter();
  const { accessToken, userType, hasHydrated } = useAuthStore();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!hasHydrated) return; // Wait for hydration

    // Reset toast flag when auth state changes
    if (accessToken && userType) {
      hasShownToast.current = false;
    }

    // Add a small delay to prevent immediate redirects during logout
    const timer = setTimeout(() => {
      if (accessToken && userType) {
        // If user is authenticated, redirect them to their appropriate dashboard
        if (userType === "seller") {
          if (!hasShownToast.current) {
            toast.error("You are already logged in as a seller. Redirecting to your profile.", {
              style: {
                background: '#ef4444',
                color: 'white',
                border: '1px solid #dc2626'
              }
            });
            hasShownToast.current = true;
          }
          router.push("/profile");
          return;
        } else if (userType === "customer") {
          if (!hasShownToast.current) {
            toast.error("You are already logged in as a customer. Redirecting to your dashboard.", {
              style: {
                background: '#ef4444',
                color: 'white',
                border: '1px solid #dc2626'
              }
            });
            hasShownToast.current = true;
          }
          router.push("/home");
          return;
        }
      }
    }, 100); // Small delay to allow logout state to settle

    return () => clearTimeout(timer);
  }, [accessToken, userType, hasHydrated, router]);

  // Show loading while checking auth
  if (!hasHydrated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Don't render if user is authenticated
  if (accessToken) {
    return null;
  }

  return <>{children}</>;
};

export default AuthRedirect;
