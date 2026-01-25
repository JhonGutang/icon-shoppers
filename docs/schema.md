# Database Schema Documentation

This document describes the database schema for the Icon Shoppers application.

## Core Tables

### 1. `shops`
Represents the merchant/seller accounts.
- `id` (Primary Key)
- `name`: Shop name
- `owner`: Owner's name
- `email`: Contact email (unique)
- `contact_number`: Phone number
- `logo_image`: Path to shop logo
- `description`: Shop description
- `password`: Hashed password
- `role`: Default is 'shop'
- `timestamps`: `created_at`, `updated_at`

### 2. `customers`
Represents the buyer/customer accounts.
- `id` (Primary Key)
- `name`: Customer name
- `middle_name`: Optional middle name
- `contact_number`: Phone number (unique)
- `address`: Shipping address
- `email`: Login email (unique)
- `password`: Hashed password
- `role`: Default is 'customer'
- `timestamps`

### 3. `products`
Items listed for sale by shops.
- `id` (Primary Key)
- `shop_id`: Foreign key to `shops.id`
- `name`: Product name
- `description`: Detailed product description
- `price`: Product price (decimal)
- `quantity`: Stock quantity
- `image`: Path to product image
- `is_visible`: Boolean for visibility
- `is_featured`: Boolean for featured products
- `timestamps`

### 4. `orders`
Captured purchase transactions.
- `id` (Primary Key)
- `customer_id`: Foreign key to `customers.id`
- `status_id`: Foreign key to `order_statuses.id` (default: 1)
- `total_amount`: Total order cost
- `location`: Specific delivery location or notes
- `timestamps`

### 5. `order_items`
Individual products within an order.
- `id` (Primary Key)
- `order_id`: Foreign key to `orders.id`
- `product_id`: Foreign key to `products.id`
- `quantity`: Quantity purchased
- `price`: Price at time of purchase
- `timestamps`

### 6. `order_statuses`
Lookup table for order states.
- `id` (Primary Key)
- `status`: Unique status name (e.g., 'ordered', 'approved', 'delivered', etc.)
- `timestamps`

## Support Tables

### 1. `carts` & `cart_items`
- `carts`: `id`, `customer_id`
- `cart_items`: `id`, `cart_id`, `product_id`, `quantity`

### 2. `product_ratings`
- `id`, `product_id`, `customer_id`, `rating` (1-5), `feedback`

### 3. `product_rating_summaries` & `shop_rating_summaries`
- Cache for average ratings and total counts.

## Relationships
- **Shop has many Products.**
- **Customer has many Orders.**
- **Order has many OrderItems.**
- **Order belongs to a Status.**
- **Product belongs to a Shop.**
- **OrderItem belongs to an Order and a Product.**
- **Customer has one Cart.**
- **Cart has many CartItems.**
