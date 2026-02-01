# API Reference

This document provides a comprehensive list of all API endpoints available in the Icon Shoppers system.

## Endpoints Summary

### Authentication
- `POST /api/login` ( in use ) - User login
- `POST /api/register` ( in use ) - User registration
- `POST /api/logout` ( in use ) - User logout (Authenticated)

### Profile & User
- `GET /api/profile` (in use) - Get merchant profile (Authenticated)
- `POST /api/profile` (in use) - Update merchant profile (Authenticated)

### Products
- `GET /api/products/all` (in use) - Fetch all published products
- `GET /api/products/featured` (in use) - Fetch featured products
- `GET /api/products/top-selling` (in use) - Fetch top selling products
- `GET /api/products/category/{categoryId}` (in use) - Fetch products by category
- `GET /api/products/{slug}` (in use) - Fetch details of a specific product
- `GET /api/products/{id}/related` (in use) - Fetch related products
- `GET /api/merchant/products` (in use) - List products for merchant (Authenticated)
- `POST /api/merchant/products` (in use) - Create new product (Authenticated)
- `POST /api/merchant/products/{id}` (in use) - Update product (Authenticated)
- `DELETE /api/merchant/products/{id}` (in use) - Delete product (Authenticated)

### Orders
- `GET /api/seller/orders` (in use) - List orders for seller (Authenticated)
- `PUT /api/orders/{id}/status` (in use) - Update order status (Authenticated)
- `GET /api/customer/orders` (in use) - List orders for customer (Authenticated)
- `POST /api/checkout` (in use) - Place a new order (Authenticated)
- `GET /api/orders/{orderNumber}` (in use) - View specific order details (Authenticated)
- `POST /api/orders/{id}/cancel` (in use) - Cancel an order (Authenticated)

### Shops
- `GET /api/shops` (in use) - List all shops
- `GET /api/shop/{name}` (in use) - Get specific shop details by slug
- `POST /api/shops` (in use) - Create a shop (Authenticated)
- `GET /api/shop/analytics` (in use) - Get shop sales analytics (Authenticated)

### Cart
- `GET /api/to-checkout` (in use) - Get current cart items (Authenticated)
- `POST /api/cart/{id}` (in use) - Add/Update item in cart (Authenticated)
- `DELETE /api/cart-item/{id}` (in use) - Remove item from cart (Authenticated)

### Categories
- `GET /api/categories` (in use) - List all categories
- `GET /api/categories/{slug}` (in use) - Get category details

### Addresses
- `GET /api/addresses` (in use) - List user addresses (Authenticated)
- `POST /api/addresses` (in use) - Store new address (Authenticated)
- `PUT /api/addresses/{id}` (in use) - Update address (Authenticated)
- `DELETE /api/addresses/{id}` (in use) - Delete address (Authenticated)
- `POST /api/addresses/{id}/set-default` (in use) - Set default address (Authenticated)

### Ratings
- `GET /api/product-ratings/{product}` (in use) - Get product ratings
- `POST /api/customer/product-ratings` (in use) - Post a product rating (Authenticated)

### Wishlist
- `GET /api/wishlist` (in use) - List wishlist items (Authenticated)
- `POST /api/wishlist/toggle` (in use) - Toggle item in wishlist (Authenticated)
- `DELETE /api/wishlist/{productId}` (in use) - Remove item from wishlist (Authenticated)

### Chat & Messaging
- `GET /api/conversations` (in use) - List user conversations (Authenticated)
- `GET /api/conversations/{id}` (in use) - Get specific conversation details (Authenticated)
- `GET /api/conversations/{id}/messages` (in use) - Fetch messages for a conversation (Authenticated)
- `POST /api/conversations/{id}/messages` (in use) - Send a message (Authenticated)

### Notifications
- `GET /api/notifications` (in use) - List user notifications (Authenticated)
- `GET /api/notifications/unread-count` (in use) - Get count of unread notifications (Authenticated)
- `POST /api/notifications/{id}/read` (in use) - Mark notification as read (Authenticated)
- `POST /api/notifications/read-all` (in use) - Mark all notifications as read (Authenticated)

---

## Endpoint Details

### Authentication

#### **POST** `/api/login`
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```
**Response:**
```json
{
  "user": { ... },
  "token": "sanctum-token"
}
```

#### **POST** `/api/register`
**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password",
  "password_confirmation": "password"
}
```
**Response:**
```json
{
  "user": { ... },
  "token": "sanctum-token"
}
```

### Chat & Messaging

#### **GET** `/api/conversations`
**Response:** Array of conversation objects with last message and participant details.

#### **POST** `/api/conversations/{id}/messages`
**Request Body:**
```json
{
  "message": "Hello, is this product available?"
}
```
**Response:** Created message object, broadcasted via WebSockets.

### Notifications

#### **GET** `/api/notifications`
**Response:** Paginated list of notifications with type and data payload.

#### **POST** `/api/notifications/{id}/read`
**Response:** `{"success": true}`

### Products

#### **GET** `/api/products/{slug}`
**Response:** Detailed product object including shop information and category.

#### **POST** `/api/merchant/products`
**Request Body (Multipart/Form-Data):** `name`, `price`, `stock`, `description`, `category_id`, `image` (file).
**Response:** Created product object.

### Orders

#### **POST** `/api/checkout`
**Request Body:**
```json
{
  "payment_method": "cod",
  "delivery_method": "pickup/delivery",
  "shipping_address": "Full address string",
  "notes": "Optional notes"
}
```
**Response:** Created order object with `order_number`.

#### **PUT** `/api/orders/{id}/status`
**Request Body:**
```json
{
  "status": "approved/processing/delivering/etc"
}
```
**Response:** Updated order object.

### Cart

#### **POST** `/api/cart/{id}`
**Request Body:**
```json
{
  "quantity": 2
}
```
**Note:** `{id}` is the Product ID.

### Wishlist

#### **POST** `/api/wishlist/toggle`
**Request Body:**
```json
{
  "product_id": 123
}
```
