import axiosInstance from "@/hooks/useAxios";

export const fetchSpecificShop = async(name: string) => {
    const response = await axiosInstance.get(`shop/${name}`);
    return response.data.data
}

export interface ShopFilters {
    sort?: string;
    page?: number;
    per_page?: number;
}

export const fetchAllShops = async(filters: ShopFilters = {}) => {
    const response = await axiosInstance.get('/shops', {
        params: filters
    });
    return response.data;
}



export const createShop = async (data: any) => {
    const response = await axiosInstance.post('/shops', data);
    return response.data;
}

export const deleteShop = async (credentials: { password: string, shop_name: string }) => {
    const response = await axiosInstance.post("/shops/delete", credentials);
    return response.data;
};