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
      throw error; // Propagate error to prevent UI progression
    }
  };

  const handleLogin = async () => {
    try {
      const response = await login(loginFormData);
      const { token, user, has_shop } = response;
      
      openSnackbar("Login successful!", "success");
      
      // Store user info and set needsRoleSelection if they have a shop
      store.setAuth(token, user.role, user.id, has_shop, has_shop);

      // Always redirect to root discovery page first
      redirectLink("/home");
    } catch (error) {
      console.error(error)
      openSnackbar("Login failed!", "error");
      throw error; // Propagate error
    }
  };

  const handleRoleSelect = (role: "customer" | "seller") => {
    if (role === "seller") {
      store.setSellerMode(true);
      openSnackbar("Welcome back, Seller!", "success");
      redirectLink("/shop");
    } else {
      store.setSellerMode(false);
      openSnackbar("Continuing as Customer", "info");
      // Already on home or wherever redirectLink("/") sent them
    }
    
    store.setNeedsRoleSelection(false);
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
      redirectLink("/"); // Landing page for guests
    }
  };

  const handleGetProfile = useCallback(async () => {
      const data = await getProfile();
      return data;
  }, []);

  const handleUpdateProfile = async (updatedData: EditProfile) => {
      try {
        const response = await updateProfile(updatedData as any);
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
    handleRedirectIfUserIsAuth,
    handleRoleSelect
  };
};

export default useAuth;
