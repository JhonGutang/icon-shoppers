import axiosInstance from "@/hooks/useAxios";


export const fetchSpecificShop = async(name: string) => {
    const response = await axiosInstance.get(`shop/${name}`);
    return response.data.data
}

export const fetchAllShops = async() => {
    const response = await axiosInstance.get('/shops');
    return response.data
}