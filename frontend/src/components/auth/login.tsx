import { Button } from "../ui/button";
import useAuth from "@/hooks/useAuth";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type LoginFormProps = {
    fields: { id: string; label: string; type: string }[];
    setAuth: (auth: string) => void
  };

const Login:React.FC<LoginFormProps> = ({ fields, setAuth }) => {
  const { loginFormData, handleInputs, handleLogin } = useAuth();

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <>
      <div className="w-full flex flex-col gap-6">
        {fields.map((field) => (
          <div key={field.id} className="text-left">
            <Label htmlFor={field.id} className="mb-2 block text-xs font-bold text-gray-400 uppercase tracking-widest">
              {field.label}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              value={loginFormData[field.id as keyof typeof loginFormData]}
              onChange={(event) => handleInputs(event, "login")}
              onKeyDown={handleKeyPress}
              className="h-12 border-gray-200 focus-visible:ring-green-500"
            />
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Button className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-100 transition-all active:scale-95" onClick={handleLogin}>
          Sign In
        </Button>
        <div className="text-sm mt-6 text-gray-500 text-center">
          Don&apos;t have an account yet?{" "}
          <Button
            variant="link"
            className="p-0 h-auto text-green-600 font-bold hover:text-green-700"
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
