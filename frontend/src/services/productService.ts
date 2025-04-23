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

export const updateProduct = async (id: number, data: ProductToUpdate, token: string) => {
  const form = new FormData();
  if (data.name) {
    form.append("name", data.name);
  }
  if (data.quantity !== undefined) {
    form.append("quantity", `${data.quantity}`);
  }
  if (data.price !== undefined) {
    form.append("price", `${data.price}`);
  }
  if (data.is_featured !== undefined) {
    form.append("is_featured", data.is_featured ? "1" : "0");
  }
  if (data.image) {
    form.append("image", data.image);
  }

  const response = await axiosInstance.post(`product/${id}`, form, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteProduct = async (id: number, token: string) => {
  await axiosInstance.delete(`/product/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
