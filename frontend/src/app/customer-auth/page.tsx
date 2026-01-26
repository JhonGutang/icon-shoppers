"use client";
import AuthLayout from "@/layout/AuthLayout";
import Login from "@/components/auth/login";
import React, { useState, useEffect } from "react";
import Register from "@/components/auth/register";
import useAuthStore from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

/**
 * Unified Authentication Page
 * In the new MVP flow, everyone registers as a standard user.
 * Merchant role is granted upon shop creation.
 */
const UnifiedAuth = () => {
  const [defaultAuth, setDefaultAuth] = useState<string>("login");
  const router = useRouter();
  const { accessToken, userType, hasHydrated } = useAuthStore();
  
  const loginField = [
    { id: "email", label: "Email", type: "email" },
    { id: "password", label: "Password", type: "password" },
  ];

  const registerField = [
    { id: "name", label: "Full Name", type: "text" },
    { id: "email", label: "Email Address", type: "email" },
    { id: "contactNumber", label: "Contact No.", type: "text" },
    { id: "address", label: "Delivery Address", type: "text" },
    { id: "password", label: "Password", type: "password" },
  ];

  useEffect(() => {
    if (!hasHydrated) return;
    
    // If user is authenticated, redirect to home
    if (accessToken) {
       router.push("/home");
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

  return (
    <AuthLayout>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {defaultAuth === "login" ? "Welcome Back!" : "Join Icon Shoppers"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {defaultAuth === "login" 
            ? "Sign in to manage your orders and shop." 
            : "One account to shop and sell gourmet treats."}
        </p>
      </div>

      {defaultAuth === "login" ? (
        <Login fields={loginField} setAuth={setDefaultAuth} />
      ) : (
        <Register
          fields={registerField}
          setAuth={setDefaultAuth}
        />
      )}
    </AuthLayout>
  );
};

export default UnifiedAuth;
