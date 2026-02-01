import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import useAuth from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { ChevronRight, ChevronLeft, Check, Lock, MapPin, User } from "lucide-react";

interface RegisterFormProps {
  fields: { id: string; label: string; type: string }[]; // Keep for compatibility but we group them
  setAuth: (auth: string) => void;
}

const Register: React.FC<RegisterFormProps> = ({ setAuth }) => {
  const { handleRegister, registerFormData, handleInputs } = useAuth();
  const [step, setStep] = useState(1);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const steps = [
    { title: "Personal", icon: <User size={16} /> },
    { title: "Delivery", icon: <MapPin size={16} /> },
    { title: "Security", icon: <Lock size={16} /> }
  ];

  const handleNext = () => {
    setError("");
    if (step === 1) {
      if (!registerFormData.name || !registerFormData.email || !registerFormData.contactNumber) {
        setError("Please fill in all personal details.");
        return;
      }
    } else if (step === 2) {
      if (!registerFormData.address) {
        setError("Please provide your delivery address.");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const validateAndSubmit = async () => {
    setError("");
    if (registerFormData.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (registerFormData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      await handleRegister();
      setTimeout(() => {
        setAuth('login');
      }, 800);
    } catch (error) {
      console.error(error);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  return (
    <div className="w-full flex flex-col h-full">
      {/* Progress Stepper - flex-none to keep at top */}
      <div className="flex flex-none items-center justify-between mb-2 px-1">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div 
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500 border ${
                step > i + 1 
                  ? "bg-[#0E6835] border-[#0E6835] text-white" 
                  : step === i + 1 
                    ? "bg-white border-[#0E6835] text-[#0E6835] shadow-lg shadow-green-900/10" 
                    : "bg-white border-stone-200 text-stone-300"
              }`}
            >
              {step > i + 1 ? <Check size={14} /> : s.icon}
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-2 bg-stone-100">
                <motion.div 
                  className="h-full bg-[#0E6835]"
                  initial={{ width: "0%" }}
                  animate={{ width: step > i + 1 ? "100%" : "0%" }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Content Area - flex-1 and justify-center to vertically center the fields */}
      <div className="flex-1 flex flex-col justify-center relative overflow-hidden">
        <AnimatePresence mode="wait" custom={step}>
          <motion.div
            key={step}
            custom={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="w-full"
          >
            {step === 1 && (
              <div className="space-y-3">
                <div className="space-y-1 group">
                  <Label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] group-focus-within:text-[#0E6835]">Full Name</Label>
                  <Input 
                    id="name"
                    value={registerFormData.name}
                    onChange={(e) => handleInputs(e, "register")}
                    placeholder="e.g. Juan Dela Cruz"
                    className="h-13 bg-white border-stone-200 focus:border-[#0E6835] focus:ring-4 focus:ring-green-500/5 transition-all rounded-2xl"
                  />
                </div>
                <div className="space-y-1 group">
                  <Label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] group-focus-within:text-[#0E6835]">Email Address</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={registerFormData.email}
                    onChange={(e) => handleInputs(e, "register")}
                    placeholder="juan@example.com"
                    className="h-13 bg-white border-stone-200 focus:border-[#0E6835] focus:ring-4 focus:ring-green-500/5 transition-all rounded-2xl"
                  />
                </div>
                <div className="space-y-1 group">
                  <Label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] group-focus-within:text-[#0E6835]">Contact Number</Label>
                  <Input 
                    id="contactNumber"
                    value={registerFormData.contactNumber}
                    onChange={(e) => handleInputs(e, "register")}
                    placeholder="0917 XXX XXXX"
                    className="h-13 bg-white border-stone-200 focus:border-[#0E6835] focus:ring-4 focus:ring-green-500/5 transition-all rounded-2xl"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <div className="space-y-1 group">
                  <Label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] group-focus-within:text-[#0E6835]">Delivery Address</Label>
                  <textarea 
                    id="address"
                    rows={4}
                    value={registerFormData.address}
                    onChange={(e) => handleInputs(e as any, "register")}
                    placeholder="House No., Street, Brgy, Municipality, Province"
                    className="w-full p-4 bg-white border border-stone-200 focus:border-[#0E6835] focus:ring-4 focus:ring-green-500/5 transition-all rounded-2xl outline-none resize-none"
                  />
                  <p className="text-[10px] text-stone-400 italic mt-2">Please be specific to ensure smooth delivery.</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <div className="space-y-1 group">
                  <Label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] group-focus-within:text-[#0E6835]">Password</Label>
                  <Input 
                    id="password"
                    type="password"
                    value={registerFormData.password}
                    onChange={(e) => handleInputs(e, "register")}
                    placeholder="••••••••"
                    className="h-13 bg-white border-stone-200 focus:border-[#0E6835] focus:ring-4 focus:ring-green-500/5 transition-all rounded-2xl"
                  />
                </div>
                <div className="space-y-1 group">
                  <Label className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] group-focus-within:text-[#0E6835]">Confirm Password</Label>
                  <Input 
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-13 bg-white border-stone-200 focus:border-[#0E6835] focus:ring-4 focus:ring-green-500/5 transition-all rounded-2xl"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Area - for errors and buttons, flex-none to keep at bottom */}
      <div className="flex-none">
        <div className="h-4 mb-1">
          <AnimatePresence>
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-red-500 text-[10px] font-bold px-1"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="h-13 px-6 rounded-2xl border-stone-200 text-stone-500 hover:bg-stone-50"
            >
              <ChevronLeft size={20} />
            </Button>
          )}
          <Button
            onClick={step === 3 ? validateAndSubmit : handleNext}
            className="flex-1 h-13 bg-[#0E6835] hover:bg-[#0c592d] text-white font-bold rounded-2xl shadow-xl shadow-green-900/10 transition-all active:scale-95 group"
          >
            <span className="flex items-center gap-2">
              {step === 3 ? "Create Account" : "Next Step"}
              {step < 3 && <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />}
            </span>
          </Button>
        </div>

        <div className="text-sm mt-4 text-stone-400 text-center font-light">
          Already have an account?
          <button
            className="text-[#0E6835] font-bold hover:underline underline-offset-4 decoration-2 transition-all ml-1"
            onClick={() => setAuth("login")}
          >
            Sign In
          </button>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e7e5e4;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d6d3d1;
        }
      `}</style>
    </div>
  );
};

export default Register;
