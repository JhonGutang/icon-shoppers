"use client";
import { Input } from "@/components/ui/input";
import AuthLayout from "@/layout/AuthLayout";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import useRedirectLink from "@/hooks/useRedirectLink";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";

const Register = () => {
  const { redirectLink } = useRedirectLink();
  const { registerFormData, handleInputs, handleRegister } = useAuth();
  const [isSeller, setIsSeller] = useState<boolean>(false);

  const sellerFields = [
    { id: "shopName", label: "Business Name", type: "text" },
    { id: "shopOwner", label: "Business Owner", type: "text" },
    { id: "email", label: "Email", type: "text" },
    { id: "contactNumber", label: "Contact No.", type: "text" },
    { id: "password", label: "Password", type: "password" },
  ];

  const customerFields = [
    { id: "name", label: "Name", type: "text" },
    { id: "middleName", label: "Middle Name", type: "text" },
    { id: "email", label: "Email", type: "text" },
    { id: "contactNumber", label: "Contact No.", type: "text" },
    { id: "address", label: "Address", type: "text" },
    { id: "password", label: "Password", type: "password" },
  ];

  return (
    <AuthLayout
      trigger={
        <Button onClick={() => setIsSeller((prev) => !prev)}>
          Register as {isSeller ? "Customer" : "Seller"}
        </Button>
      }
    >
      <div className="flex flex-col gap-3 h-[20vw] overflow-y-auto">
        {(isSeller ? sellerFields : customerFields).map((field) => (
          <div key={field.id}>
            <Label htmlFor={field.id} className="mb-2">
              {field.label}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              value={
                registerFormData[field.id as keyof typeof registerFormData] ||
                ""
              }
              onChange={(event) => handleInputs(event, "register")}
            />
          </div>
        ))}
      </div>
      <div>
        <Button
          className="w-full h-[45px] cursor-pointer"
          onClick={() => handleRegister(isSeller ? "Customer" : "Seller")}
        >
          Register
        </Button>
        <div className="text-sm mt-2">
          Already have an account?
          <Button
            variant="link"
            className="cursor-pointer"
            onClick={() => redirectLink("login")}
          >
            Login Now
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
