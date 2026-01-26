import { useCallback, useState } from "react";
import { Register, Login, EditProfile } from "@/types/auth";
import { login, register, getProfile, logout, updateProfile } from "@/services/authService";
import { useSnackbar } from "@/components/context/SnackbarContext";
import useToken from "@/stores/useAuthStore";
import useRedirectLink from "./useRedirectLink";

const useAuth = () => {
  const store = useToken();
  const { redirectLink } = useRedirectLink();
  const { openSnackbar } = useSnackbar(); 

  const [registerFormData, setRegisterFormData] = useState<Register>({
    name: "",
    address: "",
    middleName: "",
    email: "",
    contactNumber: "",
    password: "",
  });

  const [loginFormData, setLoginFormData] = useState<Login>({
    email: "",
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

  const handleRegister = async () => {
    try {
      await register(registerFormData);
      openSnackbar("Registered Successfully!", "success");
    } catch (error) {
      console.error(error);
      openSnackbar("Registration Failed!", "error");
    }
  };

  const handleLogin = async () => {
    try {
      const profile = await login(loginFormData);
      openSnackbar("Login successful!", "success");
      
      // Store user info
      store.setAuth(profile.token, profile.user.role, profile.user.id);

      // Always redirect to home in unified account system
      redirectLink("/home");
    } catch (error) {
      console.error(error)
      openSnackbar("Login failed!", "error");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      openSnackbar("Logout successful!", "info");
    } catch (error) {
      console.error("Logout failed:", error);
      openSnackbar("Logout failed!", "error");
    } finally {
      store.clearAuth();
      store.setLoggingOut(true);
      redirectLink("customer-auth"); // Unified Auth
    }
  };

  const handleGetProfile = useCallback(async () => {
      const data = await getProfile();
      return data;
  }, []);

  const handleUpdateProfile = async (updatedData: EditProfile) => {
      try {
        const response = await updateProfile(updatedData);
        openSnackbar("Profile updated successfully!", "success");
        return response;
      } catch (error) {
        console.error(error)
        openSnackbar("Failed to update profile!", "error");
      }
  };


  const handleRedirectIfUserIsAuth = () => {
    const accessToken = useToken.getState().accessToken;
    
    if (accessToken) {
       redirectLink("/home");
    }
  }

  return {
    registerFormData,
    loginFormData,
    handleInputs,
    handleRegister,
    handleLogin,
    handleLogout,
    handleGetProfile,
    handleUpdateProfile,
    handleRedirectIfUserIsAuth
  };
};

export default useAuth;
