"use client";
import AuthLayout from "@/layout/AuthLayout";
import Register from "@/components/auth/register";
import Login from "@/components/auth/login";
import { useState } from "react";
const ShopAuth = () => {
  const [defaultAuth, setDefaultAuth] = useState<string>("login");
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
