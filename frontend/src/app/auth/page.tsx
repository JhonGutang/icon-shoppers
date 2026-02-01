"use client";
import AuthLayout from "@/layout/AuthLayout";
import Login from "@/components/auth/login";
import React, { useState, useEffect } from "react";
import Register from "@/components/auth/register";
import useAuthStore from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { ShoppingBasket } from "lucide-react";


/**
 * Unified Authentication Page
 * In the new MVP flow, everyone registers as a standard user.
 * Merchant role is granted upon shop creation.
 */
const UnifiedAuth = () => {
  const [defaultAuth, setDefaultAuth] = useState<string>("login");
  const router = useRouter();
  const { accessToken, hasHydrated } = useAuthStore();

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
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#fafaf9]">
        <div className="relative">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-[#0E6835]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <ShoppingBasket className="text-[#0E6835] h-8 w-8 animate-pulse" />
          </div>
        </div>
        <p className="mt-8 text-stone-400 font-bold uppercase tracking-[0.3em] text-[10px]">Preparing Marketplace...</p>
      </div>
    );
  }

  if (accessToken) {
    return null;
  }

  return (
    <AuthLayout>
      <div className="mb-4">
        <h2 className="text-2xl lg:text-3xl font-black text-stone-950 tracking-tight">
          {defaultAuth === "login" ? "Welcome Back" : "Join the Community"}
        </h2>
        <p className="text-stone-400 text-sm font-light mt-1 leading-relaxed">
          {defaultAuth === "login" 
            ? "Sign in to discover curated local treasures." 
            : "One account to shop and support our local artisans."}
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
