export interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  price: string;
  stock: number;
  attributes: Record<string, string>;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  image?: string | null;
  price: string;
  stock: number;
  sales_count: number;
  status: 'draft' | 'published' | 'out_of_stock';
  category_id?: number;
  category?: Category;
  shop_id: number;
  shop?: Shop;
  is_visible: boolean | number;
  is_featured: boolean | number;
  average_rating: number;
  review_count: number;
  is_in_wishlist?: boolean;
  variants?: ProductVariant[];
  created_at?: string;
  updated_at?: string;
  
  // Legacy fields for backward compatibility
  shop_name?: string;
  quantity?: number;
}

export interface Shop {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo_image?: string;
  banner_image?: string;
  contact_number?: string;
  email?: string;
  shipping_fee?: string | number;
  rating?: number;
  follower_count?: number;
  is_followed?: boolean;
  products?: Product[];
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  product: Product;
  created_at: string;
}

export interface ProductInCart extends Product {
  quantity: number;
}

export interface ProductWithShop {
  shop: Shop;
  products: ProductInCart[];
}

export interface newProduct {
  name: string;
  price: number | string;
  quantity: number | string;
  category_id?: number;
  description?: string;
  image?: File | null;
}

export interface ProductToUpdate extends Partial<newProduct> {
  id: number;
  is_featured?: boolean;
  is_visible?: boolean;
}

export const productFields = [
  { id: "image", label: "Product Image", type: "file" },
  { id: "name", label: "Product Name", type: "text" },
  { id: "price", label: "Price", type: "number" },
  { id: "quantity", label: "Quantity", type: "number" },
];