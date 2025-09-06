"use client";
import AuthLayout from "@/layout/AuthLayout";
import Register from "@/components/auth/register";
import Login from "@/components/auth/login";
import { useState, useEffect } from "react";
import useAuthStore from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

const ShopAuth = () => {
  const [defaultAuth, setDefaultAuth] = useState<string>("login");
  const router = useRouter();
  const { accessToken, userType, hasHydrated } = useAuthStore();

  const registerField = [
    { id: "name", label: "Business Name", type: "text" },
    { id: "shopOwner", label: "Business Owner", type: "text" },
    { id: "email", label: "Email", type: "text" },
    { id: "contactNumber", label: "Contact No.", type: "text" },
    { id: "password", label: "Password", type: "password" },
  ];

  const loginField = [
    { id: "email", label: "Email", type: "email" },
    { id: "password", label: "Password", type: "password" },
  ];

  useEffect(() => {
    if (!hasHydrated) return;
    
    // If user is authenticated, redirect silently (no toast)
    if (accessToken && userType) {
      if (userType === "seller") {
        router.push("/profile");
      } else if (userType === "customer") {
        router.push("/home");
      }
    }
  }, [accessToken, userType, hasHydrated, router]);

  // Show loading while checking auth
  if (!hasHydrated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Don't render if user is authenticated (silent redirect)
  if (accessToken) {
    return null;
  }

  return (
    <AuthLayout role="seller">
      {defaultAuth === "login" ? (
        <Login fields={loginField} role="seller" setAuth={setDefaultAuth}  />
      ) : (
        <Register fields={registerField} role="seller" setAuth={setDefaultAuth}/>
      )}
    </AuthLayout>
  );
};

export default ShopAuth;
