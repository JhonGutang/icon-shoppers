import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import useAuth from "@/hooks/useAuth";

interface RegisterFormProps {
  fields: { id: string; label: string; type: string }[];
  setAuth: (auth: string) => void;
}

const Register: React.FC<RegisterFormProps> = ({ fields, setAuth }) => {
  const { handleRegister, registerFormData, handleInputs } = useAuth();

  const redirectIfSuccessful = async () => {
    try {
        await handleRegister()
        setTimeout(() => {
            setAuth('login')
        }, 800);
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
      <div className="flex flex-col gap-4 text-left lg:h-[22vw] h-[35vh] overflow-y-auto mb-6 pr-2 scrollbar-thin scrollbar-thumb-gray-200">
        {fields.map((field) => (
          <div key={field.id}>
            <Label htmlFor={field.id} className="mb-2 block text-xs font-bold text-gray-400 uppercase tracking-widest">
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
              className="h-12 border-gray-200 focus-visible:ring-green-500"
            />
          </div>
        ))}
      </div>
      <div>
        <Button
          className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-100 transition-all active:scale-95"
          onClick={redirectIfSuccessful}
        >
          Create Account
        </Button>
        <div className="text-sm mt-6 text-gray-500 text-center">
          Already have an account?
          <Button
            variant="link"
            className="p-0 h-auto text-green-600 font-bold hover:text-green-700 ml-1"
            onClick={() => setAuth("login")}
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
