import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import useAuth from "@/hooks/useAuth";

interface RegisterFormProps {
  fields: { id: string; label: string; type: string }[];
  role: string;
  setAuth: (auth: string) => void;
}

const Register: React.FC<RegisterFormProps> = ({ fields, role, setAuth }) => {
  const { handleRegister, registerFormData, handleInputs } = useAuth();

  const redirectIfSuccessful = async () => {
    try {
        await handleRegister(role)
        setTimeout(() => {
            setAuth('login')
        }, 500);
    } catch (error) {
        console.error(error)
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      redirectIfSuccessful();
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-3 lg:h-[20vw] h-[30vh] overflow-y-auto mb-5">
        {fields.map((field) => (
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
              onKeyDown={handleKeyPress}
            />
          </div>
        ))}
      </div>
      <div>
        <Button
          className="w-full h-[45px] cursor-pointer main-btn-color"
          onClick={redirectIfSuccessful}
        >
          Register
        </Button>
        <div className="text-sm mt-2">
          Already have an account?
          <Button
            variant="link"
            className="cursor-pointer"
            onClick={() => setAuth("login")}
          >
            Login Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
