"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/useAuthStore";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
  requireAuth?: boolean;
}

import PageLoader from "@/components/shared/loaders/PageLoader";

/**
 * ProtectedRoute Component
 * In the Unified Account model:
 * - 'customer' pages should be accessible by both 'customer' and 'merchant'.
 * - 'merchant' pages require the 'merchant' role.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  redirectTo,
  requireAuth = true,
}) => {
  const router = useRouter();
  const { accessToken, userType, hasHydrated, isLoggingOut, setLoggingOut } = useAuthStore();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!hasHydrated) return;

    // Reset toast flag when auth state changes
    if (accessToken) {
      hasShownToast.current = false;
    }

    // 1. Check if authentication is required but missing
    if (requireAuth && !accessToken) {
      if (isLoggingOut) {
        setLoggingOut(false);
        router.push(redirectTo || "/auth");
        return; 
      }
      if (!hasShownToast.current) {
        toast.error("Please login to access this page", {
          style: { background: '#ef4444', color: 'white', border: 'none' }
        });
        hasShownToast.current = true;
      }
      router.push(redirectTo || "/auth");
      return;
    }

    // 2. Check role-based access
    if (requireAuth && allowedRoles.length > 0) {
      const userRole = userType || "";
      
      // Special logic: Merchant role inherits Customer privileges
      const EffectiveRoles = allowedRoles.includes("customer") 
        ? [...allowedRoles, "merchant"] 
        : allowedRoles;

      if (!EffectiveRoles.includes(userRole)) {
        if (!hasShownToast.current) {
          const message = userRole === "customer" 
            ? "This page is for merchants only." 
            : "You don't have permission to access this page.";
          
          toast.error(message, {
            style: { background: '#ef4444', color: 'white', border: 'none' }
          });
          hasShownToast.current = true;
        }
        
        // Redirect logic
        if (userRole === "customer" && allowedRoles.includes("merchant")) {
             router.push("/home?section=Create Shop"); // Suggest creating a shop
        } else {
             router.push("/home");
        }
        return;
      }
    }
  }, [accessToken, userType, hasHydrated, allowedRoles, redirectTo, requireAuth, isLoggingOut, setLoggingOut, router]);

  if (!hasHydrated) {
    return <PageLoader isLoading={true} />;
  }

  // Final check to prevent flashing unauthorized content
  const userRole = userType || "";
  const EffectiveRoles = allowedRoles.includes("customer") ? [...allowedRoles, "merchant"] : allowedRoles;
  
  if (requireAuth && (!accessToken || (allowedRoles.length > 0 && !EffectiveRoles.includes(userRole)))) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
