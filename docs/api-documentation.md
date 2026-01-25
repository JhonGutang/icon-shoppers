# Icon Shoppers API Documentation

This document provides a comprehensive overview of the Icon Shoppers API, designed to support local products and farmers in the Pinamungajan to Balamban region.

**Base URL:** `/api`

---

## 🔐 Authentication

All authenticated requests must include the `Authorization: Bearer <token>` header.

### Login
*   **URL:** `/login`
*   **Method:** `POST`
*   **Description:** Authenticate a user and receive a token.
*   **Payload:**
    ```json
    {
      "email": "user@example.com",
      "password": "password"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "user": { ... },
      "token": "...",
      "role": "customer" // or "merchant"
    }
    ```

### Register
*   **URL:** `/register`
*   **Method:** `POST`
*   **Description:** Register a new customer.
*   **Payload:**
    ```json
    {
      "name": "John Doe",
      "middle_name": "Smith",
      "contact_number": "09123456789",
      "address": "Balamban, Cebu",
      "email": "john@example.com",
      "password": "password"
    }
    ```
*   **Response (201 Created):**
    ```json
    {
      "message": "User created successfully.",
      "user": { ... }
    }
    ```

### Logout
*   **URL:** `/logout`
*   **Method:** `POST`
*   **Authentication:** Required
*   **Description:** Revoke the current user's token.
*   **Response (200 OK):**
    ```json
    {
      "message": "Logged out successfully"
    }
    ```

---

## 🍎 Products

### Fetch All Products
*   **URL:** `/all-products`
*   **Method:** `GET`
*   **Description:** Fetch all visible products.
*   **Query Parameters:**
    - `type`: `all` (default) or `featured`
*   **Response (200 OK):**
    ```json
    [
      {
        "id": 1,
        "name": "Fresh Mangoes",
        "shop_id": 2,
        "price": "150.00",
        "quantity": 50,
        "image": "...",
        "is_visible": true,
        "is_featured": false,
        "shop_name": "Local Farm"
      },
      ...
    ]
    ```

### Fetch Featured Products
*   **URL:** `/featured-products`
*   **Method:** `GET`
*   **Description:** Fetch products marked as featured and visible.
*   **Response (200 OK):** Same structure as `/all-products`.

### Fetch Specific Product
*   **URL:** `/product/{id}`
*   **Method:** `GET`
*   **Description:** Fetch detailed information about a single product.
*   **Response (200 OK):**
    ```json
    {
      "id": 1,
      "name": "...",
      "description": "...",
      "shop_id": 2,
      "price": "...",
      "quantity": 10,
      "image": "...",
      "is_visible": true,
      "is_featured": false,
      "shop_name": "..."
    }
    ```

### Search Products
*   **URL:** `/search-products`
*   **Method:** `GET`
*   **Description:** Search products by name or description.
*   **Query Parameters:**
    - `search`: The search term.
*   **Response (200 OK):** Same structure as `/all-products`.

### [Merchant] Fetch Shop Products
*   **URL:** `/products`
*   **Method:** `GET`
*   **Authentication:** Required (Merchant)
*   **Description:** Fetch all products belonging to the authenticated shop.
*   **Response (200 OK):** Array of product objects.

### [Merchant] Create Product
*   **URL:** `/product`
*   **Method:** `POST`
*   **Authentication:** Required (Merchant)
*   **Description:** Add a new product to the shop.
*   **Payload (Multipart/Form-Data):**
    - `name`: string (Required)
    - `price`: numeric (Required)
    - `quantity`: integer (Required)
    - `image`: file (Optional)
*   **Response (200 OK):** The created product object.

### [Merchant] Update Product
*   **URL:** `/product/{id}`
*   **Method:** `POST`
*   **Authentication:** Required (Merchant)
*   **Description:** Update an existing product.
*   **Payload (Multipart/Form-Data):**
    - `name`: string (Optional)
    - `price`: numeric (Optional)
    - `quantity`: integer (Optional)
    - `is_visible`: boolean (Optional)
    - `is_featured`: boolean (Optional)
    - `image`: file (Optional)
*   **Response (200 OK):** The updated product object.

### [Merchant] Delete Product
*   **URL:** `/products/{product_id}`
*   **Method:** `DELETE`
*   **Authentication:** Required (Merchant)
*   **Description:** Remove a product from the shop.
*   **Response (200 OK):** `{"message": "Product deleted successfully"}`

---

## 🏪 Shops

### Fetch All Shops
*   **URL:** `/shops`
*   **Method:** `GET`
*   **Description:** Fetch all registered shops.
*   **Query Parameters:**
    - `search`: string (Optional) - filter shops by name.
*   **Response (200 OK):** Array of shop objects.

### Fetch Specific Shop
*   **URL:** `/shop/{name}`
*   **Method:** `GET`
*   **Description:** Fetch details of a shop by its name.
*   **Response (200 OK):**
    ```json
    {
      "success": true,
      "data": { ... }
    }
    ```

