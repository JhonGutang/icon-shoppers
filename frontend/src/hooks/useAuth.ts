import { useCallback, useState } from "react";
import { Register, Login } from "@/types/auth";
import {
  login,
  registerShop,
  getProfile,
  logout,
} from "@/services/authService";
import { toast } from "sonner";
import useToken from "@/stores/useToken";
import useRedirectLink from "./useRedirectLink";

const useAuth = () => {
  const store = useToken();
  const { redirectLink } = useRedirectLink();
  const [registerFormData, setRegisterFormData] = useState<Register>({
    shopName: "",
    shopOwner: "",
    email: "",
    contactNumber: "",
    password: "",
  });

  const [loginFormData, setLoginFormData] = useState<Login>({
    shopName: "",
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

  const handleRegister = () => {
    registerShop(registerFormData);
  };

  const handleLogin = async () => {
    const profile = await login(loginFormData);
    console.log(profile);
    toast("Login successful!");
    store.setAuth(profile.token, profile.user.role , profile.user.id);
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
    if (accessToken) {
      const data = await getProfile(accessToken);
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
