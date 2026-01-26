export interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  price: string;
  stock: number;
  attributes: Record<string, string>;
}

export interface Product {
  id: number;
  shop_name?: string,
  name: string;
  description?: string;
  image?: string | null;
  price: string;
  quantity?: number;
  shop_id?: number;
  is_visible: boolean | number,
  is_featured: boolean | number,
  variants?: ProductVariant[];
  created_at?: string;
  updated_at?: string;
  order_id?: number;
}

export interface ProductToUpdate {
  id?: number;
  name?: string;
  image?: File | null;
  price?: string;
  quantity?: number;
  is_visible?: boolean | number,
  is_featured?: boolean | number,
  shop_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Shop {
  id: number,
  name: string,
  category?: string,
  contact_number: string,
  email: string,
  logo_image?: string,
  banner_image?: string,
  description: string,
  shipping_fee?: string | number,
  products?: Product[]
}

export interface ProductWithShop {
  order_id?: number,
  products: ProductInCart[],
  shop: Shop,
  status?: string,
  shipping_address?: string | null,
  total_amount?: number,
}

export type ProductInCart = Product & { quantity: number };

export interface newProduct {
  name: string;
  price: number;
  quantity: number;
  image?: File | undefined;
}

export const productFields: { id: keyof ProductToUpdate; label: string; type: string }[] = [
  { id: 'image', label: 'Image', type: 'file'},
  { id: "name", label: "Name", type: "text" },
  { id: "price", label: "Price", type: "number" },
  { id: "quantity", label: "Quantity", type: "number" },
];

export interface Order {
  id: number,
  quantity: number
}