import axiosInstance from "@/hooks/useAxios";
import { newProduct, ProductToUpdate, Product } from "@/types/product";

const formatData = (data: Product[]) => {
  const formattedData = data.map((item: Product) => ({
    ...item,
    is_featured: item.is_featured === 1,
    is_visible: item.is_visible === 1,
  }));

  return formattedData;
};

export const fetchShopProducts = async (token: string) => {
  const response = await axiosInstance.get("products", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return formatData(response.data);
};

export const fetchAllProducts = async (type: string) => {
  const response = await axiosInstance.get("all-products", {
    params: { type },
  });
  return response.data;
};


export const searchProducts = async (search: string) => {
  const response = await axiosInstance.get("search-products", {
    params: { search },
  });
  return response.data;
}


export const fetchSpecificProduct = async (id: number) => {
  const response = await axiosInstance.get(`product/${id}`);
  return response.data;
};

export const addProduct = async (data: newProduct, token: string) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("price", `${data.price}`);
  formData.append("quantity", `${data.quantity}`);
  if (data.image) {
    formData.append("image", data.image); 
  }


  const response = await axiosInstance.post("product", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateProduct = async (data: ProductToUpdate, token: string) => {
  const response = await axiosInstance.patch(`product/${data.id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteProduct = async (id: number, token: string) => {
  await axiosInstance.delete(`/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
