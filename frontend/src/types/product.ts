export interface Product {
  id: number;
  shop_name?: string,
  name: string;
  image?: string;
  price: string;
  quantity?: string;
  shop_id?: number;
  is_visible: boolean,
  created_at?: string;
  updated_at?: string;
}

export interface ProductToUpdate {
  id?: number;
  name?: string;
  image?: string;
  price?: string;
  quantity?: string;
  is_visible?: boolean,
  shop_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface newProduct {
  name: string;
  price: number;
  quantity: number;
}

export const productFields: { id: keyof ProductToUpdate; label: string; type: string }[] = [
  { id: "name", label: "Name", type: "text" },
  { id: "price", label: "Price", type: "number" },
  { id: "quantity", label: "Quantity", type: "number" },
];