---

## 🛒 Cart

### View Cart
*   **URL:** `/to-checkout`
*   **Method:** `GET`
*   **Authentication:** Required (Customer)
*   **Description:** Retrieve items currently in the user's cart.
*   **Response (200 OK):** Array of cart items.

### Add to Cart
*   **URL:** `/cart/{id}`
*   **Method:** `POST`
*   **Authentication:** Required (Customer)
*   **Description:** Add a specific product to the cart.
*   **Response (200 OK):** `{"message": "Product added to cart successfully"}`

### Remove from Cart
*   **URL:** `/order/{id}`
*   **Method:** `DELETE`
*   **Authentication:** Required (Customer)
*   **Description:** Remove an item from the cart.
*   **Response (200 OK):** `{"message": "Product removed from cart successfully."}`

---

## 📦 Orders

### [Merchant] View Received Orders
*   **URL:** `/orders`
*   **Method:** `GET`
*   **Authentication:** Required (Merchant)
*   **Description:** Fetch orders made to the merchant's shop.
*   **Query Parameters:**
    - `status`: string (Optional) - filter by status.
*   **Response (200 OK):** Array of orders.

### [Customer] View My Orders
*   **URL:** `/customer/orders`
*   **Method:** `GET`
*   **Authentication:** Required (Customer)
*   **Description:** Fetch orders placed by the customer.
*   **Query Parameters:**
    - `status`: string (Optional) - filter by status.
*   **Response (200 OK):** Array of orders.

### Update Order Status
*   **URL:** `/status-update/{id}`
*   **Method:** `PUT`
*   **Authentication:** Required
*   **Description:** Update the status of an order.
*   **Payload:**
    ```json
    {
      "status": "approved" // or "rejected", "to_be_delivered", "delivering", "recieved", "not_recieved", "completed"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Order status updated successfully",
      "order": { ... }
    }
    ```

### Checkout Order
*   **URL:** `/checkout`
*   **Method:** `PATCH`
*   **Authentication:** Required (Customer)
*   **Description:** Proceed to checkout items in the cart.
*   **Payload:**
    ```json
    {
      "products": [ { "id": 1, ... }, ... ]
    }
    ```
*   **Response (200 OK):** `{"message": "Order created and checked out successfully"}`

### Mark as Received
*   **URL:** `/orders/{id}/receive`
*   **Method:** `PUT`
*   **Authentication:** Required (Customer)
*   **Description:** Mark an order as received by the customer.
*   **Response (200 OK):** Response from order status update.

---

## ⭐ Ratings

### Fetch Product Ratings
*   **URL:** `/product-ratings/{product}`
*   **Method:** `GET`
*   **Description:** Get average rating and total count for a product.
*   **Response (200 OK):**
    ```json
    {
      "total": 5,
      "average": 4.5
    }
    ```

### Rate Product
*   **URL:** `/customer/product-ratings`
*   **Method:** `POST`
*   **Authentication:** Required (Customer)
*   **Description:** Submit a rating and feedback for a product.
*   **Payload:**
    ```json
    {
      "product_id": 1,
      "rating": 5, // 1-5
      "feedback": "string" (Optional)
    }
    ```
*   **Response (201 Created):** The rating object.

### Rate Shop
*   **URL:** `/customer/shop-ratings`
*   **Method:** `POST`
*   **Authentication:** Required (Customer)
*   **Description:** Submit a rating for a shop.
*   **Payload:**
    ```json
    {
      "shop_id": 2,
      "rating": 5,
      "feedback": "Excellent service."
    }
    ```
*   **Response (201 Created):** The rating object.

---

## 👤 Profile Management

### View Profile (Unified)
*   **URL:** `/profile`
*   **Method:** `GET`
*   **Authentication:** Required
*   **Description:** Get the profile of the authenticated user.
*   **Response (200 OK):** `{"user": { ... }}`

### [Merchant] Update Shop Profile
*   **URL:** `/profile`
*   **Method:** `POST`
*   **Authentication:** Required (Merchant)
*   **Description:** Update shop profile details and logo.
*   **Payload (Multipart/Form-Data):**
    - `name`: string (Optional)
    - `email`: email (Optional)
    - `contact_number`: string (Optional)
    - `description`: string (Optional)
    - `logo_image`: file (Optional)
*   **Response (200 OK):**
    ```json
    {
      "message": "Profile updated successfully",
      "shop": { ... }
    }
    ```

### [Customer] View Profile
*   **URL:** `/customer-profile`
*   **Method:** `GET`
*   **Authentication:** Required (Customer)
*   **Description:** Retrieve customer profile information.
*   **Response (200 OK):** User object.

> [!NOTE]
> Some routes like `/seller/orders` and `/profile/upload-logo` are defined in `api.php` but may require specific implementation in their respective controllers to be fully functional.
