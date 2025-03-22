import axiosInstance from "@/hooks/useAxios";
import { Product } from "@/types/product";


export const fetchShopProducts = async(token: string) => {
    const response = await axiosInstance.get('products', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data
}


export const addProduct = async(data: Product, token: string) => {
    const response = await axiosInstance.post('product', data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
}