import { useCallback, useState } from "react";
import { Register, Login } from "@/types/auth";
import { login, register, getProfile, logout } from "@/services/authService";
import { toast } from "sonner";
import useToken from "@/stores/useAuthStore";
import useRedirectLink from "./useRedirectLink";

const useAuth = () => {
  const store = useToken();
  const { redirectLink } = useRedirectLink();
  const [registerFormData, setRegisterFormData] = useState<Register>({
    name: "",
    shopOwner: "",
    address: "",
    middleName: "",
    email: "",
    contactNumber: "",
    password: "",
  });

  const [loginFormData, setLoginFormData] = useState<Login>({
    name: "",
    password: "",
  });

  const handleInputs = (
    e: React.ChangeEvent<HTMLInputElement>,
    auth: "register" | "login"
  ) => {
    const { id, value } = e.target;

    if (auth === "register") {
      setRegisterFormData((prev: Register) => ({
        ...prev,
        [id]: value,
      }));
    } else {
      setLoginFormData((prev: Login) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleRegister = (role: string) => {
    try {
      register(registerFormData, role);
      toast("Registered Successfully");
    } catch (error) {
      console.error(error);
      toast("Registration Failed");
    }
  };

  const handleLogin = async (role: string) => {
    const profile = await login(loginFormData, role);
    toast("Login successful!");
    store.setAuth(profile.token, profile.user.role, profile.user.id);
    redirectLink("/");
  };

  const handleLogout = () => {
    const accessToken = useToken.getState().accessToken;
    if (accessToken) {
      logout(accessToken);
      toast("Logout successful!");
      store.clearAuth();
      redirectLink("login");
    }
  };

  const handleGetProfile = useCallback(async () => {
    const accessToken = useToken.getState().accessToken;
    const role = useToken.getState().userType

    if (accessToken && role) {
      const data = await getProfile(accessToken, role);
      return data.user;
    }
  }, []);

  return {
    registerFormData,
    loginFormData,
    handleInputs,
    handleRegister,
    handleLogin,
    handleLogout,
    handleGetProfile,
  };
};

export default useAuth;
