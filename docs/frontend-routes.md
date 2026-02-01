# Frontend Routes Documentation

This document provides a comprehensive overview of all frontend routes in the Icon Shoppers application. Routes are categorized based on their protection status and user role requirements.

---

## 📋 Table of Contents

- [Public Routes](#public-routes)
- [Protected Routes (Authenticated Users)](#protected-routes-authenticated-users)
  - [Customer Routes](#customer-routes)
  - [Merchant Routes](#merchant-routes)
  - [Shared Routes (Both Roles)](#shared-routes-both-roles)
- [Dynamic Routes](#dynamic-routes)
- [Route Protection Mechanism](#route-protection-mechanism)

---

## 🌐 Public Routes

Public routes are accessible to **all users**, including unauthenticated visitors. No authentication token is required.

### Landing Page
- **Route:** `/landing`
- **File:** [src/app/landing/page.tsx](../src/app/landing/page.tsx)
- **Description:** Public landing page showcasing featured products and platform information
- **Features:**
  - Browse featured products
  - View platform details
  - Call-to-action for authentication
- **Auth Check:** Automatically redirects authenticated users to home (`/`)
- **Role Requirements:** None

### Authentication
- **Route:** `/auth`
- **File:** [src/app/auth/page.tsx](../src/app/auth/page.tsx)
- **Description:** Unified authentication page for login and registration
- **Features:**
  - User login form
  - User registration form
  - Single-account model (users register as customers, can become merchants by creating a shop)
- **Auth Check:** Automatically redirects authenticated users to home (`/`)
- **Role Requirements:** None

---

## 🔐 Protected Routes (Authenticated Users)

Protected routes require **valid authentication** (accessToken present in auth store). All routes in this section redirect unauthenticated users to `/auth`.

### Customer Routes

Routes accessible by **users with the `customer` role**. Merchants can also access these routes due to role inheritance.

#### Home / Dashboard
- **Route:** `/`
- **File:** [src/app/page.tsx](../src/app/page.tsx)
- **Description:** Main customer dashboard and product/shop browsing interface
- **Features:**
  - Explore products with category filtering
  - Browse shops
  - Sort products (newest, trending, etc.)
- **Protection:** `ProtectedRoute` with `redirectTo="/auth"`
- **Role Requirements:** `customer` (inherits to `merchant`)
- **Components Used:**
  - Navbar
  - Products browsing component
  - Shops browsing component
  - Category filter

#### Shopping Cart
- **Route:** `/cart`
- **File:** [src/app/cart/page.tsx](../src/app/cart/page.tsx)
- **Description:** Shopping cart management page
- **Features:**
  - View all items in cart
  - Group items by shop
  - Adjust item quantities
  - Remove items from cart
  - Proceed to checkout
- **Protection:** `ProtectedRoute`
- **Role Requirements:** `customer` (inherits to `merchant`)
- **State Management:** `useCartStore`

#### Checkout
- **Route:** `/checkout`
- **File:** [src/app/checkout/page.tsx](../src/app/checkout/page.tsx)
- **Description:** Order placement and checkout flow
- **Features:**
  - Select or add delivery addresses
  - Choose payment method (COD only)
  - Add order notes
  - Place order
  - Order confirmation
- **Protection:** `ProtectedRoute`
- **Role Requirements:** `customer` (inherits to `merchant`)
- **Payment Methods:** Cash on Delivery (COD) only
- **API Integration:** `useCheckoutMutation`

#### Orders / Order Tracking
- **Route:** `/orders`
- **File:** [src/app/orders/page.tsx](../src/app/orders/page.tsx)
- **Description:** Customer order history and tracking page
- **Features:**
  - View all customer orders
  - Filter orders by status (ALL, ORDERED, APPROVED, DELIVERING, COMPLETED, CANCELLED)
  - Track order status with visual indicators
  - View shop name for each order
- **Protection:** `ProtectedRoute`
- **Role Requirements:** `customer` (inherits to `merchant`)
- **API Integration:** `useCustomerOrders`
- **Status Tabs:**
  - All Orders
  - Pending (ORDERED)
  - Approved (APPROVED)
  - Shipping (DELIVERING)
  - Completed (COMPLETED)
  - Cancelled (CANCELLED)

#### Order Details
- **Route:** `/orders/:orderNumber`
- **File:** [src/app/orders/[orderNumber]/page.tsx](../src/app/orders/[orderNumber]/page.tsx)
- **Description:** Detailed view of a specific customer order
- **Features:**
  - View complete order information
  - Display order items with details
  - Show delivery address
  - Display order status and timeline
  - Contact seller information
- **Protection:** `ProtectedRoute`
- **Role Requirements:** `customer` (inherits to `merchant`)
- **Dynamic Parameter:** `orderNumber` (order identifier)
- **API Integration:** `useOrderDetails`

#### Wishlist
- **Route:** `/wishlist`
- **File:** [src/app/wishlist/page.tsx](../src/app/wishlist/page.tsx)
- **Description:** Customer wishlist / favorites page
- **Features:**
  - View all favorited products
  - Remove products from wishlist
  - Quick add-to-cart from wishlist
- **Protection:** `ProtectedRoute`
- **Role Requirements:** `customer` (inherits to `merchant`)
- **API Integration:** `wishlistService.getWishlist()`

#### Addresses Management
- **Route:** `/addresses`
- **File:** [src/app/addresses/page.tsx](../src/app/addresses/page.tsx)
- **Description:** Customer delivery addresses management
- **Features:**
  - View all saved addresses
  - Add new delivery address
  - Edit existing addresses
  - Delete addresses
  - Set default address
- **Protection:** `ProtectedRoute`
- **Role Requirements:** `customer` (inherits to `merchant`)
- **API Integration:** `addressService`
- **Dialog-based UI:** Modal for add/edit operations

#### Product Search Results
- **Route:** `/search`
- **File:** [src/app/search/page.tsx](../src/app/search/page.tsx)
- **Description:** Product search and filtering results page
- **Features:**
  - Search products by query
  - Filter by category
  - Filter by price range (min/max)
  - Sort results (newest, trending, etc.)
  - Pagination support
- **Protection:** `ProtectedRoute`
- **Role Requirements:** `customer` (inherits to `merchant`)
- **Query Parameters:**
  - `query` (search term)
  - `category` (optional, category ID)
- **API Integration:** `useProducts` with dynamic filtering

#### Product Details
- **Route:** `/products/:slug`
- **File:** [src/app/products/[slug]/page.tsx](../src/app/products/[slug]/page.tsx)
- **Description:** Individual product details and purchase page
- **Features:**
  - Product information and images
  - Product variants
  - Price and availability
  - Add to cart with quantity selection
  - Add to wishlist
  - Product ratings and reviews
  - Related products
  - Shop information
- **Protection:** `ProtectedRoute`
- **Role Requirements:** `customer` (inherits to `merchant`)
- **Dynamic Parameter:** `slug` (product slug)
- **API Integration:** `useProductDetails`, `useRelatedProducts`, wishlist mutations

#### Public Shop Display
- **Route:** `/:shopName`
- **File:** [src/app/[shopName]/page.tsx](../src/app/[shopName]/page.tsx)
- **Description:** Public shop storefront display
- **Features:**
  - View shop information and branding
  - Browse all shop products with infinite scrolling
  - Filter products by category
  - View featured products
- **Protection:** `ProtectedRoute` (requires authentication)
- **Role Requirements:** `customer` (inherits to `merchant`)
- **Dynamic Parameter:** `shopName` (shop slug/identifier)
- **Layout:** `PublicLayout`

#### Messages / Chat
- **Route:** `/messages`
- **File:** [src/app/messages/page.tsx](../src/app/messages/page.tsx)
- **Description:** Main messaging dashboard
- **Features:**
  - List all active conversations
  - Search conversations
  - Real-time message previews
  - Infinite scrolling for message history
- **Protection:** `ProtectedRoute`
- **Role Requirements:** `customer` (inherits to `merchant`)
- **API Integration:** `useConversations`, `useMessages`

#### Notifications
- **Route:** `/notifications`
- **File:** [src/app/notifications/page.tsx](../src/app/notifications/page.tsx)
- **Description:** User notifications history
- **Features:**
  - View all system and social notifications
  - Mark notifications as read
  - Real-time notification updates
- **Protection:** `ProtectedRoute`
- **Role Requirements:** `customer` (inherits to `merchant`)
- **API Integration:** `useNotifications`

#### Create Shop
- **Route:** `/create-shop`
- **File:** [src/app/create-shop/page.tsx](../src/app/create-shop/page.tsx)
- **Description:** Dedicated flow for creating a new shop
- **Features:**
  - Multi-step shop creation form
  - Branding setup (logo, banner)
  - Password-protected shop creation
- **Protection:** `ProtectedRoute`
- **Role Requirements:** `customer` (users who don't have a shop yet)
- **API Integration:** `useShopMutations`

#### Public Product from Shop
- **Route:** `/:shopName/:productName`
- **File:** [src/app/[shopName]/[productName]/page.tsx](../src/app/[shopName]/[productName]/page.tsx)
- **Description:** Product details from a specific shop's storefront
- **Features:**
  - Product details with shop context
  - Add to cart
  - View product feedback/reviews
  - View shop information
- **Protection:** `ProtectedRoute`
- **Role Requirements:** `customer` (inherits to `merchant`)
- **Dynamic Parameters:**
  - `shopName` (shop slug)
  - `productName` (product identifier)
- **Layout:** `PublicLayout`

### Merchant Routes

Routes accessible **only by users with the `merchant` role**. These routes are NOT accessible to customers without a shop.

#### Merchant Dashboard
- **Route:** `/shop`
- **File:** [src/app/shop/page.tsx](../src/app/shop/page.tsx)
- **Description:** Main merchant dashboard with analytics and overview
- **Features:**
  - Shop analytics and metrics
  - Total orders display
  - Revenue overview
  - Product count
  - Links to shop management sections
- **Protection:** `ProtectedRoute` with `allowedRoles=["merchant"]`
- **Role Requirements:** `merchant` only
- **API Integration:** `useShopAnalytics`
- **Redirect on Access Denial:** Suggests creating a shop (`/?section=Create Shop`)

#### Shop Orders Management
- **Route:** `/shop/orders`
- **File:** [src/app/shop/orders/page.tsx](../src/app/shop/orders/page.tsx)
- **Description:** Merchant order management and fulfillment page
- **Features:**
  - View all shop orders
  - Filter orders by status
  - Update order status (ORDERED → APPROVED → DELIVERING → COMPLETED)
  - Search orders by number
  - Refresh order list
  - Track order fulfillment
- **Protection:** `ProtectedRoute` with `allowedRoles=["merchant"]`
- **Role Requirements:** `merchant` only
- **API Integration:** `useSellerOrders`, `useUpdateOrderStatus`
- **Status Management:** STATUS_OPTIONS from `lib/orderUtils`

#### Shop Products Management
- **Route:** `/shop/products`
- **File:** [src/app/shop/products/page.tsx](../src/app/shop/products/page.tsx)
- **Description:** Product inventory and management page
- **Features:**
  - List all shop products
  - Create new products
  - Edit existing products
  - Delete products
  - Refresh product list
  - View product details
- **Protection:** `ProtectedRoute` with `allowedRoles=["merchant"]`
- **Role Requirements:** `merchant` only
- **API Integration:** `useMerchantProducts`
- **Modal Components:** `CreateProduct` dialog

#### Shop Settings
- **Route:** `/shop/settings`
- **File:** [src/app/shop/settings/page.tsx](../src/app/shop/settings/page.tsx)
- **Description:** Shop configuration and profile settings
- **Features:**
  - Edit shop name
  - Edit shop description
  - Upload shop logo/banner
  - Update shop contact information
  - Manage shop details
- **Protection:** `ProtectedRoute` with `allowedRoles=["merchant"]`
- **Role Requirements:** `merchant` only
- **API Integration:** `getProfile`, `updateProfile`

#### Product Management (Individual)
- **Route:** `/profile/:id`
- **File:** [src/app/profile/[id]/page.tsx](../src/app/profile/[id]/page.tsx)
- **Description:** Individual product editing page (merchant perspective)
- **Features:**
  - Edit product details
  - Update product images
  - Manage product variants
  - View product feedback
  - Update pricing
- **Protection:** `ProtectedRoute` with `allowedRoles=["merchant"]`
- **Role Requirements:** `merchant` only
- **Dynamic Parameter:** `id` (product ID)
- **Layout:** `SellerLayout`
- **Components:**
  - `EditProduct` form
  - `Feedback` component

### Shared Routes (Both Roles)

Routes accessible by both **customers and merchants**. These are customer routes that merchants inherit access to.

#### User Profile
- **Route:** `/profile`
- **File:** [src/app/profile/page.tsx](../src/app/profile/page.tsx)
- **Description:** User profile management and personal information
- **Features:**
  - Edit user profile (name, email, contact)
  - Manage delivery addresses
  - Upload profile picture
  - View account information
  - Shop creation (if applicable)
  - Order management
- **Protection:** `ProtectedRoute` with `redirectTo="/auth"`
- **Role Requirements:** Both `customer` and `merchant`
- **API Integration:** `addressService`, `authService` (getProfile, updateProfile)

---

## 🔗 Dynamic Routes

This section lists all dynamic route patterns with their parameter definitions.

### User & Content Paths

| Route Pattern | Param | Type | Description |
|---|---|---|---|
| `/profile/:id` | `id` | number | Product ID for merchant editing |
| `/orders/:orderNumber` | `orderNumber` | string | Order identifier |
| `/products/:slug` | `slug` | string | Product slug for details |
| `/messages/:id` | `id` | string | Conversation ID for chat |
| `/:shopName` | `shopName` | string | Shop slug/identifier |
| `/:shopName/:productName` | `shopName` | string | Shop identifier |
| | `productName` | string | Product identifier |

### Query Parameters

| Route | Params | Purpose |
|---|---|---|
| `/search` | `query`, `category` | Product search and filtering |
| `/shop/orders` | `statusFilter` (internal state) | Filter orders by status |
| `/shop/products` | None | Product list with inline filtering |
| `/` | None | Home page with category filters |

---

## 🛡️ Route Protection Mechanism

### ProtectedRoute Component

All protected routes use the `ProtectedRoute` wrapper component. This component enforces:

1. **Authentication Check:** Verifies presence of `accessToken`
2. **Role-based Access Control:** Validates user role against allowed roles
3. **Role Inheritance:** Merchants inherit customer route access
4. **Smart Redirects:** Routes based on auth state and user role

### Protection Logic

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];        // e.g., ["merchant"], ["customer"]
  redirectTo?: string;             // Fallback redirect URL
  requireAuth?: boolean;           // Whether authentication is required
}
```

### Role Inheritance Model

- **Unified Account System:** Users register as customers; merchants role granted upon shop creation
- **Merchant Inheritance:** Merchants can access all customer routes
- **Customer Routes:** Accessible by both customers and merchants
- **Merchant Routes:** Restricted to merchants only; customers are prompted to create a shop

### Auth Store Integration

Routes depend on `useAuthStore`:
- `accessToken` - JWT token for authenticated requests
- `userType` - Current user role (`customer`, `merchant`)
- `hasHydrated` - Store initialization status

---

## 📊 Route Summary Table

### By Protection Status

| Status | Count | Routes |
|---|---|---|
| **Public** | 2 | `/landing`, `/auth` |
| **Customer Only** | 15 | Home, cart, checkout, orders, wishlist, addresses, search, product details, shop display, messages, notifications, create-shop etc. |
| **Merchant Only** | 4 | Shop dashboard, orders mgmt, products mgmt, settings |
| **Shared (Both)** | 1 | Profile |
| **Total** | 22 | - |

### By Feature Area

| Feature | Routes | Status |
|---|---|---|
| **Authentication** | `/landing`, `/auth` | Public |
| **Shopping** | `/`, `/search`, `/products/:slug`, `/:shopName`, `/:shopName/:productName` | Protected (Customer) |
| **Cart & Checkout** | `/cart`, `/checkout` | Protected (Customer) |
| **Orders** | `/orders`, `/orders/:orderNumber` | Protected (Customer) |
| **Wishlist** | `/wishlist` | Protected (Customer) |
| **Addresses** | `/addresses` | Protected (Customer) |
| **User Profile** | `/profile` | Protected (Shared) |
| **Merchant Dashboard** | `/shop` | Protected (Merchant) |
| **Order Management** | `/shop/orders` | Protected (Merchant) |
| **Product Management** | `/shop/products`, `/profile/:id` | Protected (Merchant) |
| **Shop Settings** | `/shop/settings` | Protected (Merchant) |

---

## 🔄 Navigation Flow

### Unauthenticated User Flow

```
Landing Page (/landing) 
    ↓
    User clicks "Login" or "Register"
    ↓
Authentication (/auth)
    ↓
    [Login/Register Success]
    ↓
Home Page (/) [Redirect automatically]
```

### Customer User Flow

```
Home (/) → Browse Products
    ↓
Product Details (/products/:slug)
    ↓
Add to Cart → Shopping Cart (/cart)
    ↓
Checkout (/checkout) → Order Confirmation
    ↓
Order Tracking (/orders) → Order Details (/orders/:orderNumber)
```

### Merchant User Flow

```
Home (/) or Shop (/shop) [Auto-redirect based on role]
    ↓
Merchant Dashboard (/shop)
    ↓
├─ Manage Products (/shop/products) → Edit Product (/profile/:id)
├─ Manage Orders (/shop/orders)
└─ Shop Settings (/shop/settings)
```

### Role Transition Flow

```
Customer User
    ↓
Create Shop (via /profile)
    ↓
[Shop Created - User becomes Merchant]
    ↓
Access Merchant Routes (/shop/*)
    ↓
[Can still access customer routes]
```

---

## 🎯 Best Practices

1. **Always use ProtectedRoute** for authenticated pages
2. **Specify allowedRoles** for role-specific features
3. **Set redirectTo** for custom redirect behavior
4. **Leverage role inheritance** - merchants should access customer routes naturally
5. **Use dynamic routes** for resource-specific pages (products, orders, etc.)
6. **Query parameters** for non-critical filters to preserve shareable URLs
7. **Check auth state** before rendering sensitive information

---

## 📝 Route Modification Guide

### Adding a New Protected Route

1. Create folder: `src/app/new-route/`
2. Create `page.tsx` with `"use client"` directive
3. Wrap with `ProtectedRoute`:
   ```tsx
   <ProtectedRoute allowedRoles={["customer"]}>
     {/* Your content */}
   </ProtectedRoute>
   ```
4. Update this documentation

### Adding a New Merchant-Only Route

```tsx
<ProtectedRoute allowedRoles={["merchant"]}>
  <MerchantContent />
</ProtectedRoute>
```

### Adding a Dynamic Route

1. Create folder: `src/app/dynamic-name/[paramName]/`
2. Create `page.tsx`
3. Extract params using `useParams()`
4. Update route table in this document

---

## 🔗 Related Documentation

- [API Reference](./api-reference.md) - Backend API endpoints
- [System Flow](./system-flow.md) - Overall system architecture
- [Existing Features](./existing-features.md) - Feature documentation
- [AGENTS.md](../AGENTS.md) - Development standards and guidelines

---

*Last Updated: January 28, 2026*
*Maintained by: Development Team*
