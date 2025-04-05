import { useCallback, useState } from "react";
import { Register, Login } from "@/types/auth";
import { login, register, getProfile, logout } from "@/services/authService";
import { useSnackbar } from "@/components/context/SnackbarContext";
import useToken from "@/stores/useAuthStore";
import useRedirectLink from "./useRedirectLink";

const useAuth = () => {
  const store = useToken();
  const { redirectLink } = useRedirectLink();
  const { openSnackbar } = useSnackbar(); // Use MUI Snackbar

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
      setRegisterFormData((prev) => ({ ...prev, [id]: value }));
    } else {
      setLoginFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleRegister = async (role: string) => {
    try {
      await register(registerFormData, role);
      openSnackbar("Registered Successfully!", "success");
    } catch (error) {
      console.error(error);
      openSnackbar("Registration Failed!", "error");
    }
  };

  const handleLogin = async (role: string) => {
    try {
      const profile = await login(loginFormData, role);
      openSnackbar("Login successful!", "success");
      store.setAuth(profile.token, profile.user.role, profile.user.id);

      if (role === "seller") {
        redirectLink("profile");
      } else {
        redirectLink("/");
      }
    } catch (error) {
      openSnackbar("Login failed!", "error");
    }
  };

  const handleLogout = () => {
    const accessToken = useToken.getState().accessToken;
    if (accessToken) {
      logout(accessToken);
      openSnackbar("Logout successful!", "info");
      store.clearAuth();
      redirectLink("customer-auth");
    }
  };

  const handleGetProfile = useCallback(async () => {
    const accessToken = useToken.getState().accessToken;
    const role = useToken.getState().userType;

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
