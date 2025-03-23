export interface Product {
  id: number;
  name: string;
  image?: string;
  price: string;
  quantity?: string;
  shop_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductToUpdate {
  id?: number;
  name?: string;
  image?: string;
  price?: string;
  quantity?: string;
  shop_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface newProduct {
  name: string;
  price: number;
  quantity: number;
}

export const productFields = [
  { id: "image", label: "Select an Image", type: "file" },
  { id: "name", label: "Product Name", type: "text" },
  { id: "price", label: "Price", type: "number" },
  { id: "quantity", label: "Quantity", type: "number" },
];
