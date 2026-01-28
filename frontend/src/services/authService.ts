import axiosInstance from "@/hooks/useAxios";
import { Register, Login, CustomerProfile, SellerProfile } from "@/types/auth";

const formatData = (data: Login) => {
  return {
    email: data.email,
    password: data.password,
  };
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

/**
 * Unified Register Service
 * Everyone registers as a customer by default.
 */
export const register = async (details: Register) => {
  const formattedData = formatCustomerData(details);
  return await axiosInstance.post("/register", formattedData);
};

export const login = async (credentials: Login) => {
  const formattedData = formatData(credentials);
  const response = await axiosInstance.post("/login", formattedData);
  return response.data;
};

export const logout = async () => {
  await axiosInstance.post("/logout");
};

export const getProfile = async () => {
  try {
    const response = await axiosInstance.get("/profile");
  
    const user = response.data.user;
    return user.role === 'merchant' ? formatSellerProfile(user) : formatProfileData(user);
  } catch (error) {
    console.error(error);
  }
};

const formatProfileData = (data: CustomerProfile) => {
  return {
    name: data.name,
    middleName: data.middle_name,
    email: data.email,
    contactNumber: data.contact_number,
    profile_picture: data.profile_picture,
    address: data.address,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    shop: data.shop,
  };
};

const formatSellerProfile = (data: SellerProfile) => {
  return {
    name: data.name,
    middleName: data.middle_name,
    email: data.email,
    contactNumber: data.contact_number,
    profile_picture: data.profile_picture,
    address: data.address,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    shop: data.shop,
    owner: data.owner
  };
};

export const updateProfile = async (formData: FormData) => {
  try { 
    const response = await axiosInstance.post("/profile", formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error; 
  }
};
