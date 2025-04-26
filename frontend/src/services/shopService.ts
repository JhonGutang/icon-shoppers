import axiosInstance from "@/hooks/useAxios";
import { ShopUpdateData } from "@/types/shop";

export const fetchSpecificShop = async(name: string) => {
    const response = await axiosInstance.get(`shop/${name}`);
    return response.data.data
}

export const fetchAllShops = async(search?: string) => {
    const response = await axiosInstance.get('/shops', {
        params: search ? { search } : {}
    });
    return response.data;
}


export const updateShopProfile = async (shopId: string, updateData: ShopUpdateData, token: string) => {
    const response = await axiosInstance.put(`/shop/${shopId}`, updateData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}