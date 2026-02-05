import { Button } from "@/components/shared/ui/button";
import useAuth from "@/hooks/auth/useAuth";
import { Input } from "@/components/shared/ui/input";
import { Label } from "@/components/shared/ui/label";
import { motion } from "framer-motion";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <div className="w-full flex flex-col gap-5">
        {fields.map((field) => (
          <motion.div key={field.id} variants={itemVariants} className="text-left group">
            <Label htmlFor={field.id} className="mb-2.5 block text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] group-focus-within:text-[#0E6835] transition-colors">
              {field.label}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={`Enter your ${field.label.toLowerCase()}`}
              value={loginFormData[field.id as keyof typeof loginFormData]}
              onChange={(event) => handleInputs(event, "login")}
              onKeyDown={handleKeyPress}
              className="h-13 bg-white/50 border-stone-200 focus:bg-white focus:border-[#0E6835] focus:ring-4 focus:ring-green-500/5 transition-all rounded-2xl placeholder:text-stone-300 placeholder:font-light"
            />
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants} className="mt-10">
        <Button 
          className="w-full h-14 bg-[#0E6835] hover:bg-[#0c592d] text-white font-bold rounded-2xl shadow-xl shadow-green-900/10 transition-all active:scale-95 group relative overflow-hidden" 
          onClick={handleLogin}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Sign In
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </Button>

        <div className="text-sm mt-8 text-stone-400 text-center font-light">
          Don&apos;t have an account yet?{" "}
          <button
            className="text-[#0E6835] font-bold hover:underline underline-offset-4 decoration-2 transition-all ml-1"
            onClick={() => setAuth('register')}
          >
            Create one
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
