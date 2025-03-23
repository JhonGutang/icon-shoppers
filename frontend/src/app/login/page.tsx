"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/layout/AuthLayout";
import useRedirectLink from "@/hooks/useRedirectLink";
import useAuth from "@/hooks/useAuth";

const Login = () => {
  const { redirectLink } = useRedirectLink();
  const { loginFormData, handleInputs, handleLogin } = useAuth();

  const loginFields = [
    { id: "shopName", label: "Business Name", type: "text" },
    { id: "password", label: "Password", type: "password" },
  ];

  return (
    <AuthLayout>
      <div className="w-full flex flex-col gap-7">
        {loginFields.map((field) => (
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
        <Button className="w-full h-[45px]" onClick={handleLogin}>
          Login
        </Button>
        <div className="text-sm">
          {" "}
          Don&apos;t have any account yet?{" "}
          <Button
            variant="link"
            className="cursor-pointer"
            onClick={() => redirectLink("register")}
          >
            Register Now
          </Button>{" "}
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
