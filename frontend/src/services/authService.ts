import axiosInstance from "@/hooks/useAxios";
import { Register, Login } from "@/types/auth";

const formatData = (data: Register | Login, auth: string) => {
  if (auth === "register") {
    const registerData = data as Register;
    return {
      name: registerData.shopName,
      owner: registerData.shopOwner,
      contact_number: registerData.contactNumber,
      password: registerData.password,
    };
  } else {
    const loginData = data as Login;
    return {
      name: loginData.shopName,
      password: loginData.password,
    };
  }
};

export const registerShop = async (shopDetails: Register) => {
  const formattedData = formatData(shopDetails, "register");
  axiosInstance.post("/register", formattedData);
};

export const login = async (shopCredentials: Login) => {
  const formattedData = formatData(shopCredentials, "login");
  const response = await axiosInstance.post("/login", formattedData);
  return response.data.token;
};

export const logout = async (token: string) => {
  await axiosInstance.delete('/logout', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export const getProfile = async (token: string) => {
    try {
        const response = await axiosInstance.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data
    } catch (error) {
        console.error(error);
    }
};
