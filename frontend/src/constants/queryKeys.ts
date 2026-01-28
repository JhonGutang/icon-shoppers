export const QUERY_KEYS = {
  PRODUCTS: {
    ALL: ['products'] as const,
    LIST: (filters: any) => ['products', 'list', filters] as const,
    DETAILS: (slug: string | number) => ['products', 'details', slug] as const,
    RELATED: (id: number) => ['products', 'related', id] as const,
    FEATURED: ['products', 'featured'] as const,
    TOP_SELLING: ['products', 'top-selling'] as const,
    SHOP: ['products', 'shop'] as const,
  },
  CATEGORIES: {
    ALL: ['categories'] as const,
    DETAILS: (slug: string) => ['categories', 'details', slug] as const,
  },
  CART: {
    ALL: ['cart'] as const,
  },
  ORDERS: {
    CUSTOMER: (status: string) => ['orders', 'customer', status] as const,
    SELLER: (status: string) => ['orders', 'seller', status] as const,
    DETAILS: (orderNumber: string) => ['orders', 'details', orderNumber] as const,
  },
  WISHLIST: {
    ALL: ['wishlist'] as const,
  },
  ADDRESSES: {
    ALL: ['addresses'] as const,
  },
  USER: {
    PROFILE: ['user', 'profile'] as const,
  },
  SHOPS: {
    ALL: ['shops'] as const,
    LIST: (filters: any) => ['shops', 'list', filters] as const,
    DETAILS: (name: string) => ['shops', 'details', name] as const,
  },
};
