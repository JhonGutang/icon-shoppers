"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/useAuthStore";
import { toast } from "sonner";

interface AuthRedirectProps {
  children: React.ReactNode;
}

/**
 * AuthRedirect component
 * If a user is already authenticated and tries to access guest-only pages (like login),
 * they are redirected to the Home page.
 */
const AuthRedirect: React.FC<AuthRedirectProps> = ({
  children,
}) => {
  const router = useRouter();
  const { accessToken, hasHydrated } = useAuthStore();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (!hasHydrated) return;

    if (accessToken) {
      if (!hasShownToast.current) {
        toast.info("You are already signed in. Redirecting to home...", {
          style: {
            background: '#059669',
            color: 'white',
            border: 'none'
          }
        });
        hasShownToast.current = true;
      }
      
      const timer = setTimeout(() => {
        router.push("/home");
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      hasShownToast.current = false;
    }
  }, [accessToken, hasHydrated, router]);

  if (!hasHydrated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (accessToken) {
    return null;
  }

  return <>{children}</>;
};

export default AuthRedirect;
