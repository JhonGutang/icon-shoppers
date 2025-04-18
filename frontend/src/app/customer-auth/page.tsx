"use client";
import AuthLayout from "@/layout/AuthLayout";
import Login from "@/components/auth/login";
import React, { useState } from "react";
import Register from "@/components/auth/register";

const CustomerAuth = () => {
  const [defaultAuth, setDefaultAuth] = useState<string>("login");
  const loginField = [
    { id: "name", label: "Customer Name", type: "text" },
    { id: "password", label: "Password", type: "password" },
  ];

  const registerField = [
    { id: "name", label: "Name", type: "text" },
    { id: "middleName", label: "Middle Name", type: "text" },
    { id: "email", label: "Email", type: "text" },
    { id: "contactNumber", label: "Contact No.", type: "text" },
    { id: "address", label: "Address", type: "text" },
    { id: "password", label: "Password", type: "password" },
  ];

  return (
    <AuthLayout role="customer">
      {defaultAuth === "login" ? (
        <Login fields={loginField} role="customer" setAuth={setDefaultAuth} />
      ) : (
        <Register
          fields={registerField}
          role="customer"
          setAuth={setDefaultAuth}
        />
      )}
    </AuthLayout>
  );
};

export default CustomerAuth;
