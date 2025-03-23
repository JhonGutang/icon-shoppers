'use client'
import { Input } from "@/components/ui/input";
import AuthLayout from "@/layout/AuthLayout";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import useRedirectLink from "@/hooks/useRedirectLink";
import useAuth from "@/hooks/useAuth";


const Register = () => {
  const {redirectLink} = useRedirectLink()
  const {registerFormData, handleInputs, handleRegister } = useAuth()

  const registerFields = [
    { id: "shopName", label: "Business Name", type: "text" },
    { id: "shopOwner", label: "Business Owner", type: "text" },
    { id: "email", label: "Email", type: "text" },
    { id: "contactNumber", label: "Contact No.", type: "text" },
    { id: "password", label: "Password", type: "password" },
  ];

  return (
    <AuthLayout>
      <div className="flex flex-col gap-3">
        {registerFields.map((field) => (
          <div key={field.id}>
            <Label htmlFor={field.id} className="mb-2">
              {field.label}
            </Label>
            <Input id={field.id} type={field.type} value={registerFormData[field.id as keyof typeof registerFormData]} onChange={(event) => handleInputs(event, 'register')} />
          </div>
        ))}
      </div>
      <div>
        <Button className="w-full h-[45px] cursor-pointer" onClick={handleRegister}>Register</Button>
        <div className="text-sm">
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
