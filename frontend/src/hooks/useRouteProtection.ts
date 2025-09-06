"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/useAuthStore";
import { toast } from "sonner";

interface UseRouteProtectionProps {
  allowedRoles?: string[];
  redirectTo?: string;
  requireAuth?: boolean;
}

export const useRouteProtection = ({
  allowedRoles = [],
  redirectTo,
  requireAuth = true,
}: UseRouteProtectionProps = {}) => {
  const router = useRouter();
  const { accessToken, userType, hasHydrated } = useAuthStore();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!hasHydrated) return;

    // Reset toast flag when auth state changes
    if (accessToken && userType) {
      hasShownToast.current = false;
    }

    if (requireAuth && !accessToken) {
      if (!hasShownToast.current) {
        toast.error("Please login to access this page", {
          style: {
            background: '#ef4444',
            color: 'white',
            border: '1px solid #dc2626'
          }
        });
        hasShownToast.current = true;
      }
      router.push(redirectTo || "/customer-auth");
      return;
    }

    if (requireAuth && allowedRoles.length > 0 && !allowedRoles.includes(userType || "")) {
      // If user is a customer, show toast and redirect to /home
      if (userType === "customer") {
        if (!hasShownToast.current) {
          toast.error("This page is for sellers only. Redirecting to your dashboard.", {
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
      
      // If user is a seller, show toast and redirect to /profile
      if (userType === "seller") {
        if (!hasShownToast.current) {
          toast.error("This page is for customers only. Redirecting to your profile.", {
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
      }
      
      if (!hasShownToast.current) {
        toast.error("You don't have permission to access this page", {
          style: {
            background: '#ef4444',
            color: 'white',
            border: '1px solid #dc2626'
          }
        });
        hasShownToast.current = true;
      }
      router.push(redirectTo || "/");
      return;
    }
  }, [accessToken, userType, hasHydrated, allowedRoles, redirectTo, requireAuth]);

  return {
    isAuthenticated: !!accessToken,
    userType,
    hasHydrated,
    canAccess: !requireAuth || (!!accessToken && (allowedRoles.length === 0 || allowedRoles.includes(userType || ""))),
  };
};
