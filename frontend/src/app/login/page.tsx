"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/layout/AuthLayout";
import useRedirectLink from "@/hooks/useRedirectLink";
import useAuth from "@/hooks/useAuth";
import React, { useState } from "react";

const Login = () => {
  const [isSeller, setIsSeller] = useState<boolean>(false);

  const sellerFields = [
    { id: "name", label: "Business Name", type: "text" },
    { id: "password", label: "Password", type: "password" },
  ];

  const customerFields = [
    { id: "name", label: "Customer Name", type: "text" },
    { id: "password", label: "Password", type: "password" },
  ];

  return (
    <AuthLayout 
      trigger={
        <Button onClick={() => setIsSeller((prev) => !prev)}> {isSeller ? 'Login as Customer' : 'Login as Seller'}</Button>
      }
    >
      <LoginForm fields={isSeller ? sellerFields : customerFields} role={isSeller ? 'seller': 'customer'} />
    </AuthLayout>
  );
};

type LoginFormProps = {
  fields: { id: string; label: string; type: string }[];
  role: string;
};

const LoginForm:React.FC<LoginFormProps> = ({fields, role}) => {
  const { redirectLink } = useRedirectLink();
  const { loginFormData, handleInputs, handleLogin } = useAuth();

  return (
    <>
      <div className="w-full flex flex-col gap-7">
        {fields.map((field) => (
          <div key={field.id}>
            <Label htmlFor={field.id} className="mb-2">
              {field.label}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              value={loginFormData[field.id as keyof typeof loginFormData]}
              onChange={(event) => handleInputs(event, "login")}
            />
          </div>
        ))}
      </div>
      <div>
        <Button className="w-full h-[45px]" onClick={() => handleLogin(role)}>
          Login
        </Button>
        <div className="text-sm">
          Don&apos;t have any account yet?{" "}
          <Button
            variant="link"
            className="cursor-pointer"
            onClick={() => redirectLink("register")}
          >
            Register Now
          </Button>
        </div>
      </div>
    </>
  );
};

export default Login;
