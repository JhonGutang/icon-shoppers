import axiosInstance from "@/hooks/useAxios";
import { newProduct, ProductToUpdate } from "@/types/product";


export const fetchShopProducts = async(token: string) => {
    const response = await axiosInstance.get('products', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data
}

export const fetchAllProducts = async () => {
    const response = await axiosInstance.get('all-products');
    return response.data
}

export const fetchSpecificProduct = async (id: number, token: string) => {
    const response = await axiosInstance.get(`product/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
}


export const addProduct = async(data: newProduct, token: string) => {
    const response = await axiosInstance.post('product', data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
}

export const updateProduct = async(data: ProductToUpdate, token: string) => {

    const response = await axiosInstance.patch(`product/${data.id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
}


export const deleteProduct = async (id: number, token: string) => {
    await axiosInstance.delete(`/products/${id}`, {
        headers: {
            Authorization: `Bearer ${token}` 
        }
    })
} 