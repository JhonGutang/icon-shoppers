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

    if (accessToken) {
      hasShownToast.current = false;
    }

    if (requireAuth && !accessToken) {
      if (!hasShownToast.current) {
        toast.error("Please login to access this page");
        hasShownToast.current = true;
      }
      router.push(redirectTo || "/auth");
      return;
    }

    if (requireAuth && allowedRoles.length > 0) {
      const userRole = userType || "";
      const EffectiveRoles = allowedRoles.includes("customer") ? [...allowedRoles, "merchant"] : allowedRoles;

      if (!EffectiveRoles.includes(userRole)) {
        if (!hasShownToast.current) {
          toast.error("Access Denied: Insufficient Permissions");
          hasShownToast.current = true;
        }
        router.push("/home");
        return;
      }
    }
  }, [accessToken, userType, hasHydrated, allowedRoles, redirectTo, requireAuth, router]);

  const EffectiveRoles = allowedRoles.includes("customer") ? [...allowedRoles, "merchant"] : allowedRoles;
  
  return {
    isAuthenticated: !!accessToken,
    userType,
    hasHydrated,
    canAccess: !requireAuth || (!!accessToken && (allowedRoles.length === 0 || EffectiveRoles.includes(userType || ""))),
  };
};
