import AuthLayout from "@/layout/AuthLayout";
import { Button } from "../ui/button";
import useRedirectLink from "@/hooks/useRedirectLink";
import useAuth from "@/hooks/useAuth";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type LoginFormProps = {
    fields: { id: string; label: string; type: string }[];
    role: string;
    setAuth: (auth: string) => void
  };

const Login:React.FC<LoginFormProps> = ({ fields, role, setAuth }) => {
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
        <Button className="w-full h-[45px] main-btn-color" onClick={() => handleLogin(role)}>
          Login
        </Button>
        <div className="text-sm">
          Don&apos;t have any account yet?{" "}
          <Button
            variant="link"
            className="cursor-pointer "
            onClick={() => setAuth('register')}
          >
            Register Now
          </Button>
        </div>
      </div>
    </>
  );
};

export default Login;
