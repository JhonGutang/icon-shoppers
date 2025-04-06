import axiosInstance from "@/hooks/useAxios";
import { Order } from "@/types/product";

export const addToCart = async (productId: number, token: string) => {
    await axiosInstance.post(`cart/${productId}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}  

export const checkoutOrder = async (products: {id: number, order_id?: number, quantity: number}[], token: string) => {
    console.log(products);
    await axiosInstance.patch('checkout', {products}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const removeToCart = async(productId: number, token: string) => {
    await axiosInstance.delete(`order/${productId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const fetchPendingOrders = async(token: string) => {
    const response = await axiosInstance.get('from-cart', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data
}


export const fetchPendingOrdersBasedOnShop = async (token: string) => {
    const response = await axiosInstance.get('to-checkout', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return response.data
}
