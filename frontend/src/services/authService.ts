import axiosInstance from "@/hooks/useAxios";
import { Register, Login } from "@/types/auth";

const formatData = (data: Register | Login, auth: string) => {
  if (auth === "register") {
    const registerData = data as Register;
    return {
      name: registerData.name,
      owner: registerData.shopOwner,
      email: registerData.email,
      contact_number: registerData.contactNumber,
      password: registerData.password,
    };
  } else {
    const loginData = data as Login;
    return {
      name: loginData.name,
      password: loginData.password,
    };
  }
};


const formatCustomerData = (data: Register) => {
  return {
    name: data.name,
    middle_name: data.middleName ?? null,
    email: data.email,
    contact_number: data.contactNumber,
    address: data.address,
    password: data.password,
  }
}

export const register = async (details: Register, role: string) => {
  if (role === "seller") {
    const formattedData = formatData(details, "register");
    axiosInstance.post("/register", formattedData);
  } else {
    const formattedData = formatCustomerData(details);
    axiosInstance.post("/customer-register", formattedData);
  }
};

export const login = async (credentials: Login, role: string) => {
  const formattedData = formatData(credentials, "login");
  const API_ENDPOINT = role === 'seller' ? "/login" : "/customer-login"
  
  const response = await axiosInstance.post(API_ENDPOINT, formattedData);
  return response.data;
};

export const logout = async (token: string) => {
  await axiosInstance.delete("/logout", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getProfile = async (token: string, role: string) => {

  const API_ENDPOINT = role === 'seller' ? "/profile" : "/customer-profile"
  try {
    const response = await axiosInstance.get(API_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
