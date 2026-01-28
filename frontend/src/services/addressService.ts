import axiosInstance from "@/hooks/useAxios";
import { Address, NewAddress } from "@/types/address";

export const addressService = {
  getAddresses: async (): Promise<Address[]> => {
    const response = await axiosInstance.get('/addresses');
    return response.data;
  },

  createAddress: async (data: NewAddress): Promise<Address> => {
    const response = await axiosInstance.post('/addresses', data);
    return response.data;
  },

  updateAddress: async (id: number, data: Partial<NewAddress>): Promise<Address> => {
    const response = await axiosInstance.put(`/addresses/${id}`, data);
    return response.data;
  },

  deleteAddress: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/addresses/${id}`);
  },

  setDefault: async (id: number): Promise<Address> => {
    const response = await axiosInstance.post(`/addresses/${id}/set-default`);
    return response.data;
  }
};
